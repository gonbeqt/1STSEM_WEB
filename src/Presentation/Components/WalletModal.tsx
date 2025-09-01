import React from 'react';
import './WalletModal.css';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  const walletOptions = [
    {
      id: 'metamask',
      name: 'Metamask',
      icon: '🦊', // Replace with actual icon component
    },
    {
      id: 'trustwallet',
      name: 'Trust Walet',
      icon: '💼', // Replace with actual icon component
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      icon: '🔵', // Replace with actual icon component
    }
  ];

  return (
    <div className="wallet-modal-overlay">
      <div className="wallet-modal">
        <div className="wallet-modal-header">
          <h2>Connect Wallet</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        <p className="wallet-modal-subtitle">
          Securely connect your crypto wallet to get started.
        </p>
        
        <div className="wallet-options">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              className="wallet-option-btn"
              onClick={() => onConnect(wallet.id)}
            >
              <span className="wallet-icon">{wallet.icon}</span>
              <span className="wallet-name">{wallet.name}</span>
            </button>
          ))}
        </div>

        <button className="continue-btn">Continue</button>
      </div>
    </div>
  );
};

export default WalletModal;