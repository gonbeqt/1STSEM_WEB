// src/presentation/components/WalletConnectModal.tsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { container } from '../../di/container';
import { WalletViewModel } from './../../domain/models/WalletViewModal';
import './WalletModal.css';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected?: (walletAddress: string) => void;
}

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'metamask' | 'walletconnect' | 'privatekey';
}

const walletOptions: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using MetaMask wallet',
    type: 'metamask'
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '📱',
    description: 'Connect using WalletConnect protocol',
    type: 'walletconnect'
  },
  {
    id: 'privatekey',
    name: 'Private Key',
    icon: '🔑',
    description: 'Import wallet using private key',
    type: 'privatekey'
  }
];

const WalletModal: React.FC<WalletConnectModalProps> = observer(({ 
  isOpen, 
  onClose, 
  onWalletConnected 
}) => {
  const [viewModel] = useState<WalletViewModel>(() => container.walletViewModel());
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'input'>('select');

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setSelectedWallet(null);
      setStep('select');
      viewModel.clearForm();
      viewModel.clearErrors();
    }
  }, [isOpen, viewModel]);

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    const wallet = walletOptions.find(w => w.id === walletId);
    
    if (wallet) {
      // Set wallet type based on selection
      viewModel.setWalletType(wallet.name);
      
      if (wallet.type === 'metamask' || wallet.type === 'privatekey') {
        setStep('input');
      } else {
        // Handle WalletConnect or other protocols
        handleWalletConnectProtocol(wallet);
      }
    }
  };

  const handleWalletConnectProtocol = (wallet: WalletOption) => {
    // Placeholder for WalletConnect integration
    alert(`${wallet.name} integration coming soon!`);
    setSelectedWallet(null);
    setStep('select');
  };

  const handleConnect = async () => {
    const success = await viewModel.connectWallet();
    if (success) {
      // Get the latest wallet from the list (the one just connected)
      await viewModel.loadWallets();
      const latestWallet = viewModel.wallets[viewModel.wallets.length - 1];
      
      if (latestWallet && onWalletConnected) {
        onWalletConnected(latestWallet.address);
      }
      
      onClose();
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedWallet(null);
    viewModel.clearForm();
    viewModel.clearErrors();
  };

  const getSelectedWalletInfo = () => {
    return walletOptions.find(w => w.id === selectedWallet);
  };

  const isFormValid = () => {
    return viewModel.formData.privateKey.trim().length > 0 && 
           viewModel.formData.walletName.trim().length > 0;
  };

  if (!isOpen) return null;

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <div>
            <h3>
              {step === 'select' ? 'Connect Wallet' : `Connect ${getSelectedWalletInfo()?.name}`}
            </h3>
            <p>
              {step === 'select' 
                ? 'Choose how you would like to connect your wallet'
                : 'Enter your wallet details to connect'
              }
            </p>
          </div>
          <button onClick={onClose} className="close-button">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'select' ? (
          <div className="wallet-options">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletSelect(wallet.id)}
                className="wallet-option-btn"
              >
                <div className="wallet-icon">{wallet.icon}</div>
                <div className="flex-1">
                  <h4 className="wallet-name">
                    {wallet.name}
                  </h4>
                  <p>
                    {wallet.description}
                  </p>
                </div>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={handleBack}
              className="back-button"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="selected-wallet-info">
              <div className="wallet-icon">{getSelectedWalletInfo()?.icon}</div>
              <div>
                <h4>{getSelectedWalletInfo()?.name}</h4>
                <p>{getSelectedWalletInfo()?.description}</p>
              </div>
            </div>

            <div className="form-content">
              <div>
                <label htmlFor="walletName">
                  Wallet Name
                </label>
                <input
                  type="text"
                  id="walletName"
                  value={viewModel.formData.walletName}
                  onChange={(e) => viewModel.setWalletName(e.target.value)}
                  placeholder="Enter wallet name"
                />
              </div>

              <div>
                <label htmlFor="privateKey">
                  Private Key
                </label>
                <div className="relative">
                  <textarea
                    id="privateKey"
                    value={viewModel.formData.privateKey}
                    onChange={(e) => viewModel.setPrivateKey(e.target.value)}
                    placeholder="Enter your private key (64 hexadecimal characters)"
                    rows={4}
                  />
                </div>
                <div className="disclaimer">
                  <svg className="disclaimer-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="disclaimer-text">
                    Your private key is processed securely and never stored on our servers. 
                    Make sure you trust this application before entering your private key.
                  </p>
                </div>
              </div>

              {viewModel.connectError && (
                <div className="error-message">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p>{viewModel.connectError}</p>
                </div>
              )}

              <div className="action-buttons">
                <button
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </button>
                <button
                  onClick={handleConnect}
                  disabled={viewModel.isConnecting || !isFormValid()}
                  className="connect-button"
                >
                  {viewModel.isConnecting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                        <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Connecting...
                    </div>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default WalletModal;
