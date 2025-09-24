import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useInvoices } from '../../../hooks/useInvoices';
import { Invoice } from '../../../../domain/entities/InvoiceEntities';
import './invoice.css'; // Import the CSS file
import InvoiceDetailsPage from './InvoiceDetails/page';

const ManagerInvoicePage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  // Replace with actual user ID from authentication context
  const dummyUserId = "manager123";

  const { invoices, loading, error, reloadInvoices } = useInvoices(dummyUserId);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

    const handleViewDetails = (invoice_id: string) => {
    setSelectedInvoiceId(invoice_id); // open modal
    };

        const handleCloseModal = () => {
        setSelectedInvoiceId(null); // close modal
        };
  useEffect(() => {
    reloadInvoices();
  }, [reloadInvoices]);

  useEffect(() => {
    if (!invoices) return;

    let filtered = invoices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        (invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice._id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === activeTab);
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, activeTab]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'overdue':
        return <AlertCircle size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const formatAmount = (total_amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(total_amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTabCount = (status: string): number => {
    if (!invoices) return 0;
    if (status === 'all') return invoices.length;
    return invoices.filter(invoice => invoice.status === status).length;
  };


  const handleCreateInvoice = () => {
    // Navigate to create invoice page
    console.log('Create new invoice');
    // You can implement navigation here
    // e.g., navigate('/invoices/create');
  };
  if (loading) {
    return (
      <div className="invoice-manager">
        <div className="invoice-panel">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-manager">
        <div className="invoice-panel">
          <div className="error-state">
            <AlertCircle size={48} className="error-icon" />
            <h3>Something went wrong</h3>
            <p>Error: {error}</p>
            <button onClick={reloadInvoices} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-manager">
      <div className="invoice-panel">
        {/* Header */}
        <div className="panel-header2">
          <h2>Invoice Manager</h2>
          <div className="info-banner">
            <FileText className="info-icon" size={18} />
            <span>Manage and track all your invoices in one place. Monitor payment status and client information.</span>
          </div>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search invoices by client name, ID, or description..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-container1">
          <button 
            className={`tab1 ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({getTabCount('all')})
          </button>
          <button 
            className={`tab1 ${activeTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveTab('paid')}
          >
            Paid ({getTabCount('paid')})
          </button>
          <button 
            className={`tab1 ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({getTabCount('pending')})
          </button>
          <button 
            className={`tab1 ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            Overdue ({getTabCount('overdue')})
          </button>
        </div>

        {/* Invoice List */}
        <div className="invoice-list">
          {filteredInvoices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={64} />
              </div>
              <h3 className="empty-state-title">
                {searchTerm || activeTab !== 'all' ? 'No matching invoices found' : 'No invoices yet'}
              </h3>
              <p className="empty-state-description">
                {searchTerm 
                  ? `No invoices match your search for "${searchTerm}". Try adjusting your search terms.`
                  : activeTab !== 'all'
                  ? `No ${activeTab} invoices found. Invoices will appear here when their status matches this filter.`
                  : 'Create your first invoice to get started with managing your billing and payments.'
                }
              </p>
              {!searchTerm && activeTab === 'all' && (
                <button className="create-invoice-btn" onClick={handleCreateInvoice}>
                  <Plus size={18} />
                  Create First Invoice
                </button>
              )}
            </div>
          ) : (
            filteredInvoices.map((invoice: Invoice) => (
              <div key={invoice._id} className="invoice-item1" tabIndex={0}>
                <div className="invoice-main">
                  <div className="client-info">
                    <h3 className="client-name">
                      {invoice.clientName || `Client for Invoice ${invoice.clientName}`}
                    </h3>
                    <div className="invoice-meta">
                      <span className="invoice-id">{invoice.invoice_id}</span>
                      <span className="date">Created: {formatDate(invoice.createdAt)}</span>
                      {invoice.description && (
                        <p className="description">{invoice.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="invoice-details">
                    <div className="amount">
                      {formatAmount(invoice.total_amount, invoice.currency)}
                    </div>
                    <div className={`status-badge ${invoice.status}`}>
                      <span className="status-icon">{getStatusIcon(invoice.status)}</span>
                      <span>{invoice.status}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="view-details-btn" 
                  onClick={() => handleViewDetails(invoice._id)}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
        {selectedInvoiceId && (
    <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleCloseModal}>
            ✕
        </button>
        <InvoiceDetailsPage invoiceId={selectedInvoiceId}
        onClose={handleCloseModal} />
        </div>
    </div>
)}
    </div>
  );
};

export default ManagerInvoicePage;