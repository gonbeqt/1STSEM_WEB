import { useState, useCallback } from 'react';
import { Transaction, TransactionHistoryRequest } from '../../domain/entities/TransactionEntities';
import { container } from '../../di/container';

export const useEnhancedTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        offset: pagination.offset + pagination.limit
      });

      setTransactions(prev => [...prev, ...response.data.transactions]);
    } catch (err) {    }
  }, [pagination, isLoading, fetchTransactionHistory]);

  const refreshTransactions = useCallback(() => {
    return fetchTransactionHistory({ limit: pagination.limit, offset: 0 });
  }, [fetchTransactionHistory, pagination.limit]);

  return {
    transactions,
    isLoading,
    error,
    pagination,
    fetchTransactionHistory,
    loadMore,
    refreshTransactions
  };
};
