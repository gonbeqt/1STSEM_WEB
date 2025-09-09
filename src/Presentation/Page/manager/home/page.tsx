import React, { useState } from 'react';
import Charts from '../../../Components/Charts';
import EthereumIcon from '../../../Components/icons/EthereumIcon';
import WalletModal from '../../../Components/WalletModal';
import PaymentModal from './Modal/Payment/PaymentModal';
import PayrollModal from './Modal/Payroll/PayrollModal';
import './home.css';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  ChevronRight,
  TrendingUpIcon,
  ClipboardList,
  ChartBarIncreasing,
  Users,
} from 'lucide-react';
import AuditContractModal from './Modal/AuditContractModal/AuditContractModal';
import GenerateReportModal from './Modal/GenerateReportModal/GenerateReportModal';

const Home = () => {
  const navigate = useNavigate();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isAuditContractModalOpen, setIsAuditContractModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);

  const handleWalletConnect = (walletType: string) => {
    setIsWalletModalOpen(false);
  };

  // Handler for payment modal
  const handleSendPayment = () => {
    setIsPaymentModalOpen(true);
  };

  // Add handler for payroll modal
  const handleSendPayroll = () => {
    console.log("handleSendPayroll called");
    setIsPayrollModalOpen(true);

  };
  const handleAuditContract = () => {
    setIsAuditContractModalOpen(true);
  }
  const handleGenerateReport = ()=>{
    setIsGenerateReportModalOpen(true);
  }

  // Add handler for processing payroll
  const handleProcessPayroll = (data: any) => {
    console.log('Processing payroll:', data);

    alert(`Payroll processed successfully for ${data.employees.length} employees. Total: ₱${data.total.toLocaleString()}`);
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
      {/* Quick Actions */}
      <div className="quick-actions">
        {/* Send Payment */}
        <button
          className="action-button send"
          onClick={handleSendPayment}
        >
          <div className="action-icon-wrapper">
            <TrendingUpIcon className="action-icon" />
          </div>
          <span className="action-name">Send Payment</span>
        </button>

        {/* Send Payroll */}
        <button
          className="action-button payroll"
          onClick={handleSendPayroll}
        >
          <div className="action-icon-wrapper">
            <Users className="action-icon" />
          </div>
          <span className="action-name">Send Payroll</span>
        </button>

        {/* Audit Contract */}
        <button
          className="action-button add"
          onClick={handleAuditContract}
        >
          <div className="action-icon-wrapper">
            <ClipboardList className="action-icon" />
          </div>
          <span className="action-name">Audit Contract</span>
        </button>

        {/* Generate Report */}
        <button
          className="action-button withdraw"
          onClick={handleGenerateReport}
        >
          <div className="action-icon-wrapper">
            <ChartBarIncreasing className="action-icon" />
          </div>
          <span className="action-name">Generate Report</span>
        </button>
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
          <div key={index} className="transaction-item2">
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
          <select className="period-selector1">
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

      {/* Existing Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />


      {/* Add Payroll Modal */}
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onProcess={handleProcessPayroll}
      />

      <AuditContractModal
        isOpen={isAuditContractModalOpen}
        onClose={() => setIsAuditContractModalOpen(false)}
      />
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={() => setIsGenerateReportModalOpen(false)}
      />
    </div>
  );
};

export default Home;