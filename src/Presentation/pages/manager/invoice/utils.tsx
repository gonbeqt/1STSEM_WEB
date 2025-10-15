import React from 'react';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { Invoice } from '../../../../domain/entities/InvoiceEntities';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | string;

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount ?? 0);
  } catch {
    // Fallback if currency code is invalid or not supported
    return `${currency} ${Number(amount ?? 0).toFixed(2)}`;
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusIcon = (status: InvoiceStatus) => {
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

export const getStatusBadgeClass = (status: InvoiceStatus): string => {
  if (status === 'paid') return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300';
  if (status === 'pending') return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-400';
  if (status === 'overdue') return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300';
  return 'bg-gray-100 text-gray-800 border border-gray-300';
};

export const getStatusIconColorClass = (status: InvoiceStatus): string => {
  if (status === 'paid') return 'text-green-500';
  if (status === 'pending') return 'text-amber-500';
  if (status === 'overdue') return 'text-red-500';
  return 'text-gray-500';
};

export interface DisplayInvoice {
  id: string;
  invoiceId: string;
  clientName: string;
  createdAt: string;
  totalAmountFormatted: string;
  currency: string;
  status: string;
  description?: string;
}

export const mapInvoiceToDisplay = (invoice: Invoice): DisplayInvoice => ({
  id: invoice._id,
  invoiceId: invoice.invoice_id || invoice.invoice_number || '',
  clientName: invoice.client_name || `Client for Invoice ${invoice.invoice_id || invoice.invoice_number || ''}`,
  createdAt: formatDate(invoice.created_at),
  totalAmountFormatted: formatCurrency(invoice.total_amount, invoice.currency),
  currency: invoice.currency,
  status: invoice.status,
  description: invoice.description,
});

export const filterInvoices = (invoices: Invoice[] | undefined, searchTerm: string): Invoice[] => {
  if (!invoices) return [];
  const term = searchTerm.trim().toLowerCase();
  if (!term) return invoices;
  return invoices.filter((invoice) =>
    (invoice.client_name?.toLowerCase().includes(term)) ||
    (invoice._id?.toLowerCase().includes(term)) ||
    (invoice.description?.toLowerCase().includes(term)) ||
    (invoice.invoice_id?.toLowerCase().includes(term)) ||
    (invoice.invoice_number?.toLowerCase().includes(term))
  );
};
