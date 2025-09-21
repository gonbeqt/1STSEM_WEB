import { TransactionHistoryRequest, TransactionHistoryResponse } from '../entities/TransactionEntities';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class GetTransactionHistoryUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse> {
    return await this.transactionRepository.getTransactionHistory(request);
  }
}