import { ExchangeRateRepository } from "../../domain/repositories/ExchangeRateRepository";
import { ExchangeRatesResponse } from "../../domain/entities/ExchangeRateEntities";
import apiService from '../api';

export class ExchangeRateRepositoryImpl implements ExchangeRateRepository {
  async getExchangeRates(symbols: string[], currency: string): Promise<ExchangeRatesResponse> {
    try {
      const params = new URLSearchParams({ symbols: symbols.join(','), currency });
      const data = await apiService.get<ExchangeRatesResponse>(`/rates/current/?${params.toString()}`);
      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || error?.message || 'Failed to fetch exchange rates');
    }
  }
}
