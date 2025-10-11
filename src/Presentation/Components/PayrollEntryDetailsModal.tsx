import React from 'react';
import { EmployeeHistoryDetails } from '../../domain/entities/EmployeeHistoryEntities';
import { X, Hash, DollarSign, CreditCard, Calendar, FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface PayrollEntryDetailsModalProps {
    details: EmployeeHistoryDetails | null;
    onClose: () => void;
}

const PayrollEntryDetailsModal: React.FC<PayrollEntryDetailsModalProps> = ({ details, onClose }) => {
    const handleDownloadPDF = () => {
        if (!details) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 20;

        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Payroll Entry Details', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 15;
        
        // Add a line
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;

        // Entry Information Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Entry Information', 20, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const entryInfo = [
            ['Entry ID:', details.payroll_entry.entry_id],
            ['Status:', details.payroll_entry.status],
            ['Amount:', `${details.payroll_entry.amount} ${details.payroll_entry.cryptocurrency}`],
            ['USD Equivalent:', `$${details.payroll_entry.usd_equivalent.toFixed(2)}`],
            ['Date:', new Date(details.payroll_entry.created_at).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })]
        ];

        entryInfo.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, 20, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(String(value), 70, yPosition);
            yPosition += 7;
        });

        // Transaction Details Section
        if (details.transaction_details) {
            yPosition += 5;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Transaction Details', 20, yPosition);
            yPosition += 8;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            const hash = details.transaction_details.hash || 'N/A';
            const gasFee = details.transaction_details.gas_fee || 'N/A';
            const status = details.transaction_details.status || 'N/A';

            // Transaction Hash
            doc.setFont('helvetica', 'bold');
            doc.text('Transaction Hash:', 20, yPosition);
            doc.setFont('helvetica', 'normal');
            const hashStr = String(hash);
            if (hashStr.length > 50) {
                const splitText = doc.splitTextToSize(hashStr, pageWidth - 90);
                doc.text(splitText, 70, yPosition);
                yPosition += splitText.length * 5;
            } else {
                doc.text(hashStr, 70, yPosition);
                yPosition += 7;
            }

            // Gas Fee
            doc.setFont('helvetica', 'bold');
            doc.text('Gas Fee:', 20, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(String(gasFee), 70, yPosition);
            yPosition += 7;

            // Status
            doc.setFont('helvetica', 'bold');
            doc.text('Status:', 20, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(String(status), 70, yPosition);
            yPosition += 7;
        }

        // Payslip Section
        if (details.payslip) {
            yPosition += 5;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Payslip', 20, yPosition);
            yPosition += 8;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 255);
            doc.text('Payslip URL:', 20, yPosition);
            const splitUrl = doc.splitTextToSize(details.payslip.file_url, pageWidth - 30);
            doc.text(splitUrl, 20, yPosition + 5);
            doc.setTextColor(0, 0, 0);
        }

        // Footer
        yPosition = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });

        // Save the PDF
        doc.save(`Payroll_Entry_${details.payroll_entry.entry_id}.pdf`);
    };
    
    if (!details) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-md">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                    <p className="text-center text-gray-600 mt-4">Loading details...</p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
            COMPLETED: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                icon: <CheckCircle className="w-4 h-4" />
            },
            SCHEDULED: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                icon: <Clock className="w-4 h-4" />
            },
            PENDING: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                icon: <Clock className="w-4 h-4" />
            },
            FAILED: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                icon: <AlertCircle className="w-4 h-4" />
            }
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        
        return (
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                {config.icon}
                {status}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div 
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
                    onClick={onClose}
                ></div>

                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Payroll Entry Details
                                    </h3>
                                    <p className="text-indigo-100 text-sm">Complete transaction information</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-900">Entry Information</h4>
                                {getStatusBadge(details.payroll_entry.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Hash className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-600">Entry ID</span>
                                    </div>
                                    <p className="text-sm font-mono text-gray-900 break-all">
                                        {details.payroll_entry.entry_id}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-600">Date</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(details.payroll_entry.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-medium text-indigo-700">Amount</span>
                                    </div>
                                    <p className="text-lg font-bold text-indigo-900">
                                        {details.payroll_entry.amount} {details.payroll_entry.cryptocurrency}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-xs font-medium text-green-700">USD Equivalent</span>
                                    </div>
                                    <p className="text-lg font-bold text-green-900">
                                        ${details.payroll_entry.usd_equivalent.toFixed(2)}
                                    </p>
                                </div>

                                
                            </div>
                        </div>

                        {details.transaction_details && (
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Transaction Details</h4>
                                
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Hash className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs font-medium text-gray-600">Transaction Hash</span>
                                        </div>
                                        <p className="text-sm font-mono text-gray-900 break-all">
                                            {details.transaction_details.hash}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="w-4 h-4 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600">Gas Fee</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {details.transaction_details.gas_fee}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600">Status</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {details.transaction_details.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {details.payslip && (
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Payslip</h4>
                                <a
                                    href={details.payslip.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span>View Payslip</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleDownloadPDF}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollEntryDetailsModal;