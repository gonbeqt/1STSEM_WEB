import { Transaction } from '../../domain/entities/TransactionEntities';

export const formatTransactionAmount = (amount: string): string => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0.0000';
  return numAmount.toFixed(4);
};

export const formatTransactionDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} mins ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hrs ago`;
  } else if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getTransactionIcon = (transaction: Transaction) => {
  // This function can be expanded based on transaction type detection
  return transaction.status === 'confirmed' ? 'outflow' : 'pending';
};

export const getTransactionName = (transaction: Transaction): string => {
  // Generate transaction name based on transaction data
  if (transaction.from_wallet_name) {
    return `ETH Transfer from ${transaction.from_wallet_name}`;
  }
  return `ETH Transaction`;
};

export const calculateTransactionValue = (transaction: Transaction): number => {
  const amount = transaction.amount_eth;
  const fee = transaction.gas_cost_eth || 0;
  return amount + fee;
};