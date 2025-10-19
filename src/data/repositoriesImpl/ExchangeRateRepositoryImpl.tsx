import { ExchangeRateRepository } from "../../domain/repositories/ExchangeRateRepository";
import { ExchangeRatesResponse } from "../../domain/entities/ExchangeRateEntities";
import { ExchangeRateRemoteDataSource } from '../datasources/ExchangeRateRemoteDataSource';

export class ExchangeRateRepositoryImpl implements ExchangeRateRepository {
  constructor(private readonly remote: ExchangeRateRemoteDataSource) {}

  async getExchangeRates(symbols: string[], currency: string): Promise<ExchangeRatesResponse> {
    return this.remote.getExchangeRates(symbols, currency);
  }
}
