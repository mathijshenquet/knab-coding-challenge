// Import the necessary packages
import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import { CRYPTO_CURRENCIES, CryptoCurrency, FIAT_CURRENCIES, FiatCurrency } from "./currencies";
import { Controller, NotificationRequest } from "./controller";


/** 
 * Make Server
 *
 * Sets up and starts an Express server instance using the given controller. The server uses Express
 * handlebars as its rendering engine and bodyParser to parse incoming requests. It provides routes 
 * for confirming an action via GET and receiving data via POST
 *
 * @param controller The controller to be used by the server
 * @returns the Express server instance ('app')
*/
export function makeServer(controller: Controller){
    // Create Express application
    let app = express();

    // Set the engine and default layout
    app.engine("handlebars", engine());

    // Define the view engine and the folder for the views
    app.set("view engine", "handlebars");
    app.set("views", "./views");

    // Use bodyParser middleware for parsing JSON and url-encoded bodies
    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(
        bodyParser.urlencoded({
            // to support URL-encoded bodies
            extended: true,
        })
    );

    // Set locals to use in our views
    app.locals.fiat_currencies = FIAT_CURRENCIES;
    app.locals.crypto_currencies = CRYPTO_CURRENCIES;

    // Serve index page for GET requests on root ('/') route
    app.get("/", (req, res) => {
        return res.render("index");
    });

    // Handle sign up request with a POST on ('/') route
    app.post("/", (req, res) => {
        // these variable will be filled from the POST request
        let fiat_currency: FiatCurrency | null = null;
        let email: string | null = null;
        let crypto_currencies: Array<CryptoCurrency> = [];

        let errors = [];

        // get and validate `email`
        if (!req.body.email || typeof req.body.email != "string") {
            //TODO verify that email looks like an email
            errors.push("Missing or malformed email field");
        } else {
            email = req.body.email;
        }

        // get and validate `cryto_currencies`
        if (!req.body.crypto_currencies) {
            errors.push("Missing crypto_currencies field");
        }else{
            if (typeof req.body.crypto_currencies == "string") {
                crypto_currencies.push(req.body.crypto_currencies);
            } else if (req.body.crypto_currencies instanceof Array) {
                req.body.crypto_currencies.forEach((code: any) => {
                    if (typeof code == "string" && code in CRYPTO_CURRENCIES) {
                        // @ts-ignore
                        crypto_currencies.push(code);
                    }
                });
            } else {
                errors.push("Malformed crypto_currencies field");
            }
        }

        // get and validate `fiat_currencies`
        if (!req.body.fiat_currency || typeof(req.body.fiat_currency) != "string" || !(req.body.fiat_currency in FIAT_CURRENCIES)) {
            errors.push("Missing or malformed fiat currencies field");
        } else {
            fiat_currency = req.body.fiat_currency;
        }

        // if there are errors, render the page again while showing the errors
        if(errors.length > 0){
            console.error(errors);
            res.locals.error = `The following errors have occured: ${errors.join(", ")}`;

            return res.render("index");
        }else{
            let confirmationRequest: NotificationRequest = {
                email: email!,
                fiat_currency: fiat_currency!,
                crypto_currencies
            }

            controller.requestNotifications(confirmationRequest);

            if (errors.length == 0) {
                res.locals.success =
                    "A confirmation email has been sent! Please click the confirmation link";
            }

            return res.render("index");
        }
    });

    // Confirm sign-up with a GET requests on '/confirm' route
    // Requires the user id as a query parameter
    app.get("/confirm", async (req, res) => {
        // Check if 'id' query parameter exists
        if (!req.query.id) {
            throw new Error("Confirmation id not present");
        }

        let id = req.query.id;
        if (id instanceof Array) {
            id = id[0];
        }

        // Ensure 'id' is a string
        if (typeof id != "string") {
            throw new Error("Malformed id");
        }

        console.log(`Confirming ${id}`);

        if(await controller.confirm(id)){
            res.locals.success = "Successfully signed up for updates"
        }

        return res.render("index")
    });

    // Cancel subscription with a GET request on the  '/cancel' route
    // Requires the user id as a query parameter
    app.get("/cancel", async (req, res) => {
        // Check if 'id' query parameter exists
        if (!req.query.id) {
            throw new Error("Confirmation id not present");
        }

        let id = req.query.id;
        if (id instanceof Array) {
            id = id[0];
        }

        // Ensure 'id' is a string
        if (typeof id != "string") {
            throw new Error("Malformed id");
        }

        console.log(`Canceling ${id}`);

        if(await controller.unsubscribe(id)){
            res.locals.success = "Canceled subscription"
        }else{
            res.locals.error = "Subscription unknown"
        }

        return res.render("index")
    });

    return app;
}