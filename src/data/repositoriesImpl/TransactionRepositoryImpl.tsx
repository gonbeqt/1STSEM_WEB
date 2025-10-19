import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { TransactionHistoryRequest, TransactionHistoryResponse } from '../../domain/entities/TransactionEntities';
import { TransactionRemoteDataSource } from '../datasources/TransactionRemoteDataSource';

export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly remote: TransactionRemoteDataSource) {}

  async getTransactionHistory(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse> {
    return this.remote.getTransactionHistory(request);
  }
}