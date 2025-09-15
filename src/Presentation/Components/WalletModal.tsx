// src/Presentation/components/WalletModal.tsx (No Tailwind)
import React, { useState } from 'react';
import { X, Wallet, ArrowRight } from 'lucide-react';
import './WalletModal.css';
import { useWallet } from '../hooks/useWallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectWallet, setWalletType, setPrivateKey, setWalletName } = useWallet();
  const [privateKeyInput, setPrivateKeyInput] = useState<string>('');

  const handleWalletConnect = async (walletType: string) => {
    setWalletType(walletType);
    setPrivateKey(privateKeyInput);
    setWalletName(walletType + ' Wallet');
    
    const success = await connectWallet();
    if (success) {
      onClose();
    } else {
      // Handle connection error, maybe display a message in the modal
      console.error('Failed to connect wallet');
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
                Connect Wallet
              </h2>
              <p className="wallet-modal-subtitle">
                Choose your preferred wallet
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

        {/* Content */}
        <div className="wallet-modal-content">
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
              onClick={() => handleWalletConnect('Private Key')}
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
};

export default WalletModal;