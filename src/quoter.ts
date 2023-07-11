import { CRYPTO_CURRENCIES, CryptoCurrency, FiatCurrency } from "./currencies";
/**
 * The HTTP header field CoinMarketCap (CMC) uses to authenticate requests
 */
const CMC_HEADER_AUTH_FIELD = "X-CMC_PRO_API_KEY";

/**
 * The abtract {@link Quoter} class allows making crypto quote requests using
 * it's main method {@link quote}
 */
export interface Quoter {
    /**
     * Makes an asynchronous quote request in the fiat currency and about the
     * crypto currencies as specified in the {@link request}
     * @param {QuoteRequest} request
     * @returns {Promise<QuoteResult>}
     */
    quote: (request: QuoteRequest) => Promise<QuoteResult>;
}

/**
 * Specifies a set of crypto currencies to be quoted and the desired fiat
 * currencies for that quote to be expressed in.
 */
export type QuoteRequest = {
    crypto_currencies: Array<CryptoCurrency>;
    fiat_currency: FiatCurrency;
};

/**
 * The result of calling {@link Quoter.quote}: For each crypto currency in the
 * {@link QuoteRequest} contains a {@link Quote} for that crypto currency.
 */
export type QuoteResult = {
    [crypto_symbol: string]: Quote;
};

/**
 * A quote resulting from calling {@link Quoter.quote}
 */
export type Quote = {
    fiat_currency: string;
    price: number;
    volume_24h: number;
    volume_change_24h: number;
    market_cap: number;
    market_cap_dominance: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
};

// CoinMarketCapQuoter

/** Arguments for the constructor of {@link CoinMarketCapQuoter}  */
export type CoinMarketCapQuoterInit = {
    server: string;
    quote_endpoint: string;
    api_key: string;
};

/**
 * CoinMarketCap status information as returned from the server.
 * 
 * Based on documentation at: 
 * https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest
 */
export type CoinMarketCapStatus = {
    /** Current timestamp (ISO 8601) on the server. */
    timestamp: string;
    
    /** 
     * An internal error code for the current error. If a unique platform error 
     * code is not available the HTTP status code is returned. null is returned 
     * if there is no error. 
     */
    error_code: number | null;
    
    /** An error message to go along with the error code. */
    error_message?: string;
    
    /** Elapsed time in ms */
    elapsed?: number; 
    
    /** Number of API call credits that were used for this call. */
    credit_count?: number; 

    /** Optional notice about API key information. */
    notice?: string;
};

/**
 * An error as returned from the CoinMarkCap API
 * @param {CoinMarketCapStatus} status Status object containing
 */
export class CoinMarketCapError extends Error {
    constructor(public status: CoinMarketCapStatus) {
        super(
            `CoinMarketCap Error code ${status.error_code}: ${status.error_message}`
        );
    }
}

/**
 * A {@link Quoter} for the CoinMarketCap api service. 
 * 
 * Allows making crypto quote requests using
 * it's main method {@link quote}
 */
export class CoinMarketCapQuoter implements Quoter {
    constructor(private init: CoinMarketCapQuoterInit) {}

    /** 
     * Uses {@link fetch} to make an quote request to CoinMarketCap for the 
     * specified crypto currencies and in the specified fiat currency
     */
    private async fetchQuote(
        crypto_currencies: CryptoCurrency[],
        fiat_currency: FiatCurrency
    ): Promise<{ status: CoinMarketCapStatus; data?: any }> {
        const slugs = crypto_currencies.map(
            (symbol) => CRYPTO_CURRENCIES[symbol].slug
        );

        const params = {
            slug: slugs.join(","),
            convert: fiat_currency,
        };

        const headers = {
            [CMC_HEADER_AUTH_FIELD]: this.init.api_key,
        };

        let response = await fetch(
            `${this.init.server}/${
                this.init.quote_endpoint
            }?${convertToQueryString(params)}`,
            { headers }
        );

        return await response.json();
    }

    /**
     * Parses the data as returned from the CoinMarketCap quote api call into 
     * the internal {@link QuoteResult}.
     */
    private parseResult(fiat_currency: FiatCurrency, data: any): QuoteResult {
        
        // we will output a QuoteResult mapping CryptoCodes to Quotes
        let output: QuoteResult = {};

        // data is an object which looks like {'0': ..., '1': ..., etc...}
        for (let key in data) {

            // every item has a `quote` and `symbol` which is the crypto 
            // currency symbol
            const item = data[key];
            let crypto_currency = item.symbol;

            const quote = item.quote[fiat_currency];

            // Add information about the fiat currency and add it to the result
            output[crypto_currency] = {
                fiat_currency,
                ...quote,
            };
        }

        return output;
    }

    // The implementation of Quoter.quote
    async quote(request: QuoteRequest): Promise<QuoteResult> {
        const { crypto_currencies, fiat_currency } = request;

        const result = await this.fetchQuote(crypto_currencies, fiat_currency);

        // the result has an error if the data field is not present
        if (result.data) {
            return this.parseResult(fiat_currency, result.data);
        } else {
            throw new CoinMarketCapError(result.status);
        }
    }
}

function convertToQueryString(obj: { [key: string]: string }): string {
    return new URLSearchParams(obj).toString();
}
