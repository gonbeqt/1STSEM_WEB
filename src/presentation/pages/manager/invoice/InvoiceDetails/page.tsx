import React, { useEffect, useState } from "react";
import { Invoice, InvoiceItem } from "../../../../../domain/entities/InvoiceEntities";
import { container } from "../../../../../di/container";
import { X, CheckCircle, AlertCircle, Clock } from "lucide-react";
import './InvoiceDetails.css'
interface InvoiceDetailsProps {
  invoiceId: string;
  onClose: () => void; // allow modal close
}

const InvoiceDetailsPage: React.FC<InvoiceDetailsProps> = ({ invoiceId, onClose }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const invoiceViewModel = container.invoiceViewModel();
        await invoiceViewModel.loadUserInvoices("dummyUserId");
        const foundInvoice = invoiceViewModel.invoices.find((inv: Invoice) => inv._id === invoiceId);
        if (foundInvoice) {
          setInvoice(foundInvoice);
        } else {
          setError("Invoice not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch invoice details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  // Status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return "status-badge status-paid";
      case "pending":
        return "status-badge status-pending";
      case "overdue":
        return "status-badge status-overdue";
      default:
        return "status-badge";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "overdue":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="invoice-modal-backdrop">
        <div className="invoice-modal">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading invoice details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-modal-backdrop">
        <div className="invoice-modal">
          <div className="error-container">
            <AlertCircle size={48} className="error-icon" />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-modal-backdrop">
        <div className="invoice-modal">
          <div className="error-container">
            <p>No invoice details available.</p>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-modal-backdrop">
      <div className="invoice-modal">
        {/* Header */}
        <div className="invoice-modal-header">
          <div className="header-left">
            <div className="invoice-info">
              <h2>Invoice #{invoice.invoice_number || invoice._id}</h2>
              <p className="issue-date">Issued {new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="header-right">
            <div className={getStatusClass(invoice.status)}>
              {getStatusIcon(invoice.status)}
              {invoice.status}
            </div>
          
          </div>
        </div>

        {/* Content */}
        <div className="invoice-modal-content">
          {/* Parties */}
          <div className="invoice-parties">
            <div className="party-section">
              <h3>Bill To</h3>
              <p className="company-name">{invoice.clientName}</p>
              {invoice.client_address && <p className="company-address">{invoice.client_address}</p>}
              {invoice.client_email && <p className="contact-info">{invoice.client_email}</p>}
            </div>
            <div className="party-section">
              <h3>From</h3>
              <p className="company-name">Your Company</p>
              <p className="company-address">123 Business St, City, Country</p>
              <p className="contact-info">support@yourcompany.com</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="invoice-table-container">
            <div className="invoice-table">
              <div className="table-header">
                <div>Description</div>
                <div>Qty</div>
                <div>Rate</div>
                <div>Amount</div>
              </div>
              <div className="table-body">
                {invoice.items?.map((item: InvoiceItem, index: number) => (
                  <div className="table-row" key={index}>
                    <div className="col-description">
                      <div className="item-description">{item.description}</div>
                    </div>
                    <div className="col-quantity">{item.quantity}</div>
                    <div className="col-rate">
                      {item.unit_price} {invoice.currency}
                    </div>
                    <div className="col-amount">
                      {item.total_price} {invoice.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="invoice-summary">
            <div className="summary-content">
              {invoice.tax_rate !== undefined && (
                <div className="summary-row">
                  <span>Tax ({invoice.tax_rate * 100}%)</span>
                  <span>{(invoice.total_amount * invoice.tax_rate).toFixed(2)} {invoice.currency}</span>
                </div>
              )}
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{invoice.total_amount} {invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="notes-section">
              <h3>Notes</h3>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="invoice-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary">Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
