import { useState, useEffect, useCallback } from 'react';

export interface ApiTransaction {

  id: string;
  _id: string;
  user_id: string;
  from_wallet_id: string;
  from_wallet_name?: string;
  from_wallet_type?: string;
  to_address: string;
  amount_eth: number;
  status: 'confirmed' | 'pending' | 'failed';
  created_at: string;
  transaction_hash?: string;
}

export const useTransactions = (isWalletConnected: boolean) => {
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !isWalletConnected) return;

    try {
      setIsLoadingTransactions(true);
      setTransactionError(null);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/eth/history/category/?limit=5&category=ALL`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      setTransactions(data.data.transactions || []);
    } catch (error) {
      setTransactionError(error instanceof Error ? error.message : 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [isWalletConnected]);

  useEffect(() => {
    fetchTransactions();
  }, [isWalletConnected, fetchTransactions]);

  return {
    transactions,
    isLoadingTransactions,
    transactionError,
    refreshTransactions: fetchTransactions
  };
};