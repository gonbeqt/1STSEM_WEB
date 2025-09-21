import { ExchangeRatesResponse } from "../entities/ExchangeRateEntities";

export interface ExchangeRateRepository {
  getExchangeRates(symbols: string[], currency: string, rates: string[]): Promise<ExchangeRatesResponse>;
}
