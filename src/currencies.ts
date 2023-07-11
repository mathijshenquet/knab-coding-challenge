/** Info on a cypto currency supported by the application */
export type CryptoCurrencyInfo = {
    /** Font awesome complete class name, eg `fa-bitcoin` */
    fa_icon: string;

    /** The name of the crypto currency, eg `Bitcoin` */
    name: string;

    /** 
     * Whether the cyrpto currencies in checked by default for inclusion in the 
     * crypto update
     */
    checked_by_default: boolean;

    /** 
     * The slug of the crypto currency as used by CoinMarketCap
     */
    slug: string;
};

/** The record of supported crypto currencies */
export const CRYPTO_CURRENCIES = {
    BTC: {
        name: "Bitcoin",
        checked_by_default: true,
        fa_icon: "fa-bitcoin",
        slug: "bitcoin",
    },
    ETH: {
        name: "Ethereum",
        checked_by_default: false,
        fa_icon: "fa-ethereum",
        slug: "ethereum",
    },
} satisfies Record<string, CryptoCurrencyInfo>;


// The `keyof typeof` below is a TypeScript feature that allows us to create a 
// type of the keys of an object. Eg CryptoCurrency = "BTC" | "ETH"

/** Those strings which appear as keys in the `CRYPTO_CURRENCIES` object. */
export type CryptoCurrency = keyof typeof CRYPTO_CURRENCIES;

/** Info on a fiat currency supported by the application */
export type FiatCurrencyInfo = {
    /** Font awesome complete class name eg `fa-dollar-sign` */
    fa_icon: string;

    /** The name of the currency in natural language, eg `Dollar` */
    name: string;

    /** A currency symbol eg `$` or `$A` */
    symbol: string;
};

/** The record of supported fiat currencies */
export const FIAT_CURRENCIES = {
    USD: { name: "Dollar", fa_icon: "fa-dollar-sign", symbol: "$" },
    EUR: { name: "Euro", fa_icon: "fa-euro-sign", symbol: "€" },
    BRL: { name: "Brazilian Real", fa_icon: "fa-brazilian-real-sign", symbol: "R$" },
    GBP: { name: "Pound Sterling", fa_icon: "fa-pound-sign", symbol: "£" },
    AUD: { name: "Australian Dollar", fa_icon: "fa-dollar-sign", symbol: "$A" },
} as Record<string, FiatCurrencyInfo>;

/** Those strings which appear as keys in the `FIAT_CURRENCIES` object. */
export type FiatCurrency = keyof typeof FIAT_CURRENCIES;
