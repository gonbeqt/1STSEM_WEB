import { TransactionHistoryRequest, TransactionHistoryResponse } from "../entities/TransactionEntities";

export interface TransactionRepository {
  getTransactionHistory(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse>;
}