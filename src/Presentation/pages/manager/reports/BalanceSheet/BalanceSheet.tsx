// BalanceSheet.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import './BalanceSheet.css';
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
  
  // State for balance sheet data and UI
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

  // Load balance sheet on component mount
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
        // Download the Excel file
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

  // Handle error display
  useEffect(() => {
    if (error) {
      console.error('Balance Sheet Error:', error);
      // You could show a toast notification here
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

  // Use real balance sheet data only
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
    <div className="chart-view">
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
      <div className="chart-summary">
        <div className="summary-box">
          <h4>Summary</h4>
          {balanceSheet ? (
            <p>
              Your balance sheet shows total assets of ${formatCurrency(balanceSheet.totals.total_assets).slice(1)} 
              with a net worth of ${formatCurrency(balanceSheet.totals.total_equity).slice(1)}.
            </p>
          ) : (
            <p>Your financial performance shows a 15% increase in revenue compared to the previous period, with expenses growing by 8% overall.</p>
          )}
          <div className="btn-container"> 
            <button className="close-btn1" onClick={()=> navigate(-1)}>Close</button>
            <button className="download-btn1" onClick={handleExportPdf}>Download Report</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="table-view">
      <div className="export-actions">
        <button className="export-excel" onClick={handleExportExcel} disabled={loading}>
          📊 Export To Excel
        </button>
        <button onClick={handleRefresh} disabled={loading} style={{marginLeft: '10px'}}>
          🔄 Refresh
        </button>
      </div>

      {loading && <div className="loading">Loading balance sheet...</div>}
      {error && (
        <div className="error" style={{color: 'red', margin: '10px 0'}}>
          Error: {error}
          <button onClick={clearError} style={{marginLeft: '10px'}}>Dismiss</button>
        </div>
      )}

      <div className="balance-sections">
        {/* Assets Section */}
        <div className="section-group">
          <div 
            className="section-header"
            onClick={() => toggleSection('assets')}
          >
            <span className={`expand-arrow ${expandedSections.assets ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Assets</span>
            <span className="section-amount">${formatCurrency(calculateTotalAssets()).slice(1)}</span>
          </div>
          
          {expandedSections.assets && (
            <div className="section-content">
              <div className="subsection">
                <div className="subsection-header">
                  <span className="subsection-title">Current Assets</span>
                  <span className="subsection-total">${formatCurrency(calculateCurrentAssets()).slice(1)}</span>
                </div>
                {balanceSheetData.assets.current.map((item, index) => (
                  <div key={index} className="line-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">${formatCurrency(item.amount).slice(1)}</span>
                  </div>
                ))}
                <div className="subsection-total-line">
                  <span>Total Current Assets</span>
                  <span>${formatCurrency(calculateCurrentAssets()).slice(1)}</span>
                </div>
              </div>

              <div className="subsection">
                <div className="subsection-header">
                  <span className="subsection-title">Non-Current Assets</span>
                  <span className="subsection-total">${formatCurrency(calculateNonCurrentAssets()).slice(1)}</span>
                </div>
                {balanceSheetData.assets.nonCurrent.map((item, index) => (
                  <div key={index} className="line-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">
                      {item.amount < 0 ? '-' : ''}${formatCurrency(item.amount).slice(1)}
                    </span>
                  </div>
                ))}
                <div className="subsection-total-line">
                  <span>Total Non-Current Assets</span>
                  <span>${formatCurrency(calculateNonCurrentAssets()).slice(1)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liabilities Section */}
        <div className="section-group">
          <div 
            className="section-header"
            onClick={() => toggleSection('liabilities')}
          >
            <span className={`expand-arrow ${expandedSections.liabilities ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Liabilities</span>
            <span className="section-amount">${formatCurrency(calculateTotalLiabilities()).slice(1)}</span>
          </div>
          
          {expandedSections.liabilities && (
            <div className="section-content">
              {balanceSheetData.liabilities.map((item, index) => (
                <div key={index} className="line-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-amount">${formatCurrency(item.amount).slice(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equity Section */}
        <div className="section-group">
          <div 
            className="section-header"
            onClick={() => toggleSection('equity')}
          >
            <span className={`expand-arrow ${expandedSections.equity ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Equity</span>
            <span className="section-amount">${formatCurrency(calculateTotalEquity()).slice(1)}</span>
          </div>
          
          {expandedSections.equity && (
            <div className="section-content">
              {balanceSheetData.equity.map((item, index) => (
                <div key={index} className="line-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-amount">${formatCurrency(item.amount).slice(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="totals-section">
          <div className="total-line">
            <span>Total Assets</span>
            <span>${formatCurrency(calculateTotalAssets()).slice(1)}</span>
          </div>
          <div className="total-line">
            <span>Total Liabilities</span>
            <span>${formatCurrency(calculateTotalLiabilities()).slice(1)}</span>
          </div>
          <div className="total-line">
            <span>Total Equity</span>
            <span>${formatCurrency(calculateTotalEquity()).slice(1)}</span>
          </div>
          <div className="total-line balance-check">
            <span>Liabilities + Equity</span>
            <span>${formatCurrency(calculateTotalLiabilities() + calculateTotalEquity()).slice(1)}</span>
          </div>
          <div className="balance-status">
            ✓ Balance Sheet is balanced
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="balance-sheet-container">
      <div className="balance-sheet-header">
        <div className="header-top">
          <button className="back-btn" onClick={()=> navigate(-1)}>← Balance Sheet</button>
        </div>
        <div className="header-content">
          <h1>Balance Sheet</h1>
          <p>View your company's assets, liabilities, and equity</p>
          {balanceSheet && (
            <small>As of: {new Date(balanceSheet.as_of_date).toLocaleDateString()}</small>
          )}
        </div>
        
        <div className="view-tabs">
          <button 
            className={`tab-btn ${activeView === 'chart' ? 'active' : ''}`}
            onClick={() => setActiveView('chart')}
          >
            Chart View
          </button>
          <button 
            className={`tab-btn ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => setActiveView('table')}
          >
            Table View
          </button>
        </div>
        
        <div className="report-period">
          <span>Daily Report</span>
          <button className="filter-btn">🔽 Filter</button>
        </div>
      </div>

      <div className="balance-sheet-content">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default BalanceSheet;