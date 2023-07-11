import {
    Controller,
    NotificationRequest,
    ControllerInit,
} from "../src/controller";
import { Mail, Mailer } from "../src/mailer";
import { QuoteRequest, Quoter } from "../src/quoter";
import { Scheduler, Task } from "../src/scheduler";

describe("Controller", () => {
    const mailer: Mailer = {
        send(email: Mail) {
            return;
        },
    };

    const quoter: Quoter = {
        async quote(request: QuoteRequest) {
            return {};
        },
    };

    const scheduler: Scheduler = {
        schedule: function (task: Task): void {
            return;
        }
    }
    
    let controller: Controller;
    let init: ControllerInit;
    let request: NotificationRequest;

    beforeEach(() => {
        init = {
            mailer,
            publicRoot: "public",
            quoter,
            scheduler,
            email_interval_ms: 1000
        };
        controller = new Controller(init);
        request = {
            fiat_currency: "EUR",
            crypto_currencies: ["BTC"],
            email: "test@example.com",
        };
    });

    it("should create a new email", async () => {
        const spy = jest.spyOn(mailer, "send");
        await controller.makeEmail(request);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({subject: "Crypto notifier confirmation email"}));
    });

    it("should send notification confirmation", async () => {        
        const spy = jest.spyOn(mailer, "send");
        await controller.requestNotifications(request);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({subject: "Crypto notifier confirmation email"}));
    });

    it("should confirm requests", async () => {
        await controller.makeEmail(request);
        const id = Object.keys(controller["confirmations"])[0];
        const result = await controller.confirm(id);
        expect(result).toBe(true);
    });

    it("should not confirm request with invalid id", async () => {
        const result = await controller.confirm("invalid-id");
        expect(result).toBe(false);
    });

    it("should unsubscribe requests", async () => {
        await controller.makeEmail(request);
        const id = Object.keys(controller["confirmations"])[0];
        await controller.confirm(id);
        const result = await controller.unsubscribe(id);
        expect(result).toBe(true);
    });

    it("should not unsubscribe request with invalid id", async () => {
        const result = await controller.unsubscribe("invalid-id");
        expect(result).toBe(false);
    });

    it("should send crypto updates", async () => {
        await controller.makeEmail(request);
        const id = Object.keys(controller["confirmations"])[0];
        await controller.confirm(id);
        const spy = jest.spyOn(mailer, "send");
        const result = await controller.sendCryptoUpdates(id);
        expect(result).toBe(true);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({subject: "Crypto updates"}));
    });

    it("should not send crypto updates for invalid id", async () => {
        const result = await controller.sendCryptoUpdates("invalid-id");
        expect(result).toBe(false);
    });
});
