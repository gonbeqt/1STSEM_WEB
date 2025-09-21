import { ExchangeRateRepository } from "../../domain/repositories/ExchangeRateRepository";
import { ExchangeRatesResponse } from "../../domain/entities/ExchangeRateEntities";
import axios from 'axios';

export class ExchangeRateRepositoryImpl implements ExchangeRateRepository {
  async getExchangeRates(symbols: string[], currency: string): Promise<ExchangeRatesResponse> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rates/current/`, {
        params: {
          symbols: symbols.join(','),
          currency: currency,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Failed to fetch exchange rates');
      } else {
        throw new Error('Failed to fetch exchange rates');
      }
    }
  }
}
