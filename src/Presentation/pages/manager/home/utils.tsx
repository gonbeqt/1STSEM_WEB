import React from 'react';
import { Clock, TrendingDown } from 'lucide-react';
import type { JSX } from 'react';

export type TransactionRecord = {
  amount_eth: number | string;
  status: string;
  transaction_category: string;
  created_at: string;
  transaction_hash?: string;
  counterparty_name?: string;
  counterparty_role?: string;
  category_description?: string;
  from_address?: string;
  to_address?: string;
  ai_analysis?: Record<string, unknown> | string | null;
  explorer_url?: string;
};

export type DisplayTransaction = {
  name: string;
  amount: number;
  type: 'outflow' | 'pending';
  date: string;
  icon: JSX.Element;
  hash?: string;
  token_symbol: string;
  from_address?: string;
  to_address?: string;
  counterparty_name?: string;
  counterparty_role?: string;
  category?: string;
  ai_analysis?: Record<string, unknown> | string | null;
  explorer_url?: string;
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
  }

  if (diffHours < 24) {
    return `${diffHours} hrs ago`;
  }

  if (diffDays === 1) {
    return '1 day ago';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString();
};

export const getTransactionIcon = (status: string) => {
  if (status === 'pending') {
    return <Clock className="w-5 h-5 text-yellow-600" />;
  }

  return <TrendingDown className="w-5 h-5 text-red-600" />;
};

export const getTransactionName = (transaction: TransactionRecord): string => {
  if (transaction.counterparty_name) {
    return `${transaction.transaction_category === 'SENT' ? 'Sent to' : 'Received from'} ${transaction.counterparty_name}`;
  }

  if (transaction.category_description) {
    return transaction.category_description;
  }

  const categoryLabels: Record<string, string> = {
    SENT: 'Sent ETH',
    RECEIVED: 'Received ETH',
    TRANSFER: 'Internal Transfer',
    EXTERNAL: 'External Transaction'
  };

  return categoryLabels[transaction.transaction_category] || 'ETH Transaction';
};

export const mapTransactionToDisplay = (transaction: TransactionRecord): DisplayTransaction => {
  const displayAmount = typeof transaction.amount_eth === 'string'
    ? parseFloat(transaction.amount_eth) || 0
    : Number(transaction.amount_eth) || 0;

  return {
    name: getTransactionName(transaction),
    amount: displayAmount,
    type: transaction.status === 'confirmed' ? 'outflow' : 'pending',
    date: formatTransactionDate(transaction.created_at),
    icon: getTransactionIcon(transaction.status),
    hash: transaction.transaction_hash,
    token_symbol: 'ETH',
    from_address: transaction.from_address,
    to_address: transaction.to_address,
    counterparty_name: transaction.counterparty_name,
    counterparty_role: transaction.counterparty_role,
    category: transaction.transaction_category,
    ai_analysis: transaction.ai_analysis,
    explorer_url: transaction.explorer_url
  };
};

export default {} as const;

export const formatKey = (key: string): string => {
  const withSpaces = key.replace(/_/g, ' ');
  return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
  if (value instanceof Date) return value.toISOString();
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const KeyValueList: React.FC<{ data: Record<string, unknown> }> = ({ data }) => (
  <div className="space-y-3">
    {Object.entries(data).map(([key, value]) => (
      <div key={key} className="rounded-md bg-gray-50 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{formatKey(key)}</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{formatValue(value)}</p>
      </div>
    ))}
  </div>
);

export const ModalShell: React.FC<{
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ title, onClose, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              ×
            </button>
          )}
        </div>
      )}
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
    <div className="h-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-700" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
  </div>
);

export const sumObjectValues = (obj: any): number => {
  if (typeof obj !== 'object' || obj === null) return 0;
  return Object.values(obj).reduce((sum: number, val: any) => {
    const num = Number(val);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
};

export const getDateRangeForPeriod = (timePeriod: string, customStart?: string, customEnd?: string) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  switch (timePeriod) {
    case 'Current Period':
      return {
        start_date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0]
      };
    case 'Previous Period':
      const lastMonth = new Date(currentYear, currentMonth - 1, 1);
      const lastMonthEnd = new Date(currentYear, currentMonth, 0);
      return {
        start_date: lastMonth.toISOString().split('T')[0],
        end_date: lastMonthEnd.toISOString().split('T')[0]
      };
    case 'Year to Date':
      return {
        start_date: new Date(currentYear, 0, 1).toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0]
      };
    case 'Custom Period':
      return {
        start_date: customStart || '',
        end_date: customEnd || ''
      };
    default:
      return {
        start_date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0]
      };
  }
};

