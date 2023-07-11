import { CoinMarketCapQuoter, CoinMarketCapQuoterInit, QuoteRequest, CoinMarketCapError } from '../src/quoter';
import fetchMock from 'fetch-mock';


import mockResponse from "./cmc_response/quote-by-slug.json";

describe('CoinMarketCapQuoter', () => {
    const init: CoinMarketCapQuoterInit = {
        server: 'https://api.coinmarketcap.com',
        quote_endpoint: 'v1/cryptocurrency/quotes/latest',
        api_key: 'test-api-key',
    };

    const quoter = new CoinMarketCapQuoter(init);

    afterEach(() => {
        fetchMock.restore();
    });

    it('should make a successful quote request', async () => {
        const request: QuoteRequest = {
            crypto_currencies: ['BTC', 'ETH'],
            fiat_currency: 'EUR',
        };

        fetchMock.getOnce(`${init.server}/${init.quote_endpoint}?slug=bitcoin%2Cethereum&convert=EUR`, {
            body: mockResponse,
            headers: { 'content-type': 'application/json' }
        });

        const result = await quoter.quote(request);

        let mockResponseBTC = mockResponse.data["1"];
        let quoteBTC = mockResponseBTC.quote["EUR"];

        let mockResponseETH = mockResponse.data["1027"];
        let quoteETH = mockResponseETH.quote["EUR"]

        expect(result).toMatchObject({
            BTC: {
                fiat_currency: 'EUR',
                price: quoteBTC.price,
                volume_24h: quoteBTC.volume_24h,
                volume_change_24h: quoteBTC.volume_change_24h,
                market_cap: quoteBTC.market_cap,
                market_cap_dominance: quoteBTC.market_cap_dominance,
                percent_change_1h: quoteBTC.percent_change_1h,
                percent_change_24h: quoteBTC.percent_change_24h,
                percent_change_7d: quoteBTC.percent_change_7d,
            },
            ETH: {
                fiat_currency: 'EUR',
                price: quoteETH.price,
                volume_24h: quoteETH.volume_24h,
                volume_change_24h: quoteETH.volume_change_24h,
                market_cap: quoteETH.market_cap,
                market_cap_dominance: quoteETH.market_cap_dominance,
                percent_change_1h: quoteETH.percent_change_1h,
                percent_change_24h: quoteETH.percent_change_24h,
                percent_change_7d: quoteETH.percent_change_7d,
            },
        });
    });
});