import React, { useState } from 'react';
import ReportIcon from '../../../Components/icons/ReportIcon';
import PayrollSendIcon from '../../../Components/icons/PayrollSendIcon';
import ContractIcon from '../../../Components/icons/ContractIcon';
import Charts from '../../../Components/Charts';
import EthereumIcon from '../../../Components/icons/EthereumIcon';
import InvoiceCard from '../../../Components/InvoiceCard';
import PayrollCard from '../../../Components/PayrollCard';
import WalletModal from '../../../Components/WalletModal';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  Bell,
  User,
  ChevronRight,
  TrendingUpIcon,
  ClipboardList,
  ChartBarIncreasing,
  Users,
} from 'lucide-react';
import { IconContext } from 'react-icons';

const Home = () => {
  const navigate = useNavigate();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleAutomateExpenses = () => {
    navigate('/expenses');
  };
  
  const handleWalletConnect = (walletType: string) => {
    setIsWalletModalOpen(false);
  };

  const transactionData = [
    { 
      name: 'Crypto Purchase', 
      amount: 1250.60, 
      type: 'outflow', 
      date: '2 hrs ago', 
      icon: <Users className="transaction-icon outflow" /> 
    },
    { 
      name: 'Investment Purchase', 
      amount: 3340.00, 
      type: 'outflow', 
      date: '1 day ago', 
      icon: <ClipboardList className="transaction-icon outflow" /> 
    },
    { 
      name: 'Payroll Processed', 
      amount: 815.00, 
      type: 'inflow', 
      date: '2 days ago', 
      icon: <ChartBarIncreasing className="transaction-icon inflow" /> 
    },
    { 
      name: 'Crypto Payment', 
      amount: 13165.00, 
      type: 'inflow', 
      date: '3 days ago', 
      icon: <ChartBarIncreasing className="transaction-icon inflow" /> 
    },
    { 
      name: 'Investment Purchase', 
      amount: 850.00, 
      type: 'outflow', 
      date: '4 days ago', 
      icon: <TrendingUpIcon className="transaction-icon outflow" /> 
    }
  ];

  const quickActions = [
    { name: 'Send Payroll', icon: <Users  className="action-icon" />, color: 'send' },
    { name: 'Audit Contract', icon: <ClipboardList className="action-icon" />, color: 'add' },
    { name: 'Generate Report', icon: <ChartBarIncreasing className="action-icon" />, color: 'withdraw' },
    { name: 'Invest', icon: <TrendingUpIcon className="action-icon" />, color: 'more' }
  ];

  return (
    <div className="home-content-new">
      {/* Header */}
      <div className="header-new">
        <div className="header-left">
          <div className="profile-avatar">
            <span>J</span>
          </div>
          <div className="greeting-text">
            <p className="greeting-small">Hi Juan</p>
            <p className="greeting-question">How are you today?</p>
          </div>
        </div>
        <div className="header-right">
          <Bell className="header-icon" />
          <User className="header-icon" />
        </div>
      </div>

      {/* Current Wallet Card */}
      <div className="current-wallet-card">
        <div className="wallet-header">
          <span className="wallet-label">Current Wallet</span>
          <button className="connect-wallet-new" onClick={() => setIsWalletModalOpen(true)}>
            Connect Wallet
          </button>
        </div>
        <div className="wallet-balance">
          <div className="balance-main">
            <EthereumIcon className="eth-icon" />
            <span className="balance-amount">67,980 ETH</span>
          </div>
          <div className="balance-converted">₱ 1 tev</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div key={index} className={`action-button ${action.color}`}>
            <div className="action-icon-wrapper">
              {action.icon}
            </div>
            <span className="action-name">{action.name}</span>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="section-header">
        <h2>Recent Transactions</h2>
        <div className="view-all">
          <span>View all</span>
          <ChevronRight className="chevron-icon" />
        </div>
      </div>

      <div className="transactions-list">
        {transactionData.map((transaction, index) => (
          <div key={index} className="transaction-item">
            <div className="transaction-left">
              <div className={`transaction-icon-wrapper ${transaction.type}`}>
                {transaction.icon}
              </div>
              <div className="transaction-details">
                <div className="transaction-name">{transaction.name}</div>
                <div className="transaction-date">{transaction.date}</div>
              </div>
            </div>
            <div className={`transaction-amount2 ${transaction.type}`}>
              {transaction.type === 'outflow' ? '-' : '+'}₱{transaction.amount.toLocaleString()}
            </div>
          </div>
        ))}
        
      </div>
      

      {/* Revenue vs Expenses */}
      <div className="revenue-section">
        <div className="section-header">
          <h2>Revenue vs Expenses</h2>
          <select className="period-selector">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last month</option>
          </select>
        </div>

        <div className="revenue-stats">
          <div className="stat-item">
            <span className="stat-label">Revenue</span>
            <span className="stat-value revenue">₱7120</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Expenses</span>
            <span className="stat-value expenses">₱4200</span>
          </div>
        </div>

        <div className="chart-container">
          <Charts />
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
};

export default Home;