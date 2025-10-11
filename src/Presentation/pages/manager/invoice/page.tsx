import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, Clock, AlertCircle, Plus, SearchIcon } from 'lucide-react';
import ManagerNavbar from '../../../components/ManagerNavbar';

import { useInvoices } from '../../../hooks/useInvoices';
import { Invoice } from '../../../../domain/entities/InvoiceEntities';
import InvoiceDetailsPage from './InvoiceDetails/page';
import InputWithIcon from '../../../components/InputWithIcon';

const ManagerInvoicePage: React.FC = () => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const { invoices, loading, error, reloadInvoices } = useInvoices(user?.id);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [displayedInvoices, setDisplayedInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const handleViewDetails = (invoice_id: string) => {
    setSelectedInvoiceId(invoice_id);
  };

  const handleCloseModal = () => {
    setSelectedInvoiceId(null);
  };

  useEffect(() => {
    reloadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally omit reloadInvoices from deps to avoid loop

  useEffect(() => {
    if (!invoices) return;

    if (searchTerm) {
      const filtered = invoices.filter(invoice =>
        (invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice._id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setDisplayedInvoices(filtered);
    } else {
      setDisplayedInvoices(invoices);
    }
  }, [invoices, searchTerm]);

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

  const handleCreateInvoice = () => {
    // Placeholder for navigation or modal trigger
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200">
          <div className="flex flex-col items-center justify-center p-16 min-h-[400px] text-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-purple-500 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-500 text-base font-medium">Loading invoices...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200">
          <div className="flex flex-col items-center justify-center p-16 min-h-[400px] text-center">
            <AlertCircle size={48} className="text-red-500 mb-6" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Something went wrong</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md">Error: {error}</p>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none px-6 py-3 rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline focus:outline-2 focus:outline-purple-500 focus:outline-offset-2"
              onClick={reloadInvoices}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-hidden">


        {/* Search */}
        <div className="mb-6">
          <div className="flex-1">
            <InputWithIcon
              icon={<SearchIcon />}
              placeholder="Search invoice..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice List */}
        <div >
          {displayedInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center min-h-[300px] text-gray-500">
              <div className="mb-6 text-gray-300">
                <FileText size={64} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                {searchTerm ? 'No matching invoices found' : 'No invoices yet'}
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed">
                {searchTerm
                  ? `No invoices match your search for "${searchTerm}". Try adjusting your search terms.`
                  : 'Create your first invoice to get started with managing your billing and payments.'
                }
              </p>
              {!searchTerm && (
                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none px-6 py-3 rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline focus:outline-2 focus:outline-purple-500 focus:outline-offset-2"
                  onClick={handleCreateInvoice}
                >
                  <Plus size={18} />
                  Create First Invoice
                </button>
              )}
            </div>
          ) : (
            displayedInvoices.map((invoice: Invoice) => (
              <div
                key={invoice._id}
                className="relative border-2 border-gray-100 rounded-2xl p-6 mb-4 bg-white cursor-pointer transition-all hover:border-indigo-100 hover:shadow-2xl hover:-translate-y-0.5 focus:outline focus:outline-2 focus:outline-purple-500 focus:outline-offset-[-2px] animate-fadeIn before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:to-indigo-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                tabIndex={0}
              >
                <div className="flex justify-between items-start mb-5 gap-6 sm:flex-col sm:gap-4 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 m-0 mb-3 leading-tight break-words sm:text-base hover:text-purple-500 transition-colors">
                      {invoice.client_name || `Client for Invoice ${invoice.invoice_id}`}
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] text-purple-500 font-semibold uppercase tracking-wide">{invoice.invoice_id}</span>
                      <span className="text-[13px] text-gray-500 font-medium">Created: {formatDate(invoice.createdAt)}</span>
                      {invoice.description && (
                        <p className="text-[13px] text-gray-400 font-normal m-0 mt-1 leading-relaxed">{invoice.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-start sm:justify-between sm:w-full">
                    <div className="text-xl font-extrabold text-gray-900 tracking-tight sm:text-lg hover:text-purple-500 transition-colors">
                      {formatAmount(invoice.total_amount, invoice.currency)}
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${invoice.status === 'paid' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300' : invoice.status === 'pending' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-400' : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300'}`}>
                      <span className={`status-icon ${invoice.status === 'paid' ? 'text-green-500' : invoice.status === 'pending' ? 'text-amber-500' : 'text-red-500'}`}>
                        {getStatusIcon(invoice.status)}
                      </span>
                      <span>{invoice.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none px-5 py-2.5 rounded-lg text-[13px] font-semibold uppercase tracking-wide hover:from-purple-600 hover:to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline focus:outline-2 focus:outline-purple-500 focus:outline-offset-2 sm:w-full sm:mt-3 sm:py-3"
                  onClick={() => handleViewDetails(invoice._id)}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <ManagerNavbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
          <p className="text-sm text-gray-500">Manage and track all your invoices in one place.</p>
        </div>

        <div className="flex flex-col w-full font-sans gap-6 md:p-0 sm:p-0">
          {renderContent()}
        </div>
      </div>

      {selectedInvoiceId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <InvoiceDetailsPage invoiceId={selectedInvoiceId} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerInvoicePage;