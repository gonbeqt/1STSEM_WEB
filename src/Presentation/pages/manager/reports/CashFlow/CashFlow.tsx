import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

 

interface CashFlowSection {
  cash_receipts: Record<string, number> & { total: number };
  cash_payments: Record<string, number> & { total: number };
  net_cash_flow: number;
}

interface CashFlowData {
  operating_activities: CashFlowSection;
  investing_activities: CashFlowSection;
  financing_activities: CashFlowSection;
  cash_summary: {
    beginning_cash: number;
    ending_cash: number;
    net_change_in_cash: number;
  };
}

const CashFlow: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [cashFlowData, setCashFlowData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateCashFlowStatement();
  }, []);

  const generateCashFlowStatement = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL;
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cash-flow/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cash flow statement');
      }

      if (data.success) {
        setCashFlowData(data.cash_flow_statement);
      } else {
        throw new Error(data.error || 'Failed to generate cash flow statement');
      }
    } catch (err: any) {
      console.error('Cash flow generation error:', err);
      setError(err.message || 'Failed to load cash flow statement');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!cashFlowData) {
      setError('No cash flow data to export');
      return;
    }

    try {
      // Prepare data for Excel export
      const excelData = [
        ['CASH FLOW STATEMENT'],
        [`As of: ${new Date().toISOString().split('T')[0]}`],
        [''],
        ['OPERATING ACTIVITIES', ''],
        ['Cash Receipts', cashFlowData.operating_activities.cash_receipts.total],
        ['Cash Payments', -cashFlowData.operating_activities.cash_payments.total],
        ['Net Cash from Operating', cashFlowData.operating_activities.net_cash_flow],
        [''],
        ['INVESTING ACTIVITIES', ''],
        ['Cash Receipts', cashFlowData.investing_activities.cash_receipts.total],
        ['Cash Payments', -cashFlowData.investing_activities.cash_payments.total],
        ['Net Cash from Investing', cashFlowData.investing_activities.net_cash_flow],
        [''],
        ['FINANCING ACTIVITIES', ''],
        ['Cash Receipts', cashFlowData.financing_activities.cash_receipts.total],
        ['Cash Payments', -cashFlowData.financing_activities.cash_payments.total],
        ['Net Cash from Financing', cashFlowData.financing_activities.net_cash_flow],
        [''],
        ['CASH SUMMARY', ''],
        ['Beginning Cash', cashFlowData.cash_summary.beginning_cash],
        ['Net Change in Cash', cashFlowData.cash_summary.net_change_in_cash],
        ['Ending Cash', cashFlowData.cash_summary.ending_cash]
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 30 }, // Account column
        { wch: 15 }  // Amount column
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Cash Flow');

      // Generate Excel file and save
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `CashFlow_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {
      setError(err.message || 'Failed to export to Excel');
      console.error('Excel export error:', err);
    }
  };

  const chartData = cashFlowData ? [
    { 
      name: 'Operating', 
      value: cashFlowData.operating_activities.net_cash_flow,
      fill: '#8884d8'
    },
    { 
      name: 'Investing', 
      value: cashFlowData.investing_activities.net_cash_flow,
      fill: '#82ca9d'
    },
    { 
      name: 'Financing', 
      value: cashFlowData.financing_activities.net_cash_flow,
      fill: '#ffc658'
    }
  ] : [];

  const formatCurrency = (amount: number): string => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const clearError = () => {
    setError(null);
  };

  const handleExportExcel = () => {
    try {
      exportToExcel();
    } catch (error) {
      console.error('Failed to export to Excel:', error);
    }
  };

  const handleRefresh = async () => {
    await generateCashFlowStatement();
  };

  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Operating Activities</span>
              <span className="font-semibold text-gray-900">{formatCurrency(cashFlowData?.operating_activities?.net_cash_flow || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Investing Activities</span>
              <span className="font-semibold text-gray-900">{formatCurrency(cashFlowData?.investing_activities?.net_cash_flow || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Financing Activities</span>
              <span className="font-semibold text-gray-900">{formatCurrency(cashFlowData?.financing_activities?.net_cash_flow || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Net Change in Cash</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(cashFlowData?.cash_summary?.net_change_in_cash || 0)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Summary</h4>
        {cashFlowData ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your cash flow shows a net change of <strong>{formatCurrency(cashFlowData.cash_summary.net_change_in_cash)}</strong> 
              with ending cash of <strong>{formatCurrency(cashFlowData.cash_summary.ending_cash)}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Operating activities generated <strong>{formatCurrency(cashFlowData.operating_activities.net_cash_flow)}</strong> 
              while investing and financing activities resulted in <strong>{formatCurrency(cashFlowData.investing_activities.net_cash_flow)}</strong> and <strong>{formatCurrency(cashFlowData.financing_activities.net_cash_flow)}</strong> respectively.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                className="py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all flex items-center gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                className="py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all flex items-center gap-2"
                onClick={handleExportExcel}
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Loading cash flow data...
          </p>
        )}
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          onClick={handleExportExcel} 
          disabled={loading}
        >
          Export to Excel
        </button>
        <button 
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      {/* Simple Cash Flow Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Operating Activities */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">OPERATING ACTIVITIES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(cashFlowData?.operating_activities?.net_cash_flow || 0)}</td>
            </tr>
            
            {/* Investing Activities */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">INVESTING ACTIVITIES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(cashFlowData?.investing_activities?.net_cash_flow || 0)}</td>
            </tr>
            
            {/* Financing Activities */}
            <tr className="bg-purple-50">
              <td className="px-6 py-4 font-semibold text-gray-900">FINANCING ACTIVITIES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(cashFlowData?.financing_activities?.net_cash_flow || 0)}</td>
            </tr>
            
            {/* Cash Summary */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-6 py-4 font-bold text-gray-900">BEGINNING CASH</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(cashFlowData?.cash_summary?.beginning_cash || 0)}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="px-6 py-4 font-bold text-gray-900">NET CHANGE IN CASH</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(cashFlowData?.cash_summary?.net_change_in_cash || 0)}</td>
            </tr>
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-6 py-4 font-bold text-gray-900">ENDING CASH</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(cashFlowData?.cash_summary?.ending_cash || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Cash flow statement generated successfully</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cash-flow-container w-full min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Reports</span>
          </button>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === 'table' 
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('table')}
            >
              Table View
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === 'chart' 
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('chart')}
            >
              Chart View
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cash Flow Statement</h1>
        <p className="text-gray-600">
          Daily Report | {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cash flow statement...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            Error: {error}
            <button className="ml-4 text-red-800 underline" onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {!loading && !error && (activeView === 'chart' ? renderChartView() : renderTableView())}
      </div>
    </div>
  );
};

export default CashFlow;