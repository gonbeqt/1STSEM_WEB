import { ApiService } from '../api/ApiService';
import { TransactionHistoryRequest, TransactionHistoryResponse } from '../../domain/entities/TransactionEntities';

export class TransactionRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL || '';

  constructor(private readonly api: ApiService) {}

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return path.startsWith('/') ? path : `/${path}`;
  }

  async getTransactionHistory(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (request.wallet_id) queryParams.append('wallet_id', request.wallet_id);
      if (request.limit) queryParams.append('limit', request.limit.toString());
      if (request.offset) queryParams.append('offset', request.offset.toString());
      if (request.status) queryParams.append('status', request.status);

      const url = this.buildUrl(`/eth/history/?${queryParams.toString()}`);
      const data = await this.api.get<TransactionHistoryResponse>(url);
      return data;
    } catch (error: any) {
      console.error('[TransactionRemoteDataSource] getTransactionHistory error', error);
      // Return a safe fallback shape expected by callers
      return {
        success: false,
        message: error?.message || 'Failed to fetch transaction history',
        data: {
          user_id: '',
          username: '',
          transactions: [],
          pagination: {
            total: 0,
            limit: request.limit ?? 0,
            offset: request.offset ?? 0,
            has_more: false,
          },
          filters: {
            category_filter: request.category ?? undefined,
            status_filter: request.status ?? undefined,
            wallet_id: request.wallet_id ?? undefined,
          },
        },
      } as TransactionHistoryResponse;
    }
  }
}
