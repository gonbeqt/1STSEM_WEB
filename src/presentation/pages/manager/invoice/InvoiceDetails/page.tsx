import React, { useEffect, useState } from "react";
import { Invoice, InvoiceItem } from "../../../../../domain/entities/InvoiceEntities";
import { container } from "../../../../../di/container";
import { X, CheckCircle, AlertCircle, Clock } from "lucide-react";
import jsPDF from "jspdf";

interface InvoiceDetailsProps {
  invoiceId: string;
  onClose: () => void;
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

  const handleDownloadPDF = () => {
    if (!invoice) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Invoice #${invoice.invoice_number || invoice._id}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Issued: ${new Date(invoice.createdAt).toLocaleDateString()}`, 14, 30);
    doc.text(`Status: ${invoice.status}`, 14, 40);

    doc.text("Bill To:", 14, 55);
    doc.text(`${invoice.client_name}`, 14, 62);
    if (invoice.client_address) doc.text(invoice.client_address, 14, 68);
    if (invoice.client_email) doc.text(invoice.client_email, 14, 74);

    doc.text("From:", 105, 55);
    doc.text("Your Company", 105, 62);
    doc.text("123 Business St, City, Country", 105, 68);
    doc.text("support@yourcompany.com", 105, 74);

    let yPos = 95;
    doc.setFontSize(12);
    doc.text("Description", 14, yPos);
    doc.text("Qty", 90, yPos);
    doc.text("Rate", 120, yPos);
    doc.text("Amount", 160, yPos);

    yPos += 8;
    invoice.items?.forEach((item: InvoiceItem) => {
      doc.text(item.description, 14, yPos);
      doc.text(String(item.quantity), 90, yPos);
      doc.text(`${item.unit_price} ${invoice.currency}`, 120, yPos);
      doc.text(`${item.total_price} ${invoice.currency}`, 160, yPos);
      yPos += 8;
    });

    yPos += 10;
    if (invoice.tax_rate !== undefined) {
      doc.text(`Tax (${(invoice.tax_rate || 0) * 100}%): ${((invoice.total_amount || 0) * (invoice.tax_rate || 0)).toFixed(2)} ${invoice.currency}`, 120, yPos);
      yPos += 8;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${invoice.total_amount} ${invoice.currency}`, 120, yPos);
    doc.setFont("helvetica", "normal");

    if (invoice.notes) {
      yPos += 15;
      doc.text("Notes:", 14, yPos);
      doc.text(invoice.notes, 14, yPos + 8, { maxWidth: 180 });
    }

    doc.save(`invoice-${invoice.invoice_number || invoice._id}.pdf`);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid": return "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold capitalize bg-green-50 text-green-700";
      case "pending": return "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold capitalize bg-yellow-50 text-yellow-800";
      case "overdue": return "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold capitalize bg-red-50 text-red-800";
      default: return "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold capitalize";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle size={16} />;
      case "pending": return <Clock size={16} />;
      case "overdue": return <AlertCircle size={16} />;
      default: return null;
    }
  };

  const formatAmount = (total_amount: number, currency: string = 'USD'): string => {
    if (!total_amount || isNaN(total_amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(total_amount);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
        <div className="bg-white rounded-2xl p-6 w-[90%] max-w-[720px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-purple-500 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-500 text-base font-medium">Loading invoice details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
        <div className="bg-white rounded-2xl p-6 w-[90%] max-w-[720px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <AlertCircle size={48} className="text-red-500 mb-6" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Something went wrong</h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button 
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
        <div className="bg-white rounded-2xl p-6 w-[90%] max-w-[720px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-gray-500 text-sm mb-6">No invoice details available.</p>
            <button 
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-[720px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn text-gray-900">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="mb-1">
              <h2 className="text-xl font-bold mb-1">Invoice #{invoice.invoice_number || invoice._id}</h2>
              <p className="text-gray-500 text-sm">Issued {new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <div className={getStatusClass(invoice.status)}>
              {getStatusIcon(invoice.status)}
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          {/* Parties */}
          <div className="flex justify-between gap-8 mb-6">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Bill To</h3>
              <p className="font-semibold mb-1">{invoice.client_name}</p>
              {invoice.client_address && <p className="text-sm text-gray-600">{invoice.client_address}</p>}
              {invoice.client_email && <p className="text-sm text-gray-600">{invoice.client_email}</p>}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">From</h3>
              <p className="font-semibold mb-1">Your Company</p>
              <p className="text-sm text-gray-600">123 Business St, City, Country</p>
              <p className="text-sm text-gray-600">support@yourcompany.com</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] p-4 bg-gray-50 font-semibold text-sm text-gray-700">
                <div>Description</div>
                <div>Qty</div>
                <div>Rate</div>
                <div>Amount</div>
              </div>
              <div>
                {invoice.items?.map((item: InvoiceItem, index: number) => (
                  <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr] p-4 border-t border-gray-200 text-sm">
                    <div>{item.description}</div>
                    <div>{item.quantity}</div>
                    <div>{formatAmount(item.unit_price || 0, invoice.currency)}</div>
                    <div>{formatAmount(item.total_price || 0, invoice.currency)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-6">
            <div className="w-[280px]">
              {invoice.tax_rate !== undefined && (
                <div className="flex justify-between py-1.5 text-sm">
                  <span>Tax ({(invoice.tax_rate || 0) * 100}%)</span>
                  <span>{((invoice.total_amount || 0) * (invoice.tax_rate || 0)).toFixed(2)} {invoice.currency}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 text-sm font-bold border-t border-gray-200 mt-2 pt-2">
                <span>Total</span>
                <span>{invoice.total_amount} {invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button 
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors" 
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity" 
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;