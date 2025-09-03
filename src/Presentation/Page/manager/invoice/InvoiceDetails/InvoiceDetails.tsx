import React, { useState } from 'react';
import './InvoiceDetails.css';
import { useNavigate } from 'react-router-dom';

interface InvoiceItem {
  description: string;
  amount: number;
  btcAmount: string;
}

interface TimelineEvent {
  id: string;
  status: 'created' | 'processed' | 'paid';
  timestamp: string;
  description?: string;
  platform?: string;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  btcAmount: string;
  usdAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  walletAddress: string;
  transactionHash: string;
  description: string;
  category: string;
  items: InvoiceItem[];
  timeline: TimelineEvent[];
  totalBtc: string;
}

const InvoiceDetails: React.FC = () => {
  // Sample invoice data matching the design
  const navigate = useNavigate();
  const [invoiceData] = useState<InvoiceData>({
    id: '1',
    invoiceNumber: 'INV-2023-001',
    btcAmount: '0.15000000',
    usdAmount: 4500,
    status: 'paid',
    date: '2023-06-30',
    walletAddress: '0x1a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    transactionHash: '0x1a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    description: 'Monthly Salary - John Doe',
    category: 'Payroll',
    totalBtc: '0.150000',
    items: [
      {
        description: 'Base Salary',
        amount: 4000,
        btcAmount: '0.133333'
      },
      {
        description: 'Overtime (10 hours)',
        amount: 500,
        btcAmount: '0.016667'
      }
    ],
    timeline: [
      {
        id: '1',
        status: 'created',
        timestamp: '2023-06-12T10:30:00Z',
        description: 'Invoice created'
      },
      {
        id: '2',
        status: 'processed',
        timestamp: '2023-06-13T09:15:00Z',
        description: 'Payment processed'
      },
      {
        id: '3',
        status: 'paid',
        timestamp: '2023-06-15T14:45:00Z',
        description: 'Payment completed',
        platform: 'MetaMask'
      }
    ]
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr} at ${timeStr}`;
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

 
  const handleViewReceipt = (): void => {
   navigate('/invoice_receipt');
  };

  const handleDownload = (): void => {
    console.log('Download clicked');
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'status-paid1';
      case 'pending':
        return 'status-pending1';
      case 'overdue':
        return 'status-overdue1';
      default:
        return 'status-pending1';
    }
  };

  const getTimelineIcon = (status: string): React.ReactElement => {
    switch (status) {
      case 'created':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'processed':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z"/>
          </svg>
        );
      case 'paid':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
    }
  };

  return (
    <div className="invoice-details-page1">
      {/* Header */}
      <div className="header5">
         <div className="header4">
                <button className="back-button" onClick={() => navigate(-1)} type="button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1>Invoice Details</h1>

            </div>
      </div>

      {/* Bitcoin Amount Section */}
      <div className="btc-section1">
        <div className="btc-symbol1">₿</div>
        <div className="btc-amount1">{invoiceData.btcAmount} BTC</div>
        <div className="usd-amount1">{formatCurrency(invoiceData.usdAmount)}</div>
        <span className={`status-badge1 ${getStatusClass(invoiceData.status)}`}>
          {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
        </span>
      </div>

      {/* Invoice Info */}
      <div className="invoice-info1">
        <div className="info-item1">
          <span className="info-label1">Invoice #</span>
          <span className="info-value1">{invoiceData.invoiceNumber}</span>
        </div>
        <div className="info-item1">
          <span className="info-label1">Date</span>
          <span className="info-value1">{formatDate(invoiceData.date)}</span>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="wallet-section1">
        <div className="wallet-header1">
          <div className="wallet-icon1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <div className="wallet-info1">
            <div className="wallet-name1">MetaMask</div>
            <div className="wallet-type1">Wallet</div>
          </div>
        </div>
        
        <div className="hash-container1">
          <span className="hash-text1">{invoiceData.walletAddress}</span>
          <button 
            className="copy-btn1"
            onClick={() => copyToClipboard(invoiceData.walletAddress)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Transaction Hash */}
      <div className="section1">
        <div className="section-label1">Transaction Hash</div>
        <div className="hash-container1">
          <span className="hash-text1">{invoiceData.transactionHash}</span>
          <button 
            className="copy-btn1"
            onClick={() => copyToClipboard(invoiceData.transactionHash)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="section1">
        <div className="section-label1">Description</div>
        <div className="description1">
          <div className="description-title1">{invoiceData.description}</div>
          <div className="description-category1">{invoiceData.category}</div>
        </div>
      </div>

      {/* Items */}
      <div className="section1">
        <div className="section-label1">Items</div>
        <div className="items-container1">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="item1">
              <div className="item-description1">{item.description}</div>
              <div className="item-amounts1">
                <div className="item-btc1">{item.btcAmount} BTC</div>
                <div className="item-usd1">{formatCurrency(item.amount)}</div>
              </div>
            </div>
          ))}
          
          <div className="total-row1">
            <div className="total-label1">Total</div>
            <div className="total-amounts1">
              <div className="total-btc1">{invoiceData.totalBtc} BTC</div>
              <div className="total-usd1">{formatCurrency(invoiceData.usdAmount)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="section1">
        <div className="section-label1">Timeline</div>
        <div className="timeline1">
          {invoiceData.timeline.map((event) => (
            <div key={event.id} className={`timeline-item1 ${event.status}1`}>
              <div className="timeline-icon1">
                {getTimelineIcon(event.status)}
              </div>
              <div className="timeline-content1">
                <div className="timeline-status1">
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </div>
                <div className="timeline-date1">{formatDateTime(event.timestamp)}</div>
                {event.platform && (
                  <div className="timeline-platform1">via {event.platform}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions1">
        <button className="btn1 btn-primary1" onClick={handleViewReceipt}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          View Receipt
        </button>
        
        <button className="btn1 btn-secondary1" onClick={handleDownload}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetails;