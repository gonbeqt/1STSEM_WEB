import React, { useState, useEffect } from 'react';
import { X, Wallet, Send } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { observer } from 'mobx-react-lite';

type ModalView = 'connect' | 'send';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: ModalView;
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
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-5"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl max-h-screen overflow-y-auto text-black">
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-0 mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {currentView === 'connect' ? (
                <Wallet className="w-6 h-6 text-purple-600" />
              ) : (
                <Send className="w-6 h-6 text-purple-600" />
              )}
            </div>
            <div>
              <h2 className="text-black text-xl font-semibold m-0 leading-tight">
                {currentView === 'connect' ? 'Connect Wallet' : 'Send ETH'}
              </h2>
              <p className="text-gray-500 text-sm mt-1 m-0 leading-tight">
                {currentView === 'connect' ? 'Choose your preferred wallet' : 'Transfer Ethereum'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-500 cursor-pointer p-2 rounded-lg transition-all hover:text-black flex items-center justify-center flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs (only shown when wallet is connected) */}
        

        {/* Content */}
        <div className="px-6 pb-6">
          {currentView === 'connect' && (
            <div className="flex flex-col gap-3">
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter Private Key"
                  value={privateKeyInput}
                  onChange={(e) => setPrivateKeyInput(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-black text-sm transition-all placeholder:text-gray-600 focus:outline-none focus:border-purple-600 focus:shadow-lg"
                />
              </div>
              <button
                onClick={() => handleWalletConnect('Private Key')}
                className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white border-none rounded-xl p-4 text-base font-semibold cursor-pointer transition-all hover:bg-purple-700 hover:-translate-y-px"
              >
                Connect with Private Key
              </button>
            </div>
          )}

          {currentView === 'send' && isWalletConnected && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="recipient" className="text-black text-sm font-medium">Recipient Address:</label>
                <input
                  id="recipient"
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-black text-sm transition-all placeholder:text-gray-600 focus:outline-none focus:border-purple-600 focus:shadow-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-black text-sm font-medium">Amount (ETH):</label>
                <input
                  id="amount"
                  type="number"
                  step="0.0001"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-black text-sm transition-all placeholder:text-gray-600 focus:outline-none focus:border-purple-600 focus:shadow-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="company" className="text-black text-sm font-medium">Company:</label>
                <input
                  id="company"
                  type="text"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-black text-sm transition-all placeholder:text-gray-600 focus:outline-none focus:border-purple-600 focus:shadow-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-black text-sm font-medium">Category:</label>
                <input
                  id="category"
                  type="text"
                  placeholder="Transaction Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-black text-sm transition-all placeholder:text-gray-600 focus:outline-none focus:border-purple-600 focus:shadow-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-black text-sm font-medium">Description:</label>
                <input
                  id="description"
                  type="text"
                  placeholder="Transaction Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-black text-sm transition-all placeholder:text-gray-600 focus:outline-none focus:border-purple-600 focus:shadow-lg"
                />
              </div>

              {sendEthError && (
                <p className="text-red-500 text-sm m-0 p-3 bg-red-100 rounded-lg border border-red-200">
                  {sendEthError}
                </p>
              )}
              
              {successMessage && (
                <p className="text-green-500 text-sm m-0 p-3 bg-green-100 rounded-lg border border-green-200">
                  {successMessage}
                </p>
              )}

              <button
                onClick={handleSendEth}
                className={`flex items-center justify-center gap-2 w-full bg-purple-600 text-white border-none rounded-xl p-4 text-base font-semibold cursor-pointer transition-all mt-2 ${
                  isSendingEth ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700 hover:-translate-y-px'
                }`}
                disabled={isSendingEth}
              >
                {isSendingEth ? 'Sending...' : 'Send ETH'}
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-gray-500 text-xs m-0 leading-relaxed">
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