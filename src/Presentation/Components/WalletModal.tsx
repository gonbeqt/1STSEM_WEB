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
  const { connectWallet, isWalletConnected, sendEth, isSendingEth, fetchWalletBalance } = useWallet();
  const [privateKeyInput, setPrivateKeyInput] = useState<string>('');
  const [currentView, setCurrentView] = useState<ModalView>(initialView);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sendStep, setSendStep] = useState<'form' | 'summary'>('form');

  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView);
      setSendStep('form');
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
    } else {    }
  };

  const handleSendEth = async () => {
    const success = await sendEth(recipientAddress, amount, company, category, description);
    if (success) {
      setRecipientAddress('');
      setAmount('');
      setCompany('');
      setCategory('');
      setDescription('');
      setSendStep('form');
      onClose();
    } else {    }
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
            <div>
              {sendStep === 'form' ? (
                <div className="grid grid-cols-1 gap-6">
                  {/* Form column (full width) */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="recipient" className="text-black text-sm font-medium">Recipient Address</label>
                      <input
                        id="recipient"
                        type="text"
                        placeholder="0x..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-black text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:shadow-md"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="amount" className="text-black text-sm font-medium">Amount (ETH)</label>
                        <input
                          id="amount"
                          type="number"
                          step="0.0001"
                          placeholder="0.0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-black text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:shadow-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className="text-black text-sm font-medium">Company</label>
                        <input
                          id="company"
                          type="text"
                          placeholder="Company Name"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-black text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:shadow-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="text-black text-sm font-medium">Category</label>
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-black text-sm transition-all focus:outline-none focus:border-purple-600 focus:shadow-md"
                        >
                          <option value="">Select Category</option>
                          <option value="CUSTOMER_PAYMENT">Customer Payment</option>
                          <option value="BUSINESS_PAYMENT">Business Payment</option>
                          <option value="SUPPLIER_PAYMENT">Supplier Payment</option>
                          <option value="INVESTMENT">Investment</option>
                          <option value="PAYROLL">Payroll</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="description" className="text-black text-sm font-medium">Description</label>
                        <input
                          id="description"
                          type="text"
                          placeholder="Transaction Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-black text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:shadow-md"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => setSendStep('summary')}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white ${(!recipientAddress || !amount) ? 'opacity-60 cursor-not-allowed' : 'hover:from-purple-700 hover:to-purple-800 hover:-translate-y-0.5'}`}
                        disabled={!recipientAddress || !amount}
                      >
                        Next
                      </button>

                      <button
                        onClick={onClose}
                        className="px-4 py-3 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full">

                  {/* Summary column */}
                  <section className=" bg-gray-50 border border-gray-100 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Summary</h4>
                    <div className="text-sm text-gray-600 space-y-3">
                      <div>
                        <div className="text-xs text-gray-500">Recipient</div>
                        <div className="text-sm text-gray-900 truncate">{recipientAddress || '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500">Company</div>
                        <div className="text-sm text-gray-900">{company || '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500">Category</div>
                        <div className="text-sm text-gray-900">{category || '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500">Amount (ETH)</div>
                        <div className="text-lg font-semibold text-gray-900">{amount || '0.0'} ETH</div>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">Estimated Gas</div>
                        <div className="text-sm text-gray-900">0.003 ETH</div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="text-lg font-bold text-gray-900">{(parseFloat(amount || '0') + 0.003).toFixed(6)} ETH</div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => setSendStep('form')}
                          className="px-4 py-3 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          Back
                        </button>

                        <button
                          onClick={handleSendEth}
                          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white ${isSendingEth ? 'opacity-60 cursor-not-allowed' : 'hover:from-purple-700 hover:to-purple-800 hover:-translate-y-0.5'}`}
                          disabled={isSendingEth}
                        >
                          {isSendingEth ? 'Sending...' : 'Send ETH'}
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                  
                    </div>
                  </section>
                </div>
              )}
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