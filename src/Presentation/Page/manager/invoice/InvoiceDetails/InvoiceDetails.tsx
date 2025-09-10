import React from 'react';
import './InvoiceDetails.css';

interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  tax: number;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceDetails: React.FC<InvoiceModalProps> = ({ isOpen, onClose }) => {
  const invoiceData = {
    invoiceNumber: 'INV-2023-004',
    issueDate: 'January 15, 2024',
    from: {
      company: 'Your Company',
      address: '123 Business Ln, City',
      email: 'company@yourcompany.com',
      phone: '+1 (555) 123-4567'
    },
    to: {
      company: 'Tech Solutions Inc.',
    },
    items: [
      {
        description: 'IT Consulting Services',
        qty: 1,
        unitPrice: 3500.00,
        tax: 315.00
      }
    ] as InvoiceItem[],
    subtotal: 3500.00,
    tax: 315.00,
    total: 3815.00,
    paymentInfo: {
      method: 'Cryptocurrency',
      transactionId: '0x7bC766ABCC0AB800...'
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownloadPDF = () => {
    // PDF download logic would go here
    console.log('Downloading PDF...');
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="invoice-modal">
        <div className="invoice-header">
          <button className="back-button" onClick={onClose}>
            ← Invoice Details
          </button>
          <div className="invoice-number">
            <span>{invoiceData.invoiceNumber}</span>
            <span className="paid-badge">Paid</span>
          </div>
          <div className="issue-date">
            Issue on {invoiceData.issueDate}
          </div>
        </div>

        <div className="invoice-content">
          <div className="invoice-parties">
            <div className="party-section">
              <h3>From</h3>
              <div className="party-info">
                <div className="company-name">{invoiceData.from.company}</div>
                <div className="company-address">{invoiceData.from.address}</div>
                <div className="contact-info">{invoiceData.from.email}</div>
                <div className="contact-info">{invoiceData.from.phone}</div>
              </div>
            </div>
            <div className="party-section">
              <h3>To</h3>
              <div className="party-info">
                <div className="company-name">{invoiceData.to.company}</div>
              </div>
            </div>
          </div>

          <div className="invoice-table">
            <div className="table-header">
              <div className="col-description">Description</div>
              <div className="col-qty">Qty</div>
              <div className="col-price">Unit Price</div>
              <div className="col-tax">Tax</div>
            </div>
            {invoiceData.items.map((item, index) => (
              <div key={index} className="table-row">
                <div className="col-description">{item.description}</div>
                <div className="col-qty">{item.qty}</div>
                <div className="col-price">${item.unitPrice.toFixed(2)}</div>
                <div className="col-tax">${item.tax.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="invoice-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${invoiceData.tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>${invoiceData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-info">
            <h3>Payment Information</h3>
            <div className="payment-status">
              <span className="status-icon">✓</span>
              <span>Payment Received</span>
            </div>
            <div className="payment-details">
              <div className="payment-method">
                <span>Method:</span>
                <span>{invoiceData.paymentInfo.method}</span>
              </div>
              <div className="transaction-id">
                <span>Transaction ID:</span>
                <span>{invoiceData.paymentInfo.transactionId}</span>
              </div>
            </div>
          </div>

          <div className="notes-section">
            <h3>Notes & Terms</h3>
            <p>
              Thank you for your business. Payment is due within 30 days of the invoice date. Late payments are subject to a 2% monthly fee.
            </p>
          </div>
        </div>

        <div className="invoice-footer">
          <button className="download-btn" onClick={handleDownloadPDF}>
            📥 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;