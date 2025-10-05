// src/Presentation/pages/manager/home/Modal/Payment/PaymentModal.tsx
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentStep = 'recipient' | 'amount' | 'token' | 'preview';
type TokenType = 'ETH' | 'BTC' | 'USDT' | 'USDC';

interface PaymentData {
  recipientName: string;
  recipientAddress: string;
  category: string;
  amount: string;
  selectedToken: TokenType;
  description: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('recipient');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    recipientName: '',
    recipientAddress: '',
    category: 'Office Expenses',
    amount: '',
    selectedToken: 'ETH',
    description: ''
  });

  const steps = ['recipient', 'amount', 'token', 'preview'] as const;
  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleClose = () => {
    setCurrentStep('recipient');
    setPaymentData({
      recipientName: '',
      recipientAddress: '',
      category: 'Office Expenses',
      amount: '',
      selectedToken: 'ETH',
      description: ''
    });
    onClose();
  };

  const handleSendPayment = () => {
    alert('Payment sent successfully!');
    handleClose();
  };

  const updatePaymentData = (field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const getUSDValue = (amount: string, token: TokenType): number => {
    const rates = { ETH: 2800, BTC: 45000, USDT: 1, USDC: 1 };
    return parseFloat(amount || '0') * rates[token];
  };

  const getGasFee = (): number => {
    return paymentData.selectedToken === 'ETH' ? 0.003 : 0.0005;
  };

  const getTotalAmount = (): number => {
    const amount = parseFloat(paymentData.amount || '0');
    const gasFee = getGasFee();
    return amount + gasFee;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center p-5 pb-2 border-b border-gray-100">
          <button 
            className="bg-transparent border-none text-lg cursor-pointer p-2 mr-3 rounded-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed" 
            onClick={handleBack} 
            disabled={currentStep === 'recipient'}
          >
            ←
          </button>
          <h2 className="m-0 text-lg font-semibold text-gray-900">Send Payment</h2>
        </div>

        <div className="flex p-5 gap-3">
          {steps.map((step, index) => (
            <div 
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                index <= currentStepIndex ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 px-5 overflow-y-auto">
          <div className="pb-5">
            {currentStep === 'recipient' && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Company/Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Amazon Co."
                    value={paymentData.recipientName}
                    onChange={(e) => updatePaymentData('recipientName', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-base bg-gray-50 transition-all box-border text-gray-900 focus:outline-none focus:border-purple-600 focus:bg-white focus:shadow-lg"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Recipient Address / Company Wallet</label>
                  <input
                    type="text"
                    placeholder="0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
                    value={paymentData.recipientAddress}
                    onChange={(e) => updatePaymentData('recipientAddress', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-base bg-gray-50 transition-all box-border text-gray-900 focus:outline-none focus:border-purple-600 focus:bg-white focus:shadow-lg"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Category</label>
                  <select
                    value={paymentData.category}
                    onChange={(e) => updatePaymentData('category', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-base bg-gray-50 transition-all box-border text-gray-900 focus:outline-none focus:border-purple-600 focus:bg-white focus:shadow-lg"
                  >
                    <option value="Office Expenses">Office Expenses</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Software">Software</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 'amount' && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={paymentData.amount}
                    onChange={(e) => updatePaymentData('amount', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-base bg-gray-50 transition-all box-border text-gray-900 focus:outline-none focus:border-purple-600 focus:bg-white focus:shadow-lg"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Select Token</label>
                  <div className="flex gap-2 flex-wrap">
                    {(['ETH', 'BTC', 'USDT', 'USDC'] as TokenType[]).map((token) => (
                      <button
                        key={token}
                        className={`flex-1 p-3 border rounded-lg bg-gray-50 cursor-pointer font-medium transition-all min-w-[70px] ${
                          paymentData.selectedToken === token
                            ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white border-purple-600'
                            : 'text-gray-700 border-gray-200 hover:border-purple-600 hover:bg-gray-100'
                        }`}
                        onClick={() => updatePaymentData('selectedToken', token)}
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'token' && (
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-gray-500 mb-5 px-2">
                  <span>Recipient</span>
                  <span>Amount Wallet</span>
                  <span>Confirm</span>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Amount</label>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-2xl font-semibold text-center text-gray-900">
                    {paymentData.amount} {paymentData.selectedToken}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Select Token</label>
                  <div className="flex gap-2 flex-wrap">
                    {(['ETH', 'BTC', 'USDT', 'USDC'] as TokenType[]).map((token) => (
                      <button
                        key={token}
                        className={`flex-1 p-3 border rounded-lg bg-gray-50 cursor-pointer font-medium transition-all min-w-[70px] ${
                          paymentData.selectedToken === token
                            ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white border-purple-600'
                            : 'text-gray-700 border-gray-200 hover:border-purple-600 hover:bg-gray-100'
                        }`}
                        onClick={() => updatePaymentData('selectedToken', token)}
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  <div className="mb-2">Equivalent in USD: ${getUSDValue(paymentData.amount, paymentData.selectedToken).toFixed(2)}</div>
                  <div>Estimated Gas Fee: 0.001 ETH</div>
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 mb-5 px-2">
                  <span>Recipient</span>
                  <span>Amount Wallet</span>
                  <span>Confirm</span>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 my-2">
                  <h3 className="text-base font-semibold text-gray-900 mb-5 m-0">Payment Preview</h3>
                  
                  <div className="flex justify-between items-start mb-4 text-sm">
                    <span className="text-gray-600 font-medium min-w-[80px]">To:</span>
                    <div className="text-right flex-1">
                      <div className="text-gray-900">{paymentData.recipientName}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{paymentData.recipientAddress.substring(0, 20)}...</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-4 text-sm">
                    <span className="text-gray-600 font-medium min-w-[80px]">Amount:</span>
                    <div className="text-right flex-1">
                      <div className="text-gray-900">{paymentData.amount} {paymentData.selectedToken}</div>
                      <div className="text-gray-500 text-xs mt-0.5">($ {getUSDValue(paymentData.amount, paymentData.selectedToken).toFixed(2)})</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-4 text-sm">
                    <span className="text-gray-600 font-medium">Description:</span>
                    <span className="text-gray-900">{paymentData.category}</span>
                  </div>

                  <div className="flex justify-between items-start mb-4 text-sm">
                    <span className="text-gray-600 font-medium">Category:</span>
                    <span className="text-gray-900">{paymentData.category}</span>
                  </div>

                  <div className="flex justify-between items-start mb-5 text-sm">
                    <span className="text-gray-600 font-medium">Gas Fee:</span>
                    <span className="text-gray-900">{getGasFee()} ETH</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 text-center">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      <strong>{getTotalAmount().toFixed(6)} {paymentData.selectedToken}</strong>
                    </div>
                    <div className="text-sm text-gray-600">
                      ($ {getUSDValue(getTotalAmount().toString(), paymentData.selectedToken).toFixed(2)})
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg mt-4 text-xs text-blue-700 leading-snug">
                    <span>ℹ️</span>
                    <span>By clicking send the automatically generated once the recipient is confirmed.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button 
            className="flex-1 py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer transition-all bg-gray-100 text-gray-600 hover:bg-gray-200" 
            onClick={handleClose}
          >
            Cancel
          </button>
          
          {currentStep === 'preview' ? (
            <button 
              className="flex-1 py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:-translate-y-0.5 hover:shadow-lg" 
              onClick={handleSendPayment}
            >
              Send Payment
            </button>
          ) : (
            <button 
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold cursor-pointer transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:-translate-y-0.5 hover:shadow-lg ${
                (currentStep === 'recipient' && !paymentData.recipientName) ||
                (currentStep === 'amount' && !paymentData.amount) ||
                (currentStep === 'token' && !paymentData.selectedToken)
                ? 'opacity-50 cursor-not-allowed transform-none shadow-none'
                : ''
              }`}
              onClick={handleNext}
              disabled={
                (currentStep === 'recipient' && !paymentData.recipientName) ||
                (currentStep === 'amount' && !paymentData.amount) ||
                (currentStep === 'token' && !paymentData.selectedToken)
              }
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;