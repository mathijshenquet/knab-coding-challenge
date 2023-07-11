
# Knab Coding Challenge: Crypto Emailer 📧💰

Welcome to Crypto Emailer, a Node.js/Typescript web application that keeps you 
updated with the latest cryptocurrency quotes. This project was created as a 
coding challenge for the Dutch bank, Knab. 

## Getting Started 🚀

To get started, clone this repository to your local machine. 

```bash
git clone https://github.com/mathijshenquet/knab-coding-challenge.git
cd knab-coding-challenge
```

### Installation 🛠️

This is an npm project. Install the dependencies with the following command:

```bash
npm install
```

### Configuration ⚙️

Configuration is done using the environment, to make this easy dotenv is used. 
To set it up, rename `example.env` to `.env` in the root directory and enter 
your CoinMarketCap API key.

```bash
mv example.env .env
```

Then, open `.env` and update `COINMARKETCAP_KEY` with your actual API key.

### Running the server 

You can run the app with the following command:

```bash
npm run start
```

### Testing

Testing is done with Jest with all tests located in `/tests`. You can run these 
tests with the following command:

```bash
npm run test
```

## Technical Decisions

1. **Stub Mailer**: Instead of sending actual emails, which would be outside of 
the scope of this project, a stub mailer is implemented in `src/mailer.ts` which 
outputs email to stdout.

2. **Timeout Scheduler**: Likewise a simple Timeout based scheduler is 
implemented in `src/scheduler.ts`. Making this persistent together with the 
other state would be a next step.

3. **Templating Engine**: It uses a simple templating engine (Handlebars) both 
for the webpages and some of the emails. For styling, FontAwesome and 
Bootstrap 4 are used.

## License 📝

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.