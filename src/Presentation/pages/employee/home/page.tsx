
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './home.css';
import { Bell, RotateCcw, Loader2, Wifi, Clipboard } from 'lucide-react';
import { useWallet } from '../../../hooks/useWallet';
import WalletModal from '../../../components/WalletModal';
import EthereumIcon from '../../../components/icons/EthereumIcon';



type WalletModalInitialView = 'connect' | 'send';



const EmployeeHome = observer(() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  // Wallet state
    const { isWalletConnected, walletAddress, ethBalance, isFetchingBalance, fetchBalanceError, successMessage, clearSuccessMessage, isReconnecting, fetchWalletBalance, rates, fiatCurrency } = useWallet();
      const usd = 4469.44

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
          <h2>Hi {localStorage.getItem('employee_id') || 'Employee'}</h2>
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
                <span className="balance-empty-text">0 ETH</span>
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
              <span className="balance-empty-text">Wallet Not Connected</span>
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


       <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        initialView={walletModalInitialView}
      />

    </div>


  );
});


export default EmployeeHome;