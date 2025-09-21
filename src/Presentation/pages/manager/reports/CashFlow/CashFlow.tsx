// CashFlow.tsx - Connected to Backend API
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import './CashFlow.css';
import { useNavigate } from 'react-router-dom';

interface CashFlowActivity {
  name: string;
  amount: number;
}

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
  const [expandedSections, setExpandedSections] = useState<{
    operating: boolean;
    investing: boolean;
    financing: boolean;
    assets: boolean;
    liabilities: boolean;
    equity: boolean;
  }>({
    operating: true,
    investing: false,
    financing: false,
    assets: false,
    liabilities: false,
    equity: false,
  });
  const [cashFlowData, setCashFlowData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cash flow statement on component mount
  useEffect(() => {
    generateCashFlowStatement();
  }, []);

  const generateCashFlowStatement = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
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

  const exportToExcel = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cash-flow/export-excel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok && data.success && data.excel_data) {
        // Create and download the Excel file
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
        console.error('Failed to export to Excel:', data.error);
      }
    } catch (error) {
      console.error('Excel export error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data from real cash flow data
  const chartData = cashFlowData ? [
    { 
      name: 'Operating', 
      value: cashFlowData.operating_activities.net_cash_flow
    },
    { 
      name: 'Investing', 
      value: cashFlowData.investing_activities.net_cash_flow
    },
    { 
      name: 'Financing', 
      value: cashFlowData.financing_activities.net_cash_flow
    }
  ] : [];

  const toggleSection = (section: 'operating' | 'investing' | 'financing' | 'assets' | 'liabilities' | 'equity') => {
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

  const renderChartView = () => {
    if (loading) {
      return <div className="loading">Loading cash flow data...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (!cashFlowData || chartData.length === 0) {
      return <div className="no-data">No cash flow data available for chart view</div>;
    }

    return (
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
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-summary">
          <div className="summary-box">
            <h4>Cash Flow Summary</h4>
            <p>Your cash flow analysis shows operating, investing, and financing activities for the current period.</p>
            <div className="btn-container"> 
              <button className="close-btn1" onClick={()=> navigate(-1)}>Close</button>
              <button className="download-btn1" onClick={exportToExcel}>Download Report</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    if (loading) {
      return <div className="loading">Loading cash flow statement...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (!cashFlowData) {
      return <div className="no-data">No cash flow data available</div>;
    }

    return (
      <div className="table-view">
        <div className="export-actions">
          <button className="export-excel" onClick={exportToExcel}>📊 Export To Excel</button>
        </div>

        <div className="cash-flow-sections">
          {/* Operating Activities Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('operating')}
            >
              <span className={`expand-arrow ${expandedSections.operating ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Cash Flows from Operating Activities</span>
              <span className="section-amount">
                {cashFlowData.operating_activities.net_cash_flow >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.operating_activities.net_cash_flow).slice(1)}
              </span>
            </div>
            
            {expandedSections.operating && (
              <div className="section-content">
                <div className="subsection">
                  <div className="subsection-header">
                    <span className="subsection-title">Cash Receipts</span>
                    <span className="subsection-total">${formatCurrency(cashFlowData.operating_activities.cash_receipts.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.operating_activities.cash_receipts)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                    <div key={index} className="line-item">
                      <span className="item-name">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span className="item-amount">${formatCurrency(value as number).slice(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="subsection">
                  <div className="subsection-header">
                    <span className="subsection-title">Cash Payments</span>
                    <span className="subsection-total">-${formatCurrency(cashFlowData.operating_activities.cash_payments.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.operating_activities.cash_payments)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                    <div key={index} className="line-item">
                      <span className="item-name">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span className="item-amount">-${formatCurrency(value as number).slice(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="subsection-total-line">
                  <span>Net Cash from Operating Activities</span>
                  <span>
                    {cashFlowData.operating_activities.net_cash_flow >= 0 ? '' : '-'}
                    ${formatCurrency(cashFlowData.operating_activities.net_cash_flow).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Investing Activities Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('investing')}
            >
              <span className={`expand-arrow ${expandedSections.investing ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Cash Flows from Investing Activities</span>
              <span className="section-amount">
                {cashFlowData.investing_activities.net_cash_flow >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.investing_activities.net_cash_flow).slice(1)}
              </span>
            </div>
            
            {expandedSections.investing && (
              <div className="section-content">
                <div className="subsection">
                  <div className="subsection-header">
                    <span className="subsection-title">Cash Receipts</span>
                    <span className="subsection-total">${formatCurrency(cashFlowData.investing_activities.cash_receipts.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.investing_activities.cash_receipts)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                    <div key={index} className="line-item">
                      <span className="item-name">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span className="item-amount">${formatCurrency(value as number).slice(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="subsection">
                  <div className="subsection-header">
                    <span className="subsection-title">Cash Payments</span>
                    <span className="subsection-total">-${formatCurrency(cashFlowData.investing_activities.cash_payments.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.investing_activities.cash_payments)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                    <div key={index} className="line-item">
                      <span className="item-name">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span className="item-amount">-${formatCurrency(value as number).slice(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="subsection-total-line">
                  <span>Net Cash from Investing Activities</span>
                  <span>
                    {cashFlowData.investing_activities.net_cash_flow >= 0 ? '' : '-'}
                    ${formatCurrency(cashFlowData.investing_activities.net_cash_flow).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Financing Activities Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('financing')}
            >
              <span className={`expand-arrow ${expandedSections.financing ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Cash Flows from Financing Activities</span>
              <span className="section-amount">
                {cashFlowData.financing_activities.net_cash_flow >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.financing_activities.net_cash_flow).slice(1)}
              </span>
            </div>
            
            {expandedSections.financing && (
              <div className="section-content">
                <div className="subsection">
                  <div className="subsection-header">
                    <span className="subsection-title">Cash Receipts</span>
                    <span className="subsection-total">${formatCurrency(cashFlowData.financing_activities.cash_receipts.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.financing_activities.cash_receipts)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                    <div key={index} className="line-item">
                      <span className="item-name">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span className="item-amount">${formatCurrency(value as number).slice(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="subsection">
                  <div className="subsection-header">
                    <span className="subsection-title">Cash Payments</span>
                    <span className="subsection-total">-${formatCurrency(cashFlowData.financing_activities.cash_payments.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.financing_activities.cash_payments)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                    <div key={index} className="line-item">
                      <span className="item-name">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span className="item-amount">-${formatCurrency(value as number).slice(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="subsection-total-line">
                  <span>Net Cash from Financing Activities</span>
                  <span>
                    {cashFlowData.financing_activities.net_cash_flow >= 0 ? '' : '-'}
                    ${formatCurrency(cashFlowData.financing_activities.net_cash_flow).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Cash Summary */}
          <div className="totals-section">
            <div className="total-line">
              <span>Beginning Cash</span>
              <span>${formatCurrency(cashFlowData.cash_summary.beginning_cash).slice(1)}</span>
            </div>
            <div className="total-line">
              <span>Net Change in Cash</span>
              <span>
                {cashFlowData.cash_summary.net_change_in_cash >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.cash_summary.net_change_in_cash).slice(1)}
              </span>
            </div>
            <div className="total-line balance-check">
              <span>Ending Cash</span>
              <span>${formatCurrency(cashFlowData.cash_summary.ending_cash).slice(1)}</span>
            </div>
            <div className="balance-status">
              ✓ Cash flow statement generated successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cash-flow-container">
      <div className="cash-flow-header">
        <div className="header-top">
          <button className="back-btn" onClick={()=> navigate(-1)}>← Cash Flow</button>
        </div>
        <div className="header-content">
          <h1>Cash Flow</h1>
          <p>View your company's cash flows from operating, investing, and financing activities</p>
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

      <div className="cash-flow-content">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default CashFlow;