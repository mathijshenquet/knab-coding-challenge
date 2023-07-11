
import {Mailer} from "./mailer";
import { CryptoCurrency, FIAT_CURRENCIES, FiatCurrency } from './currencies';
import { Quoter } from './quoter';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { Scheduler } from "./scheduler";

Handlebars.registerHelper('join_comma', function (array) {
    return array.join(", ")
})

export type NotificationRequest = {
    fiat_currency: FiatCurrency;
    crypto_currencies: Array<CryptoCurrency>;
    email: string;
};

export type ControllerInit = {
    mailer: Mailer,
    publicRoot: string,
    quoter: Quoter,
    scheduler: Scheduler,
    email_interval_ms: number,
}

let email_template_promise = fs.readFile("views/emails/price_update.handlebars", "utf8").then(Handlebars.compile);
let confirmation_template_promise = fs.readFile("views/emails/confirmation.handlebars", "utf8").then(Handlebars.compile);

export class Controller {
    private confirmations: {[id: string]: NotificationRequest} = {};
    private subscriptions: {[id: string]: NotificationRequest} = {};
    private mailer: Mailer;
    private quoter: Quoter;
    private publicRoot: string;
    private scheduler: Scheduler;
    private email_interval_ms: number;

    constructor(init: ControllerInit){
        this.mailer = init.mailer;
        this.publicRoot = init.publicRoot
        this.quoter = init.quoter;
        this.scheduler = init.scheduler;
        this.email_interval_ms = init.email_interval_ms;
    }

    /**
     * Send a crypto update to the user identified with UUID {@link id}
     * 
     * @param id The UUID of the user
     * @returns Whether to continue sending this user updates
     */
    async sendCryptoUpdates(id: string): Promise<boolean> {
        if(!(id in this.subscriptions)){
            return false;
        }

        let request = this.subscriptions[id];

        let quotes = await this.quoter.quote(request)

        let template = await email_template_promise;

        let fiat = FIAT_CURRENCIES[request.fiat_currency];

        let locals: any = { quotes, fiat }
        if(id){
            locals.cancel_link = new Handlebars.SafeString(`${this.publicRoot}/cancel?id=${id}`);
        }

        let text = template(locals);

        this.mailer.send({
            to: request.email,
            subject: "Crypto updates",
            text
        });

        return true;
    }

    async makeEmail(notificationRequest: NotificationRequest) {
        let id: string = crypto.randomUUID();
        let confirm_link = `${this.publicRoot}/confirm?id=${id}`;
    
        console.log("Made id", id, confirm_link)

        this.confirmations[id] = notificationRequest;
    
        let { fiat_currency, crypto_currencies, email } = notificationRequest;
    
        let confirmation_template = await confirmation_template_promise;

        let text = confirmation_template({fiat_currency, crypto_currencies, confirm_link: new Handlebars.SafeString(confirm_link)});

        this.mailer.send({
            to: email,
            subject: "Crypto notifier confirmation email",
            text,
        });
    }
    
    requestNotifications(confirmationRequest: NotificationRequest) {
        /// TODO check stuff

        this.makeEmail(confirmationRequest);

        // this.fetchInfo(confirmationRequest);
    }

    
    /**
     * Confirm subscription of the user with UUID {@link id}
     * 
     * @returns Whether the subscribe was successfull
     */
    async confirm(id: string): Promise<boolean> {
        if (!(id in this.confirmations)) {
            return false;
        }

        let notificationRequest = this.confirmations[id];
        // console.log("Success", notificationRequest);

        delete this.confirmations[id];
        this.subscriptions[id] = notificationRequest;

        // send the initial crypto update
        await this.sendCryptoUpdates(id);

        // now schedule a regular update
        this.scheduler.schedule({
            name: `Notifiying ${notificationRequest.email}`,
            interval: this.email_interval_ms,
            run: async () => {
                return await this.sendCryptoUpdates(id);
            }
        });

        return true;
    }

    /**
     * Unsubscribe the subscription of the user with UUID {@link id}
     * 
     * @returns Whether the unsubscribe was successfull
     */
    async unsubscribe(id: string): Promise<boolean> {
        if (!(id in this.subscriptions)) {
            return false;
        }

        delete this.subscriptions[id];
        return true;
    }
}