import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface IncomeItem {
  name: string;
  amount: number;
}

interface IncomeStatementData {
  revenue: IncomeItem[];
  expenses: IncomeItem[];
  net_income: number;
  total_revenue: number;
  total_expenses: number;
}

const Income: React.FC = () => {
  const navigate = useNavigate();
  
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');

  useEffect(() => {
    generateIncomeStatement();
  }, []);

  const generateIncomeStatement = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL ;
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/portfolio/value/?currency=USD`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error(`Server returned HTML error page (${response.status}). Portfolio endpoint may not be available.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch portfolio data`);
      }

      const portfolioValue = data.total_value || 0;
      
      const incomeStatementData: IncomeStatementData = {
        revenue: portfolioValue > 0 ? [
          { name: 'Portfolio Value', amount: portfolioValue }
        ] : [
          { name: 'No revenue data available', amount: 0 }
        ],
        expenses: [
          { name: 'No expense data available', amount: 0 }
        ],
        total_revenue: portfolioValue,
        total_expenses: 0,
        net_income: portfolioValue
      };
      
      setIncomeStatement(incomeStatementData);
    } catch (err: any) {
      console.error('Income statement generation error:', err);
      setError(err.message || 'Failed to generate income statement');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!incomeStatement) {
      setError('No income statement data to export');
      return;
    }

    try {
      // Prepare data for Excel export
      const excelData = [
        ['INCOME STATEMENT'],
        [`As of: ${new Date().toISOString().split('T')[0]}`],
        [''],
        ['REVENUE', ''],
        ...incomeStatement.revenue.map(item => [item.name, item.amount]),
        ['Total Revenue', incomeStatement.total_revenue],
        [''],
        ['EXPENSES', ''],
        ...incomeStatement.expenses.map(item => [item.name, item.amount]),
        ['Total Expenses', incomeStatement.total_expenses],
        [''],
        ['NET INCOME', incomeStatement.net_income]
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
      XLSX.utils.book_append_sheet(wb, ws, 'Income Statement');

      // Generate Excel file and save
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `IncomeStatement_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {
      setError(err.message || 'Failed to export to Excel');
      console.error('Excel export error:', err);
    }
  };

  const chartData = incomeStatement ? [
    { 
      name: 'Revenue', 
      value: incomeStatement.total_revenue,
      fill: '#8884d8'
    },
    { 
      name: 'Expenses', 
      value: incomeStatement.total_expenses,
      fill: '#82ca9d'
    },
    { 
      name: 'Net Income', 
      value: incomeStatement.net_income,
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
    await generateIncomeStatement();
  };

  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h4>
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
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_revenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_expenses || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Net Income</span>
              <span className="font-semibold text-gray-900">{formatCurrency(incomeStatement?.net_income || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Profit Margin</span>
              <span className="font-bold text-lg text-gray-900">
                {incomeStatement?.total_revenue ? 
                  `${((incomeStatement.net_income / incomeStatement.total_revenue) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Income Statement Summary</h4>
        {incomeStatement ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your income statement shows total revenue of <strong>{formatCurrency(incomeStatement.total_revenue)}</strong> 
              with a net income of <strong>{formatCurrency(incomeStatement.net_income)}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The company has <strong>{formatCurrency(incomeStatement.total_expenses)}</strong> in total expenses 
              and a profit margin of <strong>{incomeStatement.total_revenue ? 
                `${((incomeStatement.net_income / incomeStatement.total_revenue) * 100).toFixed(1)}%` : 
                '0%'
              }</strong>.
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
            Loading income statement data...
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

      {/* Simple Income Statement Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Revenue Section */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">REVENUE</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_revenue || 0)}</td>
            </tr>
            
            {incomeStatement?.revenue.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Expenses Section */}
            <tr className="bg-red-50">
              <td className="px-6 py-4 font-semibold text-gray-900">EXPENSES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_expenses || 0)}</td>
            </tr>
            
            {incomeStatement?.expenses.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Net Income */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">NET INCOME</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(incomeStatement?.net_income || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Income statement generated successfully</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="income-statement-container w-full min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            ← Back to Reports
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
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Income Statement</h1>
        <p className="text-gray-600">
          Monthly Report | {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading income statement...</p>
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

export default Income;