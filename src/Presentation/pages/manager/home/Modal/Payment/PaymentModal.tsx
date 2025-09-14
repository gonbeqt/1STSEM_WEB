import React, { useState } from 'react';
import './PaymentModal.css';

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
    console.log('Sending payment:', paymentData);
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
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <button className="back-button" onClick={handleBack} disabled={currentStep === 'recipient'}>
            ←
          </button>
          <h2>Send Payment</h2>
        </div>

        <div className="progress-bar">
          {steps.map((step, index) => (
            <div 
              key={step}
              className={`progress-step ${index <= currentStepIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="modal-content">
          {currentStep === 'recipient' && (
            <div className="step-content">
              <div className="form-group1">
                <label>Company/Recipient Name</label>
                <input
                  type="text"
                  placeholder="Amazon Co."
                  value={paymentData.recipientName}
                  onChange={(e) => updatePaymentData('recipientName', e.target.value)}
                />
              </div>
              
              <div className="form-group1">
                <label>Recipient Address / Company Wallet</label>
                <input
                  type="text"
                  placeholder="0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
                  value={paymentData.recipientAddress}
                  onChange={(e) => updatePaymentData('recipientAddress', e.target.value)}
                />
              </div>

              <div className="form-group1">
                <label>Category</label>
                <select
                  value={paymentData.category}
                  onChange={(e) => updatePaymentData('category', e.target.value)}
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
            <div className="step-content">
              <div className="form-group1">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={paymentData.amount}
                  onChange={(e) => updatePaymentData('amount', e.target.value)}
                />
              </div>

              <div className="form-group1">
                <label>Select Token</label>
                <div className="token-selector">
                  {(['ETH', 'BTC', 'USDT', 'USDC'] as TokenType[]).map((token) => (
                    <button
                      key={token}
                      className={`token-button ${paymentData.selectedToken === token ? 'active' : ''}`}
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
            <div className="step-content">
              <div className="step-labels">
                <span>Recipient</span>
                <span>Amount Wallet</span>
                <span>Confirm</span>
              </div>

              <div className="form-group1">
                <label>Amount</label>
                <div className="amount-display">
                  {paymentData.amount} {paymentData.selectedToken}
                </div>
              </div>

              <div className="form-group1">
                <label>Select Token</label>
                <div className="token-selector">
                  {(['ETH', 'BTC', 'USDT', 'USDC'] as TokenType[]).map((token) => (
                    <button
                      key={token}
                      className={`token-button ${paymentData.selectedToken === token ? 'active' : ''}`}
                      onClick={() => updatePaymentData('selectedToken', token)}
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              <div className="conversion-info">
                <div>Equivalent in USD: ${getUSDValue(paymentData.amount, paymentData.selectedToken).toFixed(2)}</div>
                <div>Estimated Gas Fee: 0.001 ETH</div>
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="step-content">
              <div className="step-labels">
                <span>Recipient</span>
                <span>Amount Wallet</span>
                <span>Confirm</span>
              </div>

              <div className="payment-preview">
                <h3>Payment Preview</h3>
                
                <div className="preview-item">
                  <span>To:</span>
                  <div>
                    <div>{paymentData.recipientName}</div>
                    <div className="address">{paymentData.recipientAddress.substring(0, 20)}...</div>
                  </div>
                </div>

                <div className="preview-item">
                  <span>Amount:</span>
                  <div>
                    <div>{paymentData.amount} {paymentData.selectedToken}</div>
                    <div className="usd-amount">($ {getUSDValue(paymentData.amount, paymentData.selectedToken).toFixed(2)})</div>
                  </div>
                </div>

                <div className="preview-item">
                  <span>Description:</span>
                  <span>{paymentData.category}</span>
                </div>

                <div className="preview-item">
                  <span>Category:</span>
                  <span>{paymentData.category}</span>
                </div>

                <div className="preview-item">
                  <span>Gas Fee:</span>
                  <span>{getGasFee()} ETH</span>
                </div>

                <div className="total-section">
                  <div className="total-amount">
                    <strong>{getTotalAmount().toFixed(6)} {paymentData.selectedToken}</strong>
                  </div>
                  <div className="total-usd">
                    ($ {getUSDValue(getTotalAmount().toString(), paymentData.selectedToken).toFixed(2)})
                  </div>
                </div>

                <div className="info-box">
                  <span>ℹ️</span>
                  <span>By clicking send the automatically generated once the recipient is confirmed.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          
          {currentStep === 'preview' ? (
            <button className="continue-button1" onClick={handleSendPayment}>
              Send Payment
            </button>
          ) : (
            <button 
              className="continue-button1" 
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