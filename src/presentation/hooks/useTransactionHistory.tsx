import { useState, useCallback } from 'react';
import { Transaction, TransactionHistoryRequest } from '../../domain/entities/TransactionEntities';
import { container } from '../../di/container';

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory] = useState<'SENT' | 'RECEIVED' | 'TRANSFER' | 'ALL'>('ALL');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    has_more: false
  });

  const getTransactionHistoryUseCase = container.getTransactionHistoryUseCase;

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
  }, [getTransactionHistoryUseCase]);

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