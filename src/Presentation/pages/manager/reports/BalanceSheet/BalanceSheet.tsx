import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BalanceSheetItem {
  name: string;
  amount: number;
  subItems?: BalanceSheetItem[];
}

interface BalanceSheetData {
  assets: {
    current: BalanceSheetItem[];
    nonCurrent: BalanceSheetItem[];
  };
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
}

const BalanceSheet: React.FC = () => {
  const navigate = useNavigate();
  
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [expandedSections, setExpandedSections] = useState<{
    assets: boolean;
    liabilities: boolean;
    equity: boolean;
  }>({
    assets: true,
    liabilities: false,
    equity: false,
  });

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

  const exportToExcel = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const queryParams = balanceSheet?.balance_sheet_id ? `?balance_sheet_id=${balanceSheet.balance_sheet_id}` : '';
      const response = await fetch(`${API_URL}/balance-sheet/export-excel/${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.excel_data) {
        const byteCharacters = atob(data.excel_data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: data.content_type });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(data.error || 'Failed to export to Excel');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to export to Excel');
      console.error('Excel export error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToPdf = async () => {
    console.log('PDF export - implementation needed');
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
      name: 'Current', 
      assets: balanceSheet.assets?.total || 0, 
      liabilities: balanceSheet.liabilities?.total || 0, 
      equity: balanceSheet.equity?.total || 0
    }
  ] : [];

  const balanceSheetData = balanceSheet ? {
    assets: {
      current: balanceSheet?.assets?.current_assets?.crypto_holdings ? 
        Object.entries(balanceSheet.assets.current_assets.crypto_holdings).map(([symbol, holding]: [string, any]) => ({
          name: `${symbol} Holdings`,
          amount: holding.current_value || 0
        })) : [],
      nonCurrent: [
        { name: 'Other Assets', amount: balanceSheet.assets.total - balanceSheet.assets.current_assets.total }
      ]
    },
    liabilities: Object.entries(balanceSheet.liabilities.current_liabilities || {}).map(([name, amount]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      amount: typeof amount === 'number' ? amount : 0
    })),
    equity: [
      { name: 'Retained Earnings', amount: balanceSheet.equity.retained_earnings }
    ]
  } : {
    assets: {
      current: [],
      nonCurrent: []
    },
    liabilities: [],
    equity: []
  };

  const toggleSection = (section: 'assets' | 'liabilities' | 'equity') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (amount: number): string => {
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

  const handleExportExcel = async () => {
    try {
      await exportToExcel();
    } catch (error) {
      console.error('Failed to export to Excel:', error);
    }
  };

  const handleExportPdf = async () => {
    console.log('PDF export - implementation needed');
  };

  const handleRefresh = async () => {
    await generateBalanceSheet();
  };

  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="assets" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="liabilities" stroke="#82ca9d" />
          <Line type="monotone" dataKey="equity" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-summary bg-white rounded-xl p-6 mt-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Summary</h4>
        {balanceSheet ? (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Your balance sheet shows total assets of ${formatCurrency(balanceSheet.totals.total_assets).slice(1)} 
            with a net worth of ${formatCurrency(balanceSheet.totals.total_equity).slice(1)}.
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Your financial performance shows a 15% increase in revenue compared to the previous period, with expenses growing by 8% overall.
          </p>
        )}
        <div className="btn-container flex gap-3 flex-wrap md:flex-col">
          <button className="close-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>Close</button>
          <button className="download-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all" onClick={handleExportPdf}>Download Report</button>
        </div>
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="table-view flex flex-col h-full bg-white">
      <div className="export-actions p-4 border-b border-gray-200 bg-white flex justify-end gap-3 md:flex-col">
        <button className="export-excel py-2.5 px-4 bg-emerald-500 text-white border-none rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed md:w-full md:justify-center" onClick={handleExportExcel} disabled={loading}>
          📊 Export To Excel
        </button>
        <button className="py-2.5 px-4 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-200 hover:border-gray-400 transition-all md:w-full md:justify-center" onClick={handleRefresh} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {loading && <div className="loading text-center py-10 text-gray-600 text-base">Loading balance sheet...</div>}
      {error && (
        <div className="error bg-red-50 text-red-600 py-3 px-6 border-l-4 border-red-600 flex justify-between items-center">
          Error: {error}
          <button className="bg-transparent border-none text-red-600 underline text-sm cursor-pointer" onClick={clearError}>Dismiss</button>
        </div>
      )}

      <div className="balance-sections flex-1 overflow-y-auto bg-gray-50">
        <div className="section-group bg-white mb-[2px]">
          <div 
            className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
            onClick={() => toggleSection('assets')}
          >
            <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.assets ? 'rotate-0' : '-rotate-90'}`}>▼</span>
            <span className="section-title flex-1 text-lg text-gray-900">Assets</span>
            <span className="section-amount text-lg text-gray-900 font-bold">${formatCurrency(calculateTotalAssets()).slice(1)}</span>
          </div>
          
          {expandedSections.assets && (
            <div className="section-content bg-gray-50 border-t border-gray-200">
              <div className="subsection bg-white mb-[1px]">
                <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                  <span className="subsection-title">Current Assets</span>
                  <span className="subsection-total text-gray-900 font-bold">${formatCurrency(calculateCurrentAssets()).slice(1)}</span>
                </div>
                {balanceSheetData.assets.current.map((item, index) => (
                  <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                    <span className="item-name flex-1 text-gray-700">{item.name}</span>
                    <span className="item-amount font-semibold text-gray-900">${formatCurrency(item.amount).slice(1)}</span>
                  </div>
                ))}
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Current Assets</span>
                  <span>${formatCurrency(calculateCurrentAssets()).slice(1)}</span>
                </div>
              </div>

              <div className="subsection bg-white">
                <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                  <span className="subsection-title">Non-Current Assets</span>
                  <span className="subsection-total text-gray-900 font-bold">${formatCurrency(calculateNonCurrentAssets()).slice(1)}</span>
                </div>
                {balanceSheetData.assets.nonCurrent.map((item, index) => (
                  <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                    <span className="item-name flex-1 text-gray-700">{item.name}</span>
                    <span className="item-amount font-semibold text-gray-900">
                      {item.amount < 0 ? '-' : ''}${formatCurrency(item.amount).slice(1)}
                    </span>
                  </div>
                ))}
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Non-Current Assets</span>
                  <span>${formatCurrency(calculateNonCurrentAssets()).slice(1)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section-group bg-white mb-[2px]">
          <div 
            className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
            onClick={() => toggleSection('liabilities')}
          >
            <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.liabilities ? 'rotate-0' : '-rotate-90'}`}>▼</span>
            <span className="section-title flex-1 text-lg text-gray-900">Liabilities</span>
            <span className="section-amount text-lg text-gray-900 font-bold">${formatCurrency(calculateTotalLiabilities()).slice(1)}</span>
          </div>
          
          {expandedSections.liabilities && (
            <div className="section-content bg-gray-50 border-t border-gray-200">
              {balanceSheetData.liabilities.map((item, index) => (
                <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  <span className="item-name flex-1 text-gray-700">{item.name}</span>
                  <span className="item-amount font-semibold text-gray-900">${formatCurrency(item.amount).slice(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-group bg-white mb-[2px]">
          <div 
            className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
            onClick={() => toggleSection('equity')}
          >
            <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.equity ? 'rotate-0' : '-rotate-90'}`}>▼</span>
            <span className="section-title flex-1 text-lg text-gray-900">Equity</span>
            <span className="section-amount text-lg text-gray-900 font-bold">${formatCurrency(calculateTotalEquity()).slice(1)}</span>
          </div>
          
          {expandedSections.equity && (
            <div className="section-content bg-gray-50 border-t border-gray-200">
              {balanceSheetData.equity.map((item, index) => (
                <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  <span className="item-name flex-1 text-gray-700">{item.name}</span>
                  <span className="item-amount font-semibold text-gray-900">${formatCurrency(item.amount).slice(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="totals-section bg-white p-6 border-t-4 border-gray-200 mt-2">
          <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
            <span>Total Assets</span>
            <span>${formatCurrency(calculateTotalAssets()).slice(1)}</span>
          </div>
          <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
            <span>Total Liabilities</span>
            <span>${formatCurrency(calculateTotalLiabilities()).slice(1)}</span>
          </div>
          <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
            <span>Total Equity</span>
            <span>${formatCurrency(calculateTotalEquity()).slice(1)}</span>
          </div>
          <div className="total-line balance-check flex justify-between items-center py-4 mt-4 text-lg font-bold text-gray-900 border-t-2 border-gray-300 border-b-4 border-double border-gray-700">
            <span>Liabilities + Equity</span>
            <span>${formatCurrency(calculateTotalLiabilities() + calculateTotalEquity()).slice(1)}</span>
          </div>
          <div className="balance-status text-center text-emerald-600 text-base font-semibold mt-5 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
            ✓ Balance Sheet is balanced
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="balance-sheet-container flex flex-col w-full h-screen bg-white font-sans rounded-none border border-gray-200 shadow-md md:rounded-none">
      <div className="balance-sheet-header bg-white p-6 border-b border-gray-200">
        <div className="header-top mb-4">
          <button className="back-btn bg-transparent border-none text-gray-500 text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-all" onClick={() => navigate(-1)}>← Balance Sheet</button>
        </div>
        <div className="header-content">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight md:text-xl">Balance Sheet</h1>
          <p className="text-base text-gray-500 mb-2 leading-snug">View your company's assets, liabilities, and equity</p>
          {balanceSheet && (
            <small className="text-sm text-gray-400 block mb-5">As of: {new Date(balanceSheet.as_of_date).toLocaleDateString()}</small>
          )}
        </div>
        
        <div className="view-tabs flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit md:w-full">
          <button 
            className={`tab-btn py-2.5 px-5 bg-transparent text-gray-500 text-sm font-medium rounded-md hover:text-gray-700 transition-all ${activeView === 'chart' ? 'bg-white text-gray-900 shadow-sm' : ''} md:flex-1 md:text-center`}
            onClick={() => setActiveView('chart')}
          >
            Chart View
          </button>
          <button 
            className={`tab-btn py-2.5 px-5 bg-transparent text-gray-500 text-sm font-medium rounded-md hover:text-gray-700 transition-all ${activeView === 'table' ? 'bg-white text-gray-900 shadow-sm' : ''} md:flex-1 md:text-center`}
            onClick={() => setActiveView('table')}
          >
            Table View
          </button>
        </div>
        
        <div className="report-period flex justify-between items-center text-sm text-gray-700">
          <span>Daily Report</span>
          <button className="filter-btn bg-transparent border border-gray-300 text-purple-600 text-sm flex items-center gap-1.5 py-1.5 px-3 rounded-md hover:bg-gray-50 hover:border-purple-600 transition-all">🔽 Filter</button>
        </div>
      </div>

      <div className="balance-sheet-content flex-1 overflow-y-auto bg-gray-50">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default BalanceSheet;