import React from 'react';
import Skeleton, { SkeletonCircle, SkeletonText } from './Skeleton';
import type { DisplayTransaction } from '../pages/manager/home/utils';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  transactions: DisplayTransaction[];
  onClose: () => void;
}

const TransactionsModal: React.FC<Props> = ({ isOpen, isLoading, transactions, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold">All Transactions</h3>
            <p className="text-sm text-gray-500">Full history from the connected wallet</p>
          </div>
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SkeletonCircle className="h-10 w-10" />
                    <div className="flex flex-col gap-2 w-48 max-w-full">
                      <SkeletonText className="w-full" />
                      <SkeletonText className="w-32 h-3" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-32">
                    <SkeletonText className="w-full h-4" />
                    <SkeletonText className="w-24 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-4">
              <p className="text-sm text-gray-600">No transactions found</p>
            </div>
          ) : (
            transactions.map((tx, idx) => (
              <div key={`${tx.hash ?? 'tx'}-${idx}`} className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'outflow' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                    {tx.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.name}</p>
                    <p className="text-sm text-gray-500">{tx.hash ? `${tx.hash.substring(0, 10)}...` : 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'outflow' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {tx.type === 'outflow' ? '-' : '+'}{(tx.amount || 0).toFixed(4)} {tx.token_symbol}
                  </p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;
