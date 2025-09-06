import * as React from 'react';
import { useState } from 'react';
import './invoice.css';
import InputWithIcon from '../../../Components/InputWithIcon';
import { SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Invoices {
  id: string;
  title: string;
  client: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  category?: string;
}

const Invoice: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const navigate = useNavigate();
  // Sample invoice data matching the design
  const invoices: Invoices[] = [
    {
      id: '1',
      title: 'Monthly Salary - John Doe',
      client: 'John Doe',
      amount: 4500,
      date: '2024-01-15',
      status: 'paid'
    },
    {
      id: '2',
      title: 'Website Maintenance - Q2',
      client: 'Tech Corp',
      amount: 1200,
      date: '2024-02-01',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Office Supplies - Staples',
      client: 'Staples',
      amount: 347.85,
      date: '2024-01-28',
      status: 'paid'
    },
    {
      id: '4',
      title: 'Fund Transfer to Operations',
      client: 'Internal',
      amount: 10000,
      date: '2024-01-20',
      status: 'paid'
    },
    {
      id: '5',
      title: 'Contractor Payment - Jane Smith',
      client: 'Jane Smith',
      amount: 2300,
      date: '2024-01-25',
      status: 'paid'
    },
    {
      id: '6',
      title: 'Legal Consultation',
      client: 'Law Firm LLC',
      amount: 850,
      date: '2024-02-05',
      status: 'pending'
    },
    {
      id: '7',
      title: 'Marketing Materials - Invoice',
      client: 'Print Shop',
      amount: 1567.50,
      date: '2024-01-30',
      status: 'paid'
    }
  ];

  const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingCount = invoices.filter(invoice => invoice.status === 'pending').length;

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && invoice.status === activeFilter.toLowerCase();
  });

  const handleView = (id: string): void => {
      navigate(`/invoice_details/${id}`);
  };

  const handleDownload = (id: string): void => {
    console.log('Download invoice:', id);
  };

  const handleEdit = (id: string): void => {
    console.log('Edit invoice:', id);
  };

  const handleDelete = (id: string): void => {
    console.log('Delete invoice:', id);
  };

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

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'status-paid';
      case 'pending':
        return 'status-pending';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-pending';
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="invoices-app">
      {/* Header Section */}
      <div className="header3">
        <h1 className="title">Invoices</h1>
        
        {/* Stats Cards */}
        
      </div>
  <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total Billed</div>
            <div className="stat-value">{formatCurrency(totalBilled)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Paid</div>
            <div className="stat-value paid">{formatCurrency(paidAmount)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value pending">{pendingCount}</div>
          </div>
        </div>  
      {/* Search Bar */}
      <div className="search-container">
        <InputWithIcon
          icon={<SearchIcon />}
          placeholder="Search"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All', 'Paid', 'Pending', 'Overdue'].map((filter) => (
          <button
            key={filter}
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Invoice Count */}
      <div className="invoice-count">
        <span>{filteredInvoices.length} invoices</span>
      </div>

      {/* Invoices List */}
      <div className="invoices-list">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="invoice-card">
            {/* Invoice Header */}
            <div className="invoice-header">
              <div className="invoice-avatar">
                <span>{getInitials(invoice.client)}</span>
              </div>
              <div className="invoice-details">
                <div className="invoice-amount2">
                    <h3 className="invoice-title6">{invoice.title}</h3>
                <span className="amount7">{formatCurrency(invoice.amount)}</span>

              </div>
              
                
                <p className="invoice-client">{invoice.client}</p>
                <p className="invoice-date">{formatDate(invoice.date)}</p>
              </div>
              
            </div>
            
            {/* Invoice Footer */}
            <div className="invoice-footer">
              <span className={`status ${getStatusClass(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
              
              <div className="invoice-actions">
                <button 
                  className="action-btn"
                  onClick={() => handleView(invoice.id)}
                  title="View Invoice"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
                
                <button 
                  className="action-btn"
                  onClick={() => handleDownload(invoice.id)}
                  title="Download Invoice"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </button>
                
                <button 
                  className="action-btn"
                  onClick={() => handleEdit(invoice.id)}
                  title="Edit Invoice"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>

                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(invoice.id)}
                  title="Delete Invoice"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredInvoices.length === 0 && (
          <div className="no-invoices">
            <p>No invoices found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;