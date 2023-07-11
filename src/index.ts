import * as dotenv from "dotenv";
import { Mailer, StreamMailer } from "./mailer";
import { makeServer } from "./server";
import { Controller } from "./controller";
import { CoinMarketCapQuoter, Quoter } from "./quoter";
import { Scheduler, TimeoutScheduler } from "./scheduler";

// Loading environment variables from .env file
dotenv.config();

// Checking if the right environment variables are set

if (!process.env.PORT) {
    throw new Error("Missing PORT environment variable");
}
const PORT: number = +process.env.PORT;

if (!process.env.PUBLIC_ENDPOINT) {
    throw new Error("Missing PUBLIC_ENDPOINT environment variable");
}
const PUBLIC_ENDPOINT: string = process.env.PUBLIC_ENDPOINT;

if (!process.env.EMAIL_SENDER) {
    throw new Error("Missing EMAIL_SENDER environment variable");
}
const EMAIL_SENDER: string = process.env.EMAIL_SENDER;

if (!process.env.COINMARKETCAP_KEY) {
    throw new Error("Missing COINMARKETCAP_KEY environment variable");
}
const COINMARKETCAP_KEY: string = process.env.COINMARKETCAP_KEY;

if (!process.env.EMAIL_INTERVAL) {
    throw new Error("Missing EMAIL_INTERVAL environment variable");
}
const EMAIL_INTERVAL: number = +process.env.EMAIL_INTERVAL ?? 5;

// Set up a stub StreamMailer which will send output to stdout as the Mailer
const mailer: Mailer = new StreamMailer({
    from: EMAIL_SENDER,
    stream: process.stdout,
});

// Set up a CoinMarketCap Quoter as the quoter
const quoter: Quoter = new CoinMarketCapQuoter({
    api_key: COINMARKETCAP_KEY,
    server: "https://pro-api.coinmarketcap.com",
    quote_endpoint: "v2/cryptocurrency/quotes/latest",
});

const scheduler: Scheduler = new TimeoutScheduler();

const controller = new Controller({
    mailer,
    publicRoot: PUBLIC_ENDPOINT,
    quoter,
    scheduler,
    email_interval_ms: EMAIL_INTERVAL * 1000,
});

const app = makeServer(controller);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
    console.log(`Reachable at ${PUBLIC_ENDPOINT}`);
});
