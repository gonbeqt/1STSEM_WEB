import { ApiService } from '../api/ApiService';
import { TransactionHistoryRequest, TransactionHistoryResponse } from '../../domain/entities/TransactionEntities';

export class TransactionRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async getTransactionHistory(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse> {
    const queryParams = new URLSearchParams();

    if (request.wallet_id) queryParams.append('wallet_id', request.wallet_id);
    if (request.limit) queryParams.append('limit', request.limit.toString());
    if (request.offset) queryParams.append('offset', request.offset.toString());
    if (request.status) queryParams.append('status', request.status);

    const url = `${this.apiUrl}/eth/history/?${queryParams.toString()}`;
    const data = await this.api.get<TransactionHistoryResponse>(url);
    return data;
  }
}
