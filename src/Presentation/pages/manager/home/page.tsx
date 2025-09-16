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
  Clock,
  TrendingDown,
} from 'lucide-react';
import AuditContractModal from './Modal/AuditContractModal/AuditContractModal';
import GenerateReportModal from './Modal/GenerateReportModal/GenerateReportModal';
import { useWallet } from '../../../hooks/useWallet';
import { useTransactions } from '../../../hooks/useTransactions';

const Home = () => {
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
  const { transactions, isLoadingTransactions, transactionError, refreshTransactions } = useTransactions(isWalletConnected);
const formatTransactionDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hrs ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTransactionIcon = (transaction: any) => {
    if (transaction.status === 'pending') {
      return <Clock className="transaction-icon pending" />;
    }
    return <TrendingDown className="transaction-icon outflow" />;
  };

  const getTransactionName = (transaction: any): string => {
    if (transaction.from_wallet_name) {
      return `ETH from ${transaction.from_wallet_name}`;
    }
    return 'ETH Transaction';
  };

  // Convert API transactions to display format (replace mock transactionData)
  const transactionData = transactions.map(transaction => ({
    name: getTransactionName(transaction),
    amount: parseFloat(transaction.amount),
    type: transaction.status === 'confirmed' ? 'outflow' : 'pending',
    date: formatTransactionDate(transaction.created_at),
    icon: getTransactionIcon(transaction),
    status: transaction.status,
    hash: transaction.transaction_hash
  }));
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
                <span className="balance-empty-text"></span>
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
              <span className="balance-empty-text"></span>
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
      <div className="section-header3">
        <h2>Recent Transactions</h2>
        <div className="view-all" onClick={refreshTransactions}>
          <span>Refresh</span>
          <ChevronRight className="chevron-icon" />
        </div>
      </div>

      <div className="transactions-list">
        {isLoadingTransactions ? (
          <div className="transaction-item2">
            <div className="transaction-left">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <div className="transaction-details">
                <div className="transaction-name">Loading transactions...</div>
              </div>
            </div>
          </div>
        ) : transactionError ? (
          <div className="transaction-item2">
            <div className="transaction-left">
              <div className="transaction-details">
                <div className="transaction-name">Error loading transactions</div>
                <div className="transaction-date">{transactionError}</div>
              </div>
            </div>
          </div>
        ) : transactionData.length === 0 ? (
          <div className="transaction-item2">
            <div className="transaction-left">
              <div className="transaction-details">
                <div className="transaction-name">No transactions found</div>
                <div className="transaction-date">Start making transactions to see them here.</div>
              </div>
            </div>
          </div>
        ) : (
          transactionData.map((transaction, index) => (
            <div key={index} className="transaction-item2">
              <div className="transaction-left">
                <div className={`transaction-icon-wrapper ${transaction.type}`}>
                  {transaction.icon}
                </div>
                <div className="transaction-details">
                  <div className="transaction-name">{transaction.name}</div>
                  <div className="transaction-date">
                    {transaction.date}
                    {transaction.status && (
                      <span className={`ml-2 px-1 py-0.5 text-xs rounded status-badge-${transaction.status}`}>
                        {transaction.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={`transaction-amount2 ${transaction.type}`}>
                {transaction.type === 'outflow' ? '-' : transaction.type === 'pending' ? '' : '+'}
                {transaction.amount.toFixed(4)} ETH
              </div>
            </div>
          ))
        )}
      </div>

      {/* Revenue vs Expenses */}
      <div className="revenue-section">
        <div className="section-header3">
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


