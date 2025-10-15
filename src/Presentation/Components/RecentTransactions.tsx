import React from 'react';
import Skeleton, { SkeletonCircle, SkeletonText } from './Skeleton';
import { MoreVertical } from 'lucide-react';
import type { DisplayTransaction } from '../pages/manager/home/utils';

interface Props {
  isLoading: boolean;
  error?: string | null;
  transactions: DisplayTransaction[];
  recent: DisplayTransaction[];
  totalCount: number;
  onViewAll: () => void;
  onOpenDetails: (tx: DisplayTransaction) => void;
}

const RecentTransactions: React.FC<Props> = ({ isLoading, error, transactions, recent, totalCount, onViewAll, onOpenDetails }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button onClick={onViewAll} className="text-sm font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 transition-colors">
          <MoreVertical className="w-4 h-4 rotate-90" />
          View all
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Showing 5 most recent</p>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <SkeletonCircle className="h-10 w-10 bg-gray-100" />
                  <div className="flex flex-col gap-2 w-full">
                    <SkeletonText className="w-48 max-w-full" />
                    <SkeletonText className="w-32 max-w-full h-3" />
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                  <SkeletonText className="w-24 h-4" />
                  <SkeletonText className="w-20 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6"><p className="text-sm text-red-600">Error loading transactions: {error}</p></div>
        ) : transactions.length === 0 ? (
          <div className="p-6">
            <div className="rounded-3xl border border-dashed border-purple-200 bg-purple-50/40 px-6 py-10 text-center">
              <h4 className="text-base font-semibold text-gray-900 mb-2">No transactions found</h4>
              <p className="text-sm text-gray-500">Total transactions loaded: {totalCount}</p>
            </div>
          </div>
        ) : (
          recent.map((tx, index) => (
            <div
              key={tx.hash ?? index}
              onClick={() => onOpenDetails(tx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenDetails(tx); }}
              className={`cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 transition-colors ${index !== recent.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-purple-50/30`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'outflow' ? 'bg-red-50 text-red-600' : 'bg-purple-100 text-purple-600'}`}>
                  {tx.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{tx.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{tx.hash ? `${tx.hash.substring(0, 10)}...` : 'N/A'}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 text-left sm:text-right">
                <p className={`font-semibold text-sm sm:text-base ${tx.type === 'outflow' ? 'text-red-600' : 'text-purple-600'}`}>
                  {tx.type === 'outflow' ? '-' : '+'}{(tx.amount || 0).toFixed(4)} {tx.token_symbol}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">{tx.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
