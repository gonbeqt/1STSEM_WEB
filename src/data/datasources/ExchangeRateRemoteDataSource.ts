import { ApiService } from '../api/ApiService';
import { ExchangeRatesResponse } from '../../domain/entities/ExchangeRateEntities';

export class ExchangeRateRemoteDataSource {
  constructor(private readonly api: ApiService) {}

  async getExchangeRates(symbols: string[], currency: string): Promise<ExchangeRatesResponse> {
    try {
      const params = new URLSearchParams({ symbols: symbols.join(','), currency });
      const data = await this.api.get<ExchangeRatesResponse>(`/rates/current/?${params.toString()}`);
      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || error?.message || 'Failed to fetch exchange rates');
    }
  }
}
