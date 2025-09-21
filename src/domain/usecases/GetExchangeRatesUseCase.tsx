import { ExchangeRateRepository } from "../repositories/ExchangeRateRepository";
import { ExchangeRatesResponse } from "../entities/ExchangeRateEntities";

export class GetExchangeRatesUseCase {
  constructor(private exchangeRateRepository: ExchangeRateRepository) {}

  async execute(symbols: string[], rates: string[], currency: string): Promise<ExchangeRatesResponse> {
    return this.exchangeRateRepository.getExchangeRates(symbols, currency, rates);
  }
}
