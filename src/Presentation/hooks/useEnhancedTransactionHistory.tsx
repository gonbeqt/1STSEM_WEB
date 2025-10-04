import { useState, useCallback, useMemo } from 'react';
import { GetTransactionHistoryUseCase } from '../../domain/usecases/GetTransactionUseCase';
import { TransactionRepositoryImpl } from '../../data/repositoriesImpl/TransactionRepositoryImpl';
import { Transaction, TransactionHistoryRequest } from '../../domain/entities/TransactionEntities';

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

  const getTransactionHistoryUseCase = useMemo(() => {
    const transactionRepository = new TransactionRepositoryImpl();
    return new GetTransactionHistoryUseCase(transactionRepository);
  }, []);

  const fetchTransactionHistory = useCallback(async (request: TransactionHistoryRequest = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const defaultRequest = {
        limit: 10,
        offset: 0,
        // Remove category completely - don't send any category filter
        ...request
      };

      const response = await getTransactionHistoryUseCase.execute(defaultRequest);
      
      console.log('✅ Enhanced transaction history loaded successfully:', {
        message: response.message,
        transactionCount: response.data.transactions?.length || 0,
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
  }, [getTransactionHistoryUseCase]);

  const loadMore = useCallback(async () => {
    if (!pagination.has_more || isLoading) return;

    try {
      const response = await fetchTransactionHistory({
        limit: pagination.limit,
        offset: pagination.offset + pagination.limit
        // Remove category completely - get all transactions
      });

      setTransactions(prev => [...prev, ...response.data.transactions]);
    } catch (err) {
      console.error('Failed to load more transactions:', err);
    }
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
