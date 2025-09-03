import React, { useState } from 'react';
import { ChevronLeft, Search, SearchIcon } from 'lucide-react';
import './history.css';
import InputWithIcon from '../../../Components/InputWithIcon';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  usdValue: string;
  status: 'confirmed' | 'pending';
}

interface SalaryTransactionsProps {
  onBack?: () => void;
}

const EmployeeHistory: React.FC<SalaryTransactionsProps> = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: 'May 31, 2023',
      amount: '0.45 ETH',
      usdValue: '$850.00 USD',
      status: 'confirmed'
    },
    {
      id: '2',
      date: 'May 31, 2023',
      amount: '0.45 ETH',
      usdValue: '$850.00 USD',
      status: 'confirmed'
    },
    {
      id: '3',
      date: 'May 31, 2023',
      amount: '0.45 ETH',
      usdValue: '$850.00 USD',
      status: 'pending'
    },
    {
      id: '4',
      date: 'May 31, 2023',
      amount: '0.45 ETH',
      usdValue: '$850.00 USD',
      status: 'pending'
    },
    {
      id: '5',
      date: 'May 31, 2023',
      amount: '0.45 ETH',
      usdValue: '$850.00 USD',
      status: 'confirmed'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = activeFilter === 'all' || transaction.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      transaction.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    return status === 'confirmed' ? '#22C55E' : '#F59E0B';
  };

  const getStatusIcon = (status: string) => {
    return status === 'confirmed' ? '●' : '●';
  };

  return (
    <div className="salary-transactions-container">
      {/* Header */}
      <div className="transactions-header">
  
        <h1 className="page-title">Salary Transactions</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <InputWithIcon
            icon={<SearchIcon />}
            placeholder="Search"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${activeFilter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('confirmed')}
        >
          Confirmed
        </button>
        <button
          className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending
        </button>
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-left">
              <div className="transaction-date">{transaction.date}</div>
              <div className="transaction-status">
                <span 
                  className="status-indicator"
                  style={{ color: getStatusColor(transaction.status) }}
                >
                  {getStatusIcon(transaction.status)}
                </span>
                <span 
                  className="status-text"
                  style={{ color: getStatusColor(transaction.status) }}
                >
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
                <span className="available-text">Available</span>
              </div>
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
          <div className="no-transactions-text">
            No transactions found matching your criteria.
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;