import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { TransactionHistoryRequest, TransactionHistoryResponse } from '../../domain/entities/TransactionEntities';
import apiService from '../api';

export class TransactionRepositoryImpl implements TransactionRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  async getTransactionHistory(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (request.wallet_id) queryParams.append('wallet_id', request.wallet_id);
    if (request.limit) queryParams.append('limit', request.limit.toString());
    if (request.offset) queryParams.append('offset', request.offset.toString());
    if (request.status) queryParams.append('status', request.status);
    const url = `${this.API_URL}/eth/history/?${queryParams.toString()}`;
    const data = await apiService.get<TransactionHistoryResponse>(url);
    return data;
  }
}