import React from 'react';
import './InvoiceReceipt.css';
import { useNavigate } from 'react-router-dom';

interface ReceiptItem {
  name: string;
  cryptoAmount: number;
  usdAmount: number;
}

interface CryptoReceiptProps {
  receiptNo?: string;
  invoiceNo?: string;
  date?: string;
  paymentStatus?: string;
  exchangeRate?: number;
  items?: ReceiptItem[];
  subtotal?: { crypto: number; usd: number };
  tax?: { crypto: number; usd: number };
  total?: { crypto: number; usd: number };
  walletAddress?: string;
  transactionHash?: string;
}

const InvoiceReceipt: React.FC<CryptoReceiptProps> = ({
  receiptNo = "RCP-1239-001",
  invoiceNo = "INV-2023-001",
  date = "September 2, 2025",
  paymentStatus = "paid",
  exchangeRate = 30000,
  items = [
    { name: "Printer and Stationery", cryptoAmount: 0.13333300, usdAmount: 4000 },
    { name: "Printer Ink", cryptoAmount: 0.01666700, usdAmount: 500 }
  ],
  subtotal = { crypto: 0.15000000, usd: 4500 },
  tax = { crypto: 0.01200000, usd: 360 },
  total = { crypto: 0.16200000, usd: 4860 },
  walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  transactionHash = "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
}) => {
    const navigate = useNavigate()
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const handleDownload = () => {
    // Download functionality would be implemented here
    console.log("Download receipt");
  };

  

  return (
    <div className="crypto-receipt-container">
      {/* Header */}
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="header-title">Receipt Details</h1>
      </div>

      {/* Receipt Card */}
      <div className="receipt-card">
        {/* Receipt Header */}
        <div className="receipt-header">
          <div className="receipt-title-row">
            <h2 className="receipt-title">Crypto Receipt</h2>
            <button className="download-button" onClick={handleDownload}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Company Info */}
          <div className="company-info">
            <div className="bitcoin-icon">₿</div>
            <div className="company-details">
              <h3 className="company-name">Crypto Corp</h3>
              <p className="company-address">123 Blockchain Ave, Suite 100</p>
              <p className="company-address">San Francisco, CA 94107</p>
              <p className="company-email">support@cryptocorp.io</p>
            </div>
          </div>
        </div>

        {/* Receipt Info */}
        <div className="receipt-info">
          <div className="info-row">
            <span className="info-label">Receipt No:</span>
            <span className="info-value">{receiptNo}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Invoice No:</span>
            <span className="info-value">{invoiceNo}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">{date}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Payment Status:</span>
            <span className="info-value status-paid">{paymentStatus}</span>
          </div>
        </div>

        {/* Purchase Info */}
        <div className="purchase-info">
          <h4 className="purchase-title">Office supplies - Staples</h4>
          <p className="purchase-type">Type: Others</p>
          <p className="exchange-rate">Exchange Rate: 1 BTC = $ {exchangeRate.toLocaleString()} USD</p>
        </div>

        {/* Items Table */}
        <div className="items-section">
          <div className="items-header">
            <span className="item-col">Item</span>
            <span className="crypto-col">Crypto</span>
            <span className="usd-col">USD</span>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <span className="item-name">{item.name}</span>
              <span className="crypto-amount">{item.cryptoAmount.toFixed(8)} BTC</span>
              <span className="usd-amount">${item.usdAmount.toLocaleString()}</span>
            </div>
          ))}

          {/* Totals */}
          <div className="totals-section">
            <div className="total-row subtotal">
              <span className="total-label">Subtotal:</span>
              <div className="total-amounts">
                <span className="crypto-total">{subtotal.crypto.toFixed(8)} BTC</span>
                <span className="usd-total">${subtotal.usd.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="total-row tax">
              <span className="total-label">Tax (8%):</span>
              <div className="total-amounts">
                <span className="crypto-total">{tax.crypto.toFixed(8)} BTC</span>
                <span className="usd-total">${tax.usd}</span>
              </div>
            </div>
            
            <div className="total-row final-total">
              <span className="total-label">Total:</span>
              <div className="total-amounts">
                <span className="crypto-total">{total.crypto.toFixed(8)} BTC</span>
                <span className="usd-total">${total.usd.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="payment-section">
          <h4 className="payment-title">Payment Information</h4>
          
          <div className="payment-method">
            <span className="payment-label">Payment Method:</span>
            <span className="payment-value">Trust Wallet</span>
          </div>

          <div className="wallet-info">
            <div className="wallet-row">
              <span className="wallet-label">🔗 Wallet Address:</span>
              <button 
                className="copy-button"
                onClick={() => handleCopyToClipboard(walletAddress)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
            </div>
            <div className="address-text">{walletAddress}</div>
          </div>

          <div className="transaction-info">
            <div className="transaction-row">
              <span className="transaction-label">Transaction Hash:</span>
              <button 
                className="copy-button"
                onClick={() => handleCopyToClipboard(transactionHash)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
            </div>
            <div className="hash-text">{transactionHash}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <p className="footer-message">Thank you for using cryptocurrency!</p>
          <p className="footer-blockchain">This receipt was generated on the blockchain.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReceipt;