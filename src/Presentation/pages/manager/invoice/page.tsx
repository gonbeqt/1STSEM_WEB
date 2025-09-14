import React, { useState } from 'react';
import './invoice.css';
import InputWithIcon from '../../../components/InputWithIcon';
import { SearchIcon } from 'lucide-react';
import InvoiceDetails from './InvoiceDetails/InvoiceDetails';

interface InvoiceData {
  id: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  description?: string;
}

interface InvoiceManagerProps {
  className?: string;
}

const Invoice: React.FC<InvoiceManagerProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isInvoiceDetails, setIsInvoiceDetails] = useState(false);

  const handleInvoiceDetails =()=>{
    setIsInvoiceDetails(true)
  }

  const invoices: InvoiceData[] = [
    {
      id: '1',
      clientName: 'Tech Solutions Inc.',
      amount: 1150.00,
      date: '6/19/2023',
      status: 'paid',
      description: 'Services - Data Payment'
    },
    {
      id: '2',
      clientName: 'Office Depot',
      amount: 350.75,
      date: '6/19/2023',
      status: 'paid',
      description: 'Office Expenses - Payment Sent'
    },
    {
      id: '3',
      clientName: 'John Smith',
      amount: 2500.00,
      date: '6/8/2023',
      status: 'paid',
      description: 'Monthly Salary - Late 2023'
    },
    {
      id: '4',
      clientName: 'Tech Solutions Inc.',
      amount: 1150.00,
      date: '6/19/2023',
      status: 'pending',
      description: 'Services - Data Payment'
    },
    {
      id: '5',
      clientName: 'John Smith',
      amount: 2500.00,
      date: '6/8/2023',
      status: 'pending',
      description: 'Monthly Salary - Late 2023'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesTab = activeTab === 'all' || invoice.status === activeTab;
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusIcon = (status: 'paid' | 'pending') => {
    return status === 'paid' ? '✓' : '●';
  };

  const handleViewDetails = (invoiceId: string) => {
    console.log(`View details for invoice ${invoiceId}`);
  };

  return (
    <div className="invoice-manager" >
        <div className="panel-header2">
          <h2>Invoices</h2>
          <div className="info-banner">
            <span className="info-icon">ⓘ</span>
            <span>Invoices are automatically generated from transactions like payroll, payments and through "Java Payment" and client payments received.</span>
          </div>
        </div>

        <div className="search-container">
          <InputWithIcon
            icon={<SearchIcon />}
            placeholder="Search"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tab-container1">
          <button
            className={`tab1 ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`tab1 ${activeTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveTab('paid')}
          >
            Paid
          </button>
          <button
            className={`tab1 ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>

        <div className="invoice-list">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="invoice-item1" onClick={handleInvoiceDetails}>
              <div className="invoice-main">
                <div className="client-info">
                  <h3 className="client-name">{invoice.clientName}</h3>
                  <div className="invoice-meta">
                    <span className="date">Date: {invoice.date}</span>
                    <span className="description">{invoice.description}</span>
                  </div>
                </div>
                <div className="invoice-details">
                  <div className="amount">${invoice.amount.toFixed(2)}</div>
                  <div className={`status-badge ${invoice.status}`}>
                    <span className="status-icon">{getStatusIcon(invoice.status)}</span>
                    <span className="status-text">
                      {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="view-details-btn"
                onClick={() => handleViewDetails(invoice.id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="empty-state">
            <h3 className="empty-state-title">No invoices found</h3>
          </div>
        )}
        <InvoiceDetails
        isOpen={isInvoiceDetails}
        onClose={()=> {setIsInvoiceDetails(false)}}
        
        />
    </div>
  );
};

export default Invoice;