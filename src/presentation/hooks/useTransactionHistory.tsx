import { useState, useCallback } from 'react';
import { GetTransactionHistoryUseCase } from '../../domain/usecases/GetTransactionUseCase';
import { TransactionRepositoryImpl } from '../../data/repositoriesImpl/TransactionRepositoryImpl';
import { Transaction, TransactionHistoryRequest } from '../../domain/entities/TransactionEntities';

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<'SENT' | 'RECEIVED' | 'TRANSFER' | 'ALL'>('ALL');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    has_more: false
  });

  const transactionRepository = new TransactionRepositoryImpl();
  const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(transactionRepository);

  const fetchTransactionHistory = useCallback(async (request: TransactionHistoryRequest = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const defaultRequest = {
        limit: 10,
        offset: 0,
        ...request
      };

      const response = await getTransactionHistoryUseCase.execute(defaultRequest);
      
      console.log('Transaction history response:', {
        success: response.success,
        message: response.message,
        transactions: response.data.transactions,
        pagination: response.data.pagination
      });
      
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transaction history';
      setError(errorMessage);
      setTransactions([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!pagination.has_more || isLoading) return;

    try {
      const response = await fetchTransactionHistory({
        limit: pagination.limit,
        offset: pagination.offset + pagination.limit,
        category: currentCategory
      });

      setTransactions(prev => [...prev, ...response.data.transactions]);
    } catch (err) {
      console.error('Failed to load more transactions:', err);
    }
  }, [pagination, isLoading, fetchTransactionHistory, currentCategory]);

  const refreshTransactions = useCallback(() => {
    return fetchTransactionHistory({ limit: pagination.limit, offset: 0, category: currentCategory });
  }, [fetchTransactionHistory, pagination.limit, currentCategory]);

  return {
    transactions,
    isLoading,
    error,
    pagination,
    currentCategory,
    fetchTransactionHistory,
    loadMore,
    refreshTransactions
  };
};