import React, { useState } from 'react';
import { SearchIcon, ArrowLeft, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import './history.css';
import InputWithIcon from '../../../components/InputWithIcon';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  usdValue: string;
  status: 'confirmed' | 'pending';
  transactionHash?: string;
  paymentPeriod?: string;
}

interface SalaryTransactionsProps {
  onBack?: () => void;
}

const EmployeeHistory: React.FC<SalaryTransactionsProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: 'May 31, 2024',
      amount: '0.45 ETH',
      usdValue: '$850.00 USD',
      status: 'confirmed',
      transactionHash: '0x8d283284fs2458a9b7c1d2e3',
      paymentPeriod: 'May 2024'
    },
    {
      id: '2',
      date: 'April 30, 2024',
      amount: '0.42 ETH',
      usdValue: '$795.00 USD',
      status: 'confirmed',
      transactionHash: '0x7a193175ef1349b8c6d0f1a2',
      paymentPeriod: 'April 2024'
    },
    {
      id: '3',
      date: 'March 31, 2024',
      amount: '0.48 ETH',
      usdValue: '$912.00 USD',
      status: 'pending',
      transactionHash: '0x9b284395gf3569c9d8e2f3b4',
      paymentPeriod: 'March 2024'
    },
    {
      id: '4',
      date: 'February 29, 2024',
      amount: '0.46 ETH',
      usdValue: '$873.00 USD',
      status: 'pending',
      transactionHash: '0xa5395486hg4670d0e9f4c5d6',
      paymentPeriod: 'February 2024'
    },
    {
      id: '5',
      date: 'January 31, 2024',
      amount: '0.44 ETH',
      usdValue: '$834.00 USD',
      status: 'confirmed',
      transactionHash: '0xb6406597ih5781e1f0g5d6e7',
      paymentPeriod: 'January 2024'
    },
    {
      id: '6',
      date: 'December 31, 2023',
      amount: '0.41 ETH',
      usdValue: '$778.00 USD',
      status: 'confirmed',
      transactionHash: '0xc7517608ji6892f2g1h6e7f8',
      paymentPeriod: 'December 2023'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = activeFilter === 'all' || transaction.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      transaction.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.paymentPeriod?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    return status === 'confirmed' ? <CheckCircle size={16} /> : <Clock size={16} />;
  };

  const getFilterCount = (filter: 'all' | 'confirmed' | 'pending') => {
    if (filter === 'all') return transactions.length;
    return transactions.filter(t => t.status === filter).length;
  };

  const handleTransactionClick = (transaction: Transaction) => {
    console.log('Transaction clicked:', transaction);
    // Handle transaction details view
  };

  const getTotalEarnings = () => {
    const confirmedTransactions = transactions.filter(t => t.status === 'confirmed');
    const totalEth = confirmedTransactions.reduce((sum, t) => {
      const ethValue = parseFloat(t.amount.replace(' ETH', ''));
      return sum + ethValue;
    }, 0);
    
    const totalUsd = confirmedTransactions.reduce((sum, t) => {
      const usdValue = parseFloat(t.usdValue.replace('$', '').replace(' USD', '').replace(',', ''));
      return sum + usdValue;
    }, 0);

    return {
      eth: totalEth.toFixed(3),
      usd: totalUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    };
  };

  const totalEarnings = getTotalEarnings();

  return (
    <div className="salary-transactions-container">
      {/* Header */}
      <div className="transactions-header">
        {onBack && (
          <button className="back-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="page-title">Salary History</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <TrendingUp size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Earnings</div>
            <div className="summary-amount">{totalEarnings.eth} ETH</div>
            <div className="summary-usd">{totalEarnings.usd}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <Calendar size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Payments</div>
            <div className="summary-count">{transactions.length}</div>
            <div className="summary-detail">
              {transactions.filter(t => t.status === 'confirmed').length} confirmed
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <InputWithIcon
          icon={<SearchIcon />}
          placeholder="Search by date, amount, or payment period..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({getFilterCount('all')})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('confirmed')}
        >
          Confirmed ({getFilterCount('confirmed')})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({getFilterCount('pending')})
        </button>
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {filteredTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="transaction-item"
            onClick={() => handleTransactionClick(transaction)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTransactionClick(transaction);
              }
            }}
          >
            <div className="transaction-left">
              <div className="transaction-header">
                <div className="transaction-date">{transaction.date}</div>
                <div className={`transaction-status ${transaction.status}`}>
                  <span className="status-icon">
                    {getStatusIcon(transaction.status)}
                  </span>
                  <span className="status-text">
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
              {transaction.paymentPeriod && (
                <div className="payment-period">
                  Payment Period: {transaction.paymentPeriod}
                </div>
              )}
              {transaction.transactionHash && (
                <div className="transaction-hash">
                  Hash: {transaction.transactionHash.slice(0, 10)}...
                </div>
              )}
            </div>
            <div className="transaction-right">
              <div className="transaction-amount4">{transaction.amount}</div>
              <div className="transaction-usd">{transaction.usdValue}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-transactions">
          <div className="no-transactions-icon">📄</div>
          <div className="no-transactions-title">No Transactions Found</div>
          <div className="no-transactions-text">
            {searchQuery 
              ? `No transactions match your search for "${searchQuery}"`
              : `No ${activeFilter === 'all' ? '' : activeFilter} transactions available`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;