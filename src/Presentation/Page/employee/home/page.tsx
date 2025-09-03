import React from 'react';
import './home.css';
import { Bell, Eye, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  type: 'paid' | 'pending';
  description: string;
  usdValue: string;
}



const EmployeeHome = () => {
  const navigate = useNavigate()
  const transactions: Transaction[] = [
    {
      id: '1',
      date: 'May 31, 2023',
      amount: '0.45 ETH',
      type: 'paid',
      description: 'Send 300',
      usdValue: '$160.00 USD'
    },
    {
      id: '2',
      date: 'April 30, 2023',
      amount: '0.45 ETH',
      type: 'paid',
      description: 'On Daily 4G',
      usdValue: '$160.00 USD'
    },
    {
      id: '3',
      date: 'June 30, 2023',
      amount: '0.45 ETH',
      type: 'pending',
      description: 'Send 350',
      usdValue: '$160.00 USD'
    }
  ];
  const handleTransactionDetails = () => {
    navigate('/transaction_details')
  }

  return (
    <div className="wallet-container">
      {/* Header */}
      <div className="header6">
        <h1>Home</h1>
      </div>
      <div className="wallet-header">
        <div className="greeting">
          <h2>Hi Anne</h2>
          <p>How are you today?</p>
        </div>
        <div className="header-icons">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <button className="icon-btn">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="wallet-card">
        <div className="wallet-info">
          <span>Current Wallet</span>
          <h1>67,980 ETH</h1>
          <span>Converted to</span>
          <h2>$12,230</h2>
        </div>
        <div className="wallet-actions">
          <select>
            <option>PHP</option>
            <option>USD</option>
          </select>
          <button className="connect-wallet-btn">Withdraw</button>
        </div>
      </div>
      <div className="action-buttons">
        <div className="action-btn">
          <div className="action-icon purple">📤</div>
          <div className="action-text">
            <div>Next Payout</div>
            <div className="action-date">June 15, 2023</div>
          </div>
        </div>

        <div className="action-btn">
          <div className="action-icon pink">📊</div>
          <div className="action-text">
            <div>Frequency</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-section">
        <div className="transactions-header">
          <h3>Recent Transactions</h3>
          <button className="view-all-btn">
            View All <span className="arrow">→</span>
          </button>
        </div>

        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-left">
                <div className="transaction-date">{transaction.date}</div>
                <div className="transaction-description">{transaction.description}</div>
                <div className={`transaction-status ${transaction.type}`}>
                  <div className={`status-icon ${transaction.type}`}></div>
                  {transaction.type === 'paid' ? 'Paid' : 'Pending'}
                </div>
              </div>

              <div className="transaction-right">
                <div className="transaction-amount1">{transaction.amount}</div>
                <div className="transaction-usd">{transaction.usdValue}</div>
                <button className="view-btn" onClick={handleTransactionDetails}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>


  );
};

export default EmployeeHome;