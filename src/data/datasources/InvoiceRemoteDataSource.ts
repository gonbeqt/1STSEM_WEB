import { ApiService } from '../api/ApiService';
import { Invoice } from '../../domain/entities/InvoiceEntities';

export class InvoiceRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async getUserInvoices(userId: string): Promise<Invoice[]> {
    void userId; // Currently unused; kept for future filtering support.
    try {
      const url = `${this.apiUrl}/invoices/list`;
      const data = await this.api.get<{ invoices: Invoice[] }>(url);
      return data.invoices || [];
    } catch (error) {
      console.error('Error fetching user invoices:', error);
      throw error;
    }
  }
}
