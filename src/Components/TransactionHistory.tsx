import React from 'react';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  date: string;
  from?: string;
  to?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    type: 'receive',
    amount: 0.5,
    currency: 'ETH',
    date: '2025-07-14',
    from: '0xAbc123...',
  },
  {
    id: 'tx_002',
    type: 'send',
    amount: 0.1,
    currency: 'ETH',
    date: '2025-07-13',
    to: '0xDef456...',
  },
  {
    id: 'tx_003',
    type: 'receive',
    amount: 1.2,
    currency: 'ETH',
    date: '2025-07-12',
    from: '0xGhi789...',
  },
];

const TransactionHistory: React.FC = () => {
  return (
    <div className="card mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Transaction History</h2>
      {
        mockTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-700">Type</th>
                  <th className="py-2 px-4 border-b border-gray-700">Amount</th>
                  <th className="py-2 px-4 border-b border-gray-700">Date</th>
                  <th className="py-2 px-4 border-b border-gray-700">Address</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700 last:border-b-0">
                    <td className={`py-2 px-4 ${tx.type === 'receive' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </td>
                    <td className="py-2 px-4">{tx.amount} {tx.currency}</td>
                    <td className="py-2 px-4">{tx.date}</td>
                    <td className="py-2 px-4 text-sm font-mono break-all">
                      {tx.type === 'receive' ? tx.from : tx.to}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">No transactions found.</p>
        )
      }
    </div>
  );
};

export default TransactionHistory;
