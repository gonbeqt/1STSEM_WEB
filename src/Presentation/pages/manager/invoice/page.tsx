import React, { useState, useEffect } from 'react';
import { FileText, SearchIcon, AlertCircle } from 'lucide-react';
import ManagerNavbar from '../../../components/ManagerNavbar';

import { useInvoices } from '../../../hooks/useInvoices';
import { Invoice } from '../../../../domain/entities/InvoiceEntities';
import InvoiceDetailsPage from './InvoiceDetails/page';
import InputWithIcon from '../../../components/InputWithIcon';
import Skeleton, { SkeletonText } from '../../../components/Skeleton';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusIcon, filterInvoices, getStatusIconColorClass } from './utils';

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
  }, []);

  useEffect(() => {
    setDisplayedInvoices(filterInvoices(invoices, searchTerm));
  }, [invoices, searchTerm]);

  const handleCreateInvoice = () => {
    // Placeholder for navigation or modal trigger
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="border-2 border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6 mb-4">
                  <div className="flex-1 space-y-3">
                    <SkeletonText className="h-5 w-48" />
                    <SkeletonText className="h-3 w-40" />
                    <SkeletonText className="h-3 w-full" />
                  </div>
                  <div className="flex flex-col gap-3 md:items-end w-full md:w-48">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-7 w-28" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full md:w-40" />
              </div>
            ))}
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
          <div className="w-full">
            <InputWithIcon
              icon={<SearchIcon />}
              placeholder="Search invoice..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="space-y-4">
          {displayedInvoices.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
              <div className="rounded-3xl border border-dashed border-purple-200 bg-purple-50/60 px-10 py-14 text-center flex flex-col items-center gap-4">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-600">
                  <FileText size={36} />
                </span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {searchTerm ? 'No matching invoices found' : 'No invoices yet'}
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  {searchTerm
                    ? `No invoices match your search for “${searchTerm}”. Try broadening your keywords.`
                    : 'Create your first invoice to start tracking your billing and payments with Cryphoria.'}
                </p>
                
              </div>
            </div>
          ) : (
            displayedInvoices.map((invoice: Invoice) => (
              <div
                key={invoice._id}
                className="relative border-2 border-gray-100 rounded-2xl p-6 bg-white cursor-pointer transition-all hover:border-indigo-100 hover:shadow-2xl hover:-translate-y-0.5 focus:outline focus:outline-2 focus:outline-purple-500 focus:outline-offset-[-2px] animate-fadeIn before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:to-indigo-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                tabIndex={0}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-5 gap-4 md:gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 m-0 mb-3 leading-tight break-words sm:text-base hover:text-purple-500 transition-colors">
                      {invoice.client_name || `Client for Invoice ${invoice.invoice_id}`}
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] text-purple-500 font-semibold uppercase tracking-wide">{invoice.invoice_id}</span>
                      <span className="text-[13px] text-gray-500 font-medium">Created: {formatDate(invoice.created_at)}</span>
                      {invoice.description && (
                        <p className="text-[13px] text-gray-400 font-normal m-0 mt-1 leading-relaxed">{invoice.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-3 md:w-auto md:text-right">
                    <div className="text-xl font-extrabold text-gray-900 tracking-tight md:text-lg hover:text-purple-500 transition-colors">
                      {formatCurrency(invoice.total_amount, invoice.currency)}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(invoice.status)}`}>
                      <span className={`status-icon ${getStatusIconColorClass(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                      </span>
                      <span>{invoice.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none px-5 py-3 rounded-lg text-[13px] font-semibold uppercase tracking-wide hover:from-purple-600 hover:to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline focus:outline-2 focus:outline-purple-500 focus:outline-offset-2"
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

      <div className="w-full mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
        </div>

        <div className="flex flex-col w-full font-sans gap-6">
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