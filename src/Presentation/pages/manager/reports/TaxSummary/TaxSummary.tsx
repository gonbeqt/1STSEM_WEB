import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ArrowLeft, Download } from 'lucide-react';
import { useTaxSummaryViewModel } from '../../../../hooks/useTaxSummaryViewModel';
import { TaxReport } from '../../../../../domain/viewmodel/TaxSummaryViewModel';

const TaxSummary: React.FC = observer(() => {
  const navigate = useNavigate();
  const taxSummaryViewModel = useTaxSummaryViewModel();
  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');

  // Load tax reports on component mount
  useEffect(() => {
    taxSummaryViewModel.fetchAll();
  }, []);

  const handleRefresh = async () => {
    await taxSummaryViewModel.fetchAll();
  };

  // Chart data from real tax data only
  const chartData = taxSummaryViewModel.selectedReport ? [
    { 
      name: 'Gains', 
      value: Math.abs(taxSummaryViewModel.selectedReport.total_gains || 0),
      fill: '#10b981'
    },
    { 
      name: 'Losses', 
      value: Math.abs(taxSummaryViewModel.selectedReport.total_losses || 0),
      fill: '#ef4444'
    },
    { 
      name: 'Net P&L', 
      value: Math.abs(taxSummaryViewModel.selectedReport.net_pnl || 0),
      fill: '#3b82f6'
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

  const exportToExcel = () => {
    if (!taxSummaryViewModel.selectedReport) {
      taxSummaryViewModel.lastError = 'No tax data to export';
      return;
    }
    
    const selectedReport = taxSummaryViewModel.selectedReport;

    try {
      // Prepare data for Excel export
      const excelData = [
        ['TAX REPORT SUMMARY'],
        ['Report Type', selectedReport.report_type],
        ['Period', `${new Date(selectedReport.start_date).toLocaleDateString()} - ${new Date(selectedReport.end_date).toLocaleDateString()}`],
        [`Generated: ${new Date(selectedReport.generated_at).toLocaleDateString()}`],
        [''],
        ['FINANCIAL SUMMARY', ''],
        ['Total Gains', selectedReport.total_gains || 0],
        ['Total Losses', selectedReport.total_losses || 0],
        ['Net P&L', selectedReport.net_pnl || 0],
        ['Total Income', selectedReport.total_income || 0],
        ['Total Expenses', selectedReport.total_expenses || 0],
        [''],
        ['TAX DEDUCTION SUMMARY', ''],
        ['Gross Amount', selectedReport.tax_deduction_summary?.period_summary?.total_gross_amount || 0],
        ['Total Deductions', selectedReport.tax_deduction_summary?.period_summary?.total_deductions?.income_tax || 0],
        ['Tax Amount', selectedReport.tax_deduction_summary?.period_summary?.total_tax_amount || 0],
        ['Net Amount', selectedReport.tax_deduction_summary?.period_summary?.net_amount || 0],
        [''],
        ['TRANSACTION INFO', ''],
        ['Transaction Count', selectedReport.metadata?.transaction_count || 0],
        ['Accounting Method', selectedReport.metadata?.accounting_method || 'N/A'],
        ['Tax Year', selectedReport.metadata?.tax_year || new Date().getFullYear()]
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Format currency columns
      for (let i = 0; i < excelData.length; i++) {
        if (typeof excelData[i][1] === 'number') {
          const cellRef = `B${i + 1}`;
          if (!ws[cellRef]) {
            ws[cellRef] = { t: 'n', v: excelData[i][1] };
          }
          ws[cellRef].z = '"$"#,##0.00;[Red]"$"#,##0.00';
        }
      }

      // Set column widths
      ws['!cols'] = [
        { wch: 30 }, // Metric column
        { wch: 20 }  // Value column
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Tax Report');

      // Generate Excel file and save
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `TaxReport_${selectedReport.report_type}_${new Date(selectedReport.generated_at).toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {
      taxSummaryViewModel.lastError = err.message || 'Failed to export to Excel';
      console.error('Excel export error:', err);
    }
  };

  const handleExportExcel = () => {
    try {
      exportToExcel();
    } catch (error) {
      console.error('Failed to export to Excel:', error);
    }
  };


  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Tax Overview</h4>
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
              <span className="text-gray-600">Capital Gains</span>
              <span className="font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.total_gains || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Capital Losses</span>
              <span className="font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.total_losses || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Net P&L</span>
              <span className="font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.net_pnl || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Report Type</span>
              <span className="font-bold text-lg text-gray-900">{taxSummaryViewModel.selectedReport?.report_type || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tax Summary</h4>
        {taxSummaryViewModel.selectedReport ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Tax report for <strong>{taxSummaryViewModel.selectedReport.report_type}</strong> period from <strong>{new Date(taxSummaryViewModel.selectedReport.start_date).toLocaleDateString()}</strong> to <strong>{new Date(taxSummaryViewModel.selectedReport.end_date).toLocaleDateString()}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Capital gains of <strong>{formatCurrency(taxSummaryViewModel.selectedReport.total_gains)}</strong> 
              and capital losses of <strong>{formatCurrency(taxSummaryViewModel.selectedReport.total_losses)}</strong> with a net P&L of <strong>{formatCurrency(taxSummaryViewModel.selectedReport.net_pnl)}</strong>.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <button className="py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all" onClick={handleExportExcel}>
                📄 Download Report
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Loading tax data...
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
          disabled={taxSummaryViewModel.isLoading}
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

      {/* Simple Tax Summary Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Tax Metrics */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">CAPITAL GAINS</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.total_gains || 0)}</td>
            </tr>
            
            <tr className="bg-red-50">
              <td className="px-6 py-4 font-semibold text-gray-900">CAPITAL LOSSES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.total_losses || 0)}</td>
            </tr>
            
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">NET P&L</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.net_pnl || 0)}</td>
            </tr>
            
            <tr className="bg-purple-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TOTAL INCOME</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.total_income || 0)}</td>
            </tr>
            
            <tr className="bg-yellow-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TOTAL EXPENSES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport?.total_expenses || 0)}</td>
            </tr>

            <tr className="bg-indigo-50">
              <td className="px-6 py-4 font-semibold text-gray-900">REPORT TYPE</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{taxSummaryViewModel.selectedReport?.report_type || 'N/A'}</td>
            </tr>

            <tr className="bg-indigo-50">
              <td className="px-6 py-4 font-semibold text-gray-900">PERIOD</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{taxSummaryViewModel.selectedReport ? `${new Date(taxSummaryViewModel.selectedReport.start_date).toLocaleDateString()} - ${new Date(taxSummaryViewModel.selectedReport.end_date).toLocaleDateString()}` : 'N/A'}</td>
            </tr>

            <tr className="bg-indigo-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TRANSACTIONS</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{taxSummaryViewModel.selectedReport?.metadata?.transaction_count || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Tax Deduction Summary */}
      {taxSummaryViewModel.selectedReport?.tax_deduction_summary && (
        <div className="bg-cyan-50 border border-cyan-300 rounded-lg p-4 mt-4">
          <h4 className="text-base font-semibold text-cyan-900 mb-3">Tax Deduction Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-cyan-700">Gross Amount</p>
              <p className="font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport.tax_deduction_summary?.period_summary?.total_gross_amount || 0)}</p>
            </div>
            <div>
              <p className="text-cyan-700">Total Deductions</p>
              <p className="font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport.tax_deduction_summary?.period_summary?.total_deductions?.income_tax || 0)}</p>
            </div>
            <div>
              <p className="text-cyan-700">Tax Amount</p>
              <p className="font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport.tax_deduction_summary?.period_summary?.total_tax_amount || 0)}</p>
            </div>
            <div>
              <p className="text-cyan-700">Net Amount</p>
              <p className="font-semibold text-gray-900">{formatCurrency(taxSummaryViewModel.selectedReport.tax_deduction_summary?.period_summary?.net_amount || 0)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* LLM Analysis */}
      {taxSummaryViewModel.selectedReport?.llm_analysis && (
        <div className="bg-sky-50 border border-sky-300 rounded-lg p-4 mt-4">
          <h4 className="text-base font-semibold text-sky-900 mb-3">LLM Analysis</h4>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{taxSummaryViewModel.selectedReport.llm_analysis}</p>
        </div>
      )}
      
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Tax summary generated successfully</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tax-summary-container w-full min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports</span>
          </button>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeView === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('table')}
            >
              Table View
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeView === 'chart' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('chart')}
            >
              Chart View
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tax Summary Report</h1>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Report</label>
            <select 
              value={taxSummaryViewModel.selectedReport?._id || ''} 
              onChange={(e) => {
                const reportId = e.target.value;
                const report = toJS(taxSummaryViewModel.items).find(r => r._id === reportId);
                if (report) taxSummaryViewModel.selectReport(report);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select a report --</option>
              {toJS(taxSummaryViewModel.items).map((report) => {
                const date = new Date(report.generated_at);
                const formattedDate = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
                const formattedTime = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });
                return (
                  <option key={report._id} value={report._id}>
                    {report.report_type} - {formattedDate} at {formattedTime} ({report.status})
                  </option>
                );
              })}
            </select>
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mt-6"
            title="Refresh reports"
          >
            Refresh
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          Total reports: {toJS(taxSummaryViewModel.items).length}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {taxSummaryViewModel.isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tax summary...</p>
          </div>
        )}
        
        {taxSummaryViewModel.lastError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            Error: {taxSummaryViewModel.lastError}
            <button className="ml-4 text-red-800 underline" onClick={() => taxSummaryViewModel.clearError()}>Dismiss</button>
          </div>
        )}
        
        {!taxSummaryViewModel.isLoading && !taxSummaryViewModel.lastError && (activeView === 'chart' ? renderChartView() : renderTableView())}
      </div>
    </div>
  );
});

export default TaxSummary;