import{ useEffect, useState } from 'react';
 
import useEmployeeHistory from './../../../hooks/useEmployeeHistory';
import { PayrollEntry } from '../../../../domain/entities/EmployeeHistoryEntities';
import PayrollEntryDetailsModal from '../../../components/PayrollEntryDetailsModal';
import { Loader2, TrendingUp, CheckCircle, Clock, XCircle, DollarSign, FileText, Eye } from 'lucide-react';

const EmployeeHistoryPage = () => {
    const token = localStorage.getItem('token');
    const { history, loading, error, getHistory, getDetails, details } = useEmployeeHistory(token);
    
    const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    const handleViewDetails = (entry: PayrollEntry) => {
        setSelectedEntry(entry);
        getDetails(entry.entry_id);
    };

    const handleCloseModal = () => {
        setSelectedEntry(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'SCHEDULED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'FAILED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4" />;
            case 'SCHEDULED':
                return <Clock className="w-4 h-4" />;
            case 'FAILED':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (loading && !history) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 w-full">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your payroll history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm max-w-md text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => getHistory()} 
                        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!history) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm max-w-md text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No History Found</h2>
                    <p className="text-gray-600">You don't have any payroll entries yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 p-6">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Payroll History</h1>
                    <p className="text-gray-600 text-sm">Track and manage your payment records</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Statistics */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Total Entries Card */}
                        <div className="bg-indigo-600 rounded-lg p-6 text-white shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider">Total Entries</span>
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <p className="text-5xl font-bold">{history.payroll_statistics.total_entries}</p>
                        </div>

                        {/* Payment Statistics */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-base font-bold text-gray-900">Payment Statistics</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-gray-700 font-medium">Completed</span>
                                    </div>
                                    <strong className="text-green-700 text-lg">{history.payroll_statistics.completed_payments}</strong>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-gray-700 font-medium">Scheduled</span>
                                    </div>
                                    <strong className="text-blue-700 text-lg">{history.payroll_statistics.scheduled_payments}</strong>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-gray-700 font-medium">Failed</span>
                                    </div>
                                    <strong className="text-red-700 text-lg">{history.payroll_statistics.failed_payments}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-base font-bold text-gray-900">Financial Summary</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="p-4 bg-green-50 rounded border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-xs text-gray-600 font-medium">Total Paid</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">
                                        ${history.payroll_statistics.total_paid_usd.toFixed(2)}
                                    </p>
                                </div>

                                <div className="p-4 bg-amber-50 rounded border border-amber-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                        <span className="text-xs text-gray-600 font-medium">Total Pending</span>
                                    </div>
                                    <p className="text-2xl font-bold text-amber-700">
                                        ${history.payroll_statistics.total_pending_usd.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Payroll Entries Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">Payroll Entries</h2>
                                <p className="text-gray-600 text-xs mt-0.5">All your payment transactions</p>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                Entry ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {history.payroll_entries.map((entry: PayrollEntry) => (
                                            <tr key={entry.entry_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-xs font-mono text-gray-900">
                                                        {entry.entry_id}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {entry.amount}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                            {entry.cryptocurrency}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full border ${getStatusColor(entry.status)}`}>
                                                        {getStatusIcon(entry.status)}
                                                        {entry.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    <button 
                                                        onClick={() => handleViewDetails(entry)} 
                                                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors hover:bg-indigo-50 px-3 py-1.5 rounded"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {history.payroll_entries.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">No payroll entries found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedEntry && (
                <PayrollEntryDetailsModal details={details} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default EmployeeHistoryPage;