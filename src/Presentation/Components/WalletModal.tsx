// src/Presentation/components/WalletModal.tsx (No Tailwind)
import React, { useState, useEffect } from 'react';
import { X, Wallet, ArrowRight, Send } from 'lucide-react';
import './WalletModal.css';
import { useWallet } from '../hooks/useWallet';
import { observer } from 'mobx-react-lite';

type ModalView = 'connect' | 'send';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: ModalView; // New prop
}

const WalletModal: React.FC<WalletModalProps> = observer(({ isOpen, onClose, initialView = 'connect' }) => {
  const { connectWallet, isWalletConnected, walletAddress, ethBalance, sendEth, isSendingEth, sendEthError, successMessage, fetchWalletBalance } = useWallet();
  const [privateKeyInput, setPrivateKeyInput] = useState<string>('');
  const [currentView, setCurrentView] = useState<ModalView>(initialView);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView);
      if (isWalletConnected) {
        fetchWalletBalance();
      }
    }
  }, [isOpen, initialView, isWalletConnected, fetchWalletBalance]);

  const handleWalletConnect = async (walletType: string) => {
    const success = await connectWallet({
      privateKey: privateKeyInput,
      walletName: walletType === 'Private Key' ? 'MetaMask' : walletType + ' Wallet',
      walletType: walletType,
    });

    if (success) {
      // If connected, switch to send view or close modal
      setCurrentView('send');
    } else {
      console.error('Failed to connect wallet');
    }
  };

  const handleSendEth = async () => {
    const success = await sendEth(recipientAddress, amount, company, category, description);
    if (success) {
      setRecipientAddress('');
      setAmount('');
      setCompany('');
      setCategory('');
      setDescription('');
    } else {
      console.error('Failed to send ETH');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="wallet-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="wallet-modal">
        {/* Header */}
        <div className="wallet-modal-header">
          <div className="wallet-modal-header-content">
            <div className="wallet-modal-icon-container">
              <Wallet className="wallet-modal-icon" />
            </div>
            <div>
              <h2 className="wallet-modal-title">
                {currentView === 'connect' ? 'Connect Wallet' : 'Send ETH'}
              </h2>
              <p className="wallet-modal-subtitle">
                {currentView === 'connect' ? 'Choose your preferred wallet' : 'Transfer Ethereum'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="close-button"
          >
            <X className="close-button-icon" />
          </button>
        </div>

        {/* View Tabs */}
        {isWalletConnected && (
          <div className="wallet-modal-tabs">
            <button 
              className={`wallet-modal-tab ${currentView === 'connect' ? 'active' : ''}`}
              onClick={() => setCurrentView('connect')}
            >
              Connect
            </button>
            <button 
              className={`wallet-modal-tab ${currentView === 'send' ? 'active' : ''}`}
              onClick={() => setCurrentView('send')}
            >
              Send
            </button>
          </div>
        )}

        {/* Content */}
        <div className="wallet-modal-content">
          {currentView === 'connect' && (
            <div className="wallet-options">
              <div className="private-key-input-container">
                <input
                  type="password"
                  placeholder="Enter Private Key"
                  className="private-key-input"
                  value={privateKeyInput}
                  onChange={(e) => setPrivateKeyInput(e.target.value)}
                />
              </div>
              <button
                onClick={() => handleWalletConnect('MetaMask')}
                className="wallet-option-btn connect-private-key"
              >
                <div className="wallet-option-content">
                  <div className="wallet-icon">
                    <Wallet className="wallet-modal-icon" />
                  </div>
                  <div className="wallet-info">
                    <h3 className="wallet-name">Connect with Private Key</h3>
                  </div>
                </div>
                <ArrowRight className="wallet-arrow" />
              </button>
            </div>
          )}

          {currentView === 'send' && isWalletConnected && (
            <div className="send-eth-form">
              <p className="wallet-balance-display">Wallet Address: {walletAddress}</p>
              <p className="wallet-balance-display">Balance: {ethBalance !== null ? ethBalance.toFixed(4) : 'Loading...'} ETH</p>
              
              <div className="input-group">
                <label htmlFor="recipient">Recipient Address:</label>
                <input
                  id="recipient"
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="send-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="amount">Amount (ETH):</label>
                <input
                  id="amount"
                  type="number"
                  step="0.0001"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="send-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="company">Company:</label>
                <input
                  id="company"
                  type="text"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="send-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="category">Category:</label>
                <input
                  id="category"
                  type="text"
                  placeholder="Transaction Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="send-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Description:</label>
                <input
                  id="description"
                  type="text"
                  placeholder="Transaction Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="send-input"
                />
              </div>

              {sendEthError && <p className="error-message">{sendEthError}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}

              <button
                onClick={handleSendEth}
                className="send-eth-btn"
                disabled={isSendingEth}
              >
                {isSendingEth ? 'Sending...' : 'Send ETH'}
                <Send className="send-icon" />
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="security-notice">
            <p className="security-notice-text">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
              Your wallet information is secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default WalletModal;