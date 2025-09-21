import React, { useEffect, useState } from 'react';
import './home.css';
import { Bell, RotateCcw, Loader2, Wifi, Clock, TrendingDown, ChevronRight, Clipboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../../hooks/useWallet';
import WalletModal from '../../../components/WalletModal';
import EthereumIcon from '../../../components/icons/EthereumIcon';
import { useTransactions, ApiTransaction } from '../../../hooks/useTransactions';


type WalletModalInitialView = 'connect' | 'send';




const EmployeeHome = () => {
  const navigate = useNavigate();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  // Wallet state
    const {
      isWalletConnected,
      reconnectedWalletAddress,
      walletAddress,
      ethBalance,
    
      isFetchingBalance,
      fetchBalanceError,
  
      successMessage,
      clearSuccessMessage,
      isReconnecting,
      reconnectError,
      reconnectWallet,
      setReconnectPrivateKey,
            fetchWalletBalance,
            rates,
            fiatCurrency    } = useWallet();
  const { transactions, isLoadingTransactions, transactionError, refreshTransactions } = useTransactions(isWalletConnected);
      const usd = 4469.44
  const transactionData = transactions.map(apiTransaction => {
    const ethToFiatRate = rates?.ETH || 0;
    const fiatAmount = apiTransaction.amount_eth * ethToFiatRate;

    return {
      name: getTransactionName(apiTransaction),
      amount: typeof apiTransaction.amount_eth === 'string' ? parseFloat(apiTransaction.amount_eth) : apiTransaction.amount_eth,
      fiatAmount: fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      type: apiTransaction.status === 'pending' ? 'pending' : 'paid',
      date: formatTransactionDate(apiTransaction.created_at),
      icon: getTransactionIcon(apiTransaction),
      status: apiTransaction.status,
      hash: apiTransaction.transaction_hash
    };
  });
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
  
    const getTransactionIcon = (transaction: ApiTransaction) => {
      if (transaction.status === 'pending') {
        return <Clock className="transaction-icon pending" />;
      }
      return <TrendingDown className="transaction-icon outflow" />;
    };
  
    const getTransactionName = (transaction: ApiTransaction): string => {
      if (transaction.from_wallet_name) {
        return `ETH from ${transaction.from_wallet_name}`;
      }
      return 'ETH Transaction';
    };
  

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
  
  const handleTransactionDetails = (transactionId: string) => {
    navigate(`/transaction_details/${transactionId}`)
  }

  const getNextMonthFirstDay = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopiedMessage('Copied!');
        setTimeout(() => setCopiedMessage(null), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        setCopiedMessage('Failed to copy');
        setTimeout(() => setCopiedMessage(null), 2000);
      }
    }
  };

 const handleOpenWalletModal = (view: WalletModalInitialView) => {
    setWalletModalInitialView(view);
    setIsWalletModalOpen(true);
  };

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
              onClick={() => handleOpenWalletModal('connect')}
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
          {walletAddress && (
            <div className="wallet-address-full">
              <span>Wallet: {walletAddress}</span>
              <button onClick={handleCopyAddress} className="copy-icon-btn">
                <Clipboard size={16} />
              </button>
              {copiedMessage && <span className="copied-message">{copiedMessage}</span>}
            </div>
          )}
          <div className="balance-converted">
            {isFetchingBalance ? (
              <span className="balance-fetching-text">Fetching...</span>
            ) : fetchBalanceError ? (
              <span className="balance-error-text">Error fetching balance</span>
            ) : ethBalance !== null ? (
              `${(ethBalance * usd).toFixed(2)} USD`
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
      <div className="action-buttons">
        <div className="action-btn">
          <div className="action-icon purple">📤</div>
          <div className="action-text">
            <div>Next Payout</div>
            <div className="action-date">{getNextMonthFirstDay()}</div>
          </div>
        </div>

        <div className="action-btn">
          <div className="action-icon pink">📊</div>
          <div className="action-text">
            <div>Frequency</div>
            <div className="action-date">Monthly</div>
          </div>
        </div>
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
                <span>{transaction.type === 'paid' ? '-' : transaction.type === 'pending' ? '' : '+'}{transaction.amount.toFixed(4)} ETH</span>
                {fiatCurrency && <span className="fiat-amount">{fiatCurrency} {transaction.fiatAmount}</span>}
              </div>
            </div>
          ))
        )}
      </div>
       <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        initialView={walletModalInitialView}
      />

    </div>


  );
};


export default EmployeeHome;