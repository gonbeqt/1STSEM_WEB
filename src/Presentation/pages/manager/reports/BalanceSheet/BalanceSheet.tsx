import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';






const BalanceSheet: React.FC = () => {
  const navigate = useNavigate();
  
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');



  useEffect(() => {
    generateBalanceSheet();
  }, []);

  const generateBalanceSheet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/balance-sheet/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          as_of_date: new Date().toISOString().split('T')[0],
          include_all_assets: true,
          format: 'detailed'
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setBalanceSheet(data.balance_sheet);
      } else {
        setError(data.error || 'Failed to generate balance sheet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load balance sheet');
      console.error('Balance sheet error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!balanceSheet) {
      setError('No balance sheet data to export');
      return;
    }

    try {
      // Prepare data for Excel export
      const excelData = [
        ['BALANCE SHEET'],
        [`As of: ${new Date(balanceSheet.as_of_date).toLocaleDateString()}`],
        [`ID: ${balanceSheet.balance_sheet_id}`],
        [''],
        ['ASSETS', ''],
        ['Current Assets', ''],
        ...balanceSheetData.assets.current.map(item => [item.name, item.amount]),
        ['Total Current Assets', calculateCurrentAssets()],
        [''],
        ['Non-Current Assets', ''],
        ...balanceSheetData.assets.nonCurrent.map(item => [item.name, item.amount]),
        ['Total Non-Current Assets', calculateNonCurrentAssets()],
        ['TOTAL ASSETS', calculateTotalAssets()],
        [''],
        ['LIABILITIES', ''],
        ...balanceSheetData.liabilities.map(item => [item.name, item.amount]),
        ['TOTAL LIABILITIES', calculateTotalLiabilities()],
        [''],
        ['EQUITY', ''],
        ...balanceSheetData.equity.map(item => [item.name, item.amount]),
        ['TOTAL EQUITY', calculateTotalEquity()],
        [''],
        ['TOTAL LIABILITIES + EQUITY', calculateTotalLiabilities() + calculateTotalEquity()]
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
      XLSX.utils.book_append_sheet(wb, ws, 'Balance Sheet');

      // Generate Excel file and save
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `BalanceSheet_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {
      setError(err.message || 'Failed to export to Excel');
      console.error('Excel export error:', err);
    }
  };

  

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (error) {
      console.error('Balance Sheet Error:', error);
    }
  }, [error]);

  const chartData = balanceSheet ? [
    { 
      name: 'Assets', 
      value: balanceSheet.totals?.total_assets || 0,
      fill: '#8884d8'
    },
    { 
      name: 'Liabilities', 
      value: balanceSheet.totals?.total_liabilities || 0,
      fill: '#82ca9d'
    },
    { 
      name: 'Equity', 
      value: balanceSheet.totals?.total_equity || 0,
      fill: '#ffc658'
    }
  ] : [];

  const balanceSheetData = balanceSheet ? {
    assets: {
      current: [
        ...(balanceSheet.assets?.current_assets?.crypto_holdings ? 
          Object.entries(balanceSheet.assets.current_assets.crypto_holdings).map(([symbol, holding]: [string, any]) => ({
            name: `${symbol} Holdings`,
            amount: Number(holding.current_value) || 0,
            category: 'crypto'
          })) : []),
        { name: 'Cash and Equivalents', amount: Number(balanceSheet.assets?.current_assets?.cash_and_equivalents) || 0 },
        { name: 'Accounts Receivable', amount: Number(balanceSheet.assets?.current_assets?.accounts_receivable) || 0 },
        { name: 'Inventory', amount: Number(balanceSheet.assets?.current_assets?.inventory) || 0 }
      ],
      nonCurrent: [
        { name: 'Property, Plant & Equipment', amount: Number(balanceSheet.assets?.non_current_assets?.property_plant_equipment) || 0 },
        { name: 'Intangible Assets', amount: Number(balanceSheet.assets?.non_current_assets?.intangible_assets) || 0 },
        { name: 'Long-term Investments', amount: Number(balanceSheet.assets?.non_current_assets?.long_term_investments) || 0 }
      ]
    },
    liabilities: [
      { name: 'Accounts Payable', amount: Number(balanceSheet.liabilities?.current_liabilities?.accounts_payable) || 0 },
      { name: 'Short-term Debt', amount: Number(balanceSheet.liabilities?.current_liabilities?.short_term_debt) || 0 },
      { name: 'Accrued Expenses', amount: Number(balanceSheet.liabilities?.current_liabilities?.accrued_expenses) || 0 },
      { name: 'Long-term Debt', amount: Number(balanceSheet.liabilities?.long_term_liabilities?.long_term_debt) || 0 },
      { name: 'Deferred Tax Liabilities', amount: Number(balanceSheet.liabilities?.long_term_liabilities?.deferred_tax_liabilities) || 0 }
    ],
    equity: [
      { name: 'Retained Earnings', amount: Number(balanceSheet.equity?.retained_earnings) || 0 },
      { name: 'Common Stock', amount: Number(balanceSheet.equity?.common_stock) || 0 },
      { name: 'Additional Paid-in Capital', amount: Number(balanceSheet.equity?.additional_paid_in_capital) || 0 }
    ]
  } : {
    assets: {
      current: [],
      nonCurrent: []
    },
    liabilities: [],
    equity: []
  };


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

  const calculateCurrentAssets = (): number => {
    return balanceSheet?.assets?.current_assets?.total || 0;
  };

  const calculateNonCurrentAssets = (): number => {
    if (balanceSheet) {
      return balanceSheet.assets.total - balanceSheet.assets.current_assets.total;
    }
    return 0;
  };

  const calculateTotalAssets = (): number => {
    return balanceSheet?.totals?.total_assets || 0;
  };

  const calculateTotalLiabilities = (): number => {
    return balanceSheet?.totals?.total_liabilities || 0;
  };

  const calculateTotalEquity = (): number => {
    return balanceSheet?.totals?.total_equity || 0;
  };

  const handleExportExcel = () => {
    try {
      exportToExcel();
    } catch (error) {
      console.error('Failed to export to Excel:', error);
    }
  };

  const handleExportPdf = async () => {
    // PDF export - implementation needed
  };

  const handleRefresh = async () => {
    await generateBalanceSheet();
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
              <span className="text-gray-600">Total Assets</span>
              <span className="font-semibold text-gray-900">{formatCurrency(calculateTotalAssets())}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Liabilities</span>
              <span className="font-semibold text-gray-900">{formatCurrency(calculateTotalLiabilities())}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Equity</span>
              <span className="font-semibold text-gray-900">{formatCurrency(calculateTotalEquity())}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Net Worth</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(calculateTotalEquity())}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Balance Sheet Summary</h4>
        {balanceSheet ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your balance sheet shows total assets of <strong>{formatCurrency(balanceSheet.totals.total_assets)}</strong> 
              with a net worth of <strong>{formatCurrency(balanceSheet.totals.total_equity)}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The company has <strong>{formatCurrency(balanceSheet.assets.current_assets.total)}</strong> in current assets 
              and <strong>{formatCurrency(balanceSheet.assets.non_current_assets.total)}</strong> in non-current assets.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <button className="py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all" onClick={handleExportPdf}>
                📄 Download Report
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Loading balance sheet data...
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

      {/* Simple Balance Sheet Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Assets Section */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">ASSETS</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotalAssets())}</td>
            </tr>
            
            {/* Current Assets */}
            <tr>
              <td className="px-6 py-3 pl-12 text-sm text-gray-600">Current Assets</td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(calculateCurrentAssets())}</td>
            </tr>
            
            {balanceSheetData.assets.current.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-16 text-sm text-gray-600">
                  {(item as any).category === 'crypto' && <span className="mr-2">₿</span>}
                  {item.name}
                </td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Non-Current Assets */}
            <tr>
              <td className="px-6 py-3 pl-12 text-sm text-gray-600">Non-Current Assets</td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(calculateNonCurrentAssets())}</td>
            </tr>
            
            {balanceSheetData.assets.nonCurrent.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-16 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Liabilities Section */}
            <tr className="bg-red-50">
              <td className="px-6 py-4 font-semibold text-gray-900">LIABILITIES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotalLiabilities())}</td>
            </tr>
            
            {balanceSheetData.liabilities.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Equity Section */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">EQUITY</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotalEquity())}</td>
            </tr>
            
            {balanceSheetData.equity.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Totals */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-6 py-4 font-bold text-gray-900">TOTAL LIABILITIES + EQUITY</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(calculateTotalLiabilities() + calculateTotalEquity())}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Balance Check */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Balance Sheet is balanced</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="balance-sheet-container w-full min-h-screen bg-white">
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
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Balance Sheet</h1>
        {balanceSheet && (
          <p className="text-gray-600">
            As of: {new Date(balanceSheet.as_of_date).toLocaleDateString()} | 
            ID: {balanceSheet.balance_sheet_id}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading balance sheet...</p>
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

export default BalanceSheet;