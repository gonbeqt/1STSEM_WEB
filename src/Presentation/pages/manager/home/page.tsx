// src/Presentation/pages/manager/home/page.tsx (With Auto Reconnect)
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Charts from '../../../components/Charts';
import EthereumIcon from '../../../components/icons/EthereumIcon';
import WalletModal from '../../../components/WalletModal';
import PaymentModal from './Modal/Payment/PaymentModal';
import PayrollModal from './Modal/Payroll/PayrollModal';
import './home.css';
import {
  Bell,
  User,
  ChevronRight,
  TrendingUpIcon,
  ClipboardList,
  ChartBarIncreasing,
  Users,
  Loader2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import AuditContractModal from './Modal/AuditContractModal/AuditContractModal';
import GenerateReportModal from './Modal/GenerateReportModal/GenerateReportModal';
import { useWallet } from '../../../hooks/useWallet';

const Home =() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isAuditContractModalOpen, setIsAuditContractModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  
  // Wallet state
  const {
    isWalletConnected,
    reconnectedWalletAddress,
    walletAddress,
    ethBalance,
    usdBalance,
    isFetchingBalance,
    fetchBalanceError,
  
    successMessage,
    clearSuccessMessage,
    isReconnecting,
    reconnectError,
    reconnectWallet,
    setReconnectPrivateKey,
    fetchWalletBalance
  } = useWallet();

  // Clear success message after showing it
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  // Fetch wallet balance when connected
  useEffect(() => {
    if (isWalletConnected) {
      fetchWalletBalance();
    }
  }, [isWalletConnected, fetchWalletBalance]);

  const handleWalletConnect = (walletType: string) => {
    setIsWalletModalOpen(false);
    console.log('Wallet connected:', walletType);
  };

  // Handler for payment modal
  const handleSendPayment = () => {
    if (!isWalletConnected) {
      alert('Please connect a wallet first');
      setIsWalletModalOpen(true);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  // Add handler for payroll modal
  const handleSendPayroll = () => {
    if (!isWalletConnected) {
      alert('Please connect a wallet first');
      setIsWalletModalOpen(true);
      return;
    }
    console.log("handleSendPayroll called");
    setIsPayrollModalOpen(true);
  };

  const handleAuditContract = () => {
    setIsAuditContractModalOpen(true);
  }

  const handleGenerateReport = () => {
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
      {/* Success Message */}
      {successMessage && (
        <div className="success-message-container">
          <div className="success-message-content">
            <div className="success-message-dot"></div>
            <span className="success-message-text">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Reconnection Error Message */}
      {reconnectError && (
        <div className="reconnect-error-message">
          <div className="reconnect-error-content">
            <WifiOff className="reconnect-error-icon" />
            <div>
              <p className="reconnect-error-title">Auto-reconnect failed</p>
              <p className="reconnect-error-description">Please connect your wallet manually</p>
            </div>
          </div>
        </div>
      )}

      {/* Reconnecting Indicator */}
      {isReconnecting && (
        <div className="reconnecting-indicator">
          <div className="reconnecting-content">
            <Loader2 className="reconnecting-icon" />
            <span className="reconnecting-text">Reconnecting wallet...</span>
          </div>
        </div>
      )}

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
          <div className="flex items-center gap-2">
            <span className="wallet-label">Current Wallet</span>
            {isWalletConnected && (
              <div className="wallet-status-connected">
                <Wifi className="wallet-status-connected-icon" />
                <span className="wallet-status-connected-text">Connected</span>
              </div>
            )}
            {isReconnecting && (
              <div className="wallet-status-connecting">
                <Loader2 className="wallet-status-connecting-icon" />
                <span className="wallet-status-connecting-text">Connecting...</span>
              </div>
            )}
            
          </div>
          
          {!isWalletConnected && !isReconnecting ? (
            <button 
              className="connect-wallet-new" 
              onClick={() => setIsWalletModalOpen(true)}
            >
              Connect Wallet
            </button>
          ) : null}
        </div>
        
        <div className="wallet-balance">
          <div className="balance-main">
            <EthereumIcon className="eth-icon" />
            <span className="balance-amount">
              {isFetchingBalance ? (
                <Loader2 className="balance-fetching-icon" />
              ) : ethBalance !== null ? (
                `${ethBalance.toFixed(4)} ETH`
              ) : (
                <span className="balance-empty-text">0.00 ETH</span>
              )}
            </span>
          </div>
          <div className="balance-converted">
            {isFetchingBalance ? (
              <span className="balance-fetching-text">Fetching...</span>
            ) : fetchBalanceError ? (
              <span className="balance-error-text">Error fetching balance</span>
            ) : usdBalance !== null ? (
              `₱ ${usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ) : walletAddress ? (
              <span className="wallet-address-display">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            ) : (
              '₱ 0.00'
            )}
          </div>
        </div>
      </div>

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

      {/* Wallet Modal (for initial connection only) */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
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


