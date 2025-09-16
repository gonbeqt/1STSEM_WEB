import { TransactionHistoryRequest, TransactionHistoryResponse } from "../../domain/entities/TransactionEntities";

export interface TransactionRepository {
  getTransactionHistory(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse>;
}