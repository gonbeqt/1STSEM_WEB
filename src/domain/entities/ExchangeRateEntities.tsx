export interface ExchangeRatesResponse {
  success: boolean;
  rates: { [key: string]: number };
  currency: string;
  error?: string;
}
