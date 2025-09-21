// Income.tsx - Backend Connected
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import './Income.css';
import { useNavigate } from 'react-router-dom';

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
  
  // State for income statement data and UI
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [expandedSections, setExpandedSections] = useState<{
    revenue: boolean;
    expenses: boolean;
    summary: boolean;
  }>({
    revenue: true,
    expenses: false,
    summary: false,
  });

  // Load income statement on component mount
  useEffect(() => {
    generateIncomeStatement();
  }, []);

  const generateIncomeStatement = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      // Use portfolio value endpoint to get basic financial data
      const response = await fetch(`${API_URL}/portfolio/value/?currency=USD`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error(`Server returned HTML error page (${response.status}). Portfolio endpoint may not be available.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch portfolio data`);
      }

      // Create a basic income statement from portfolio value data
      // Since we don't have transaction data, show portfolio value as revenue
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

  const exportToExcel = async () => {
    try {
      setLoading(true);
      
      // Create CSV export using the calculated income statement data
      if (!incomeStatement) {
        setError('No income statement data to export');
        return;
      }

      const csvContent = [
        ['Category', 'Item', 'Amount'],
        ['Revenue', '', ''],
        ...incomeStatement.revenue.map(item => ['', item.name, item.amount.toString()]),
        ['', 'Total Revenue', incomeStatement.total_revenue.toString()],
        ['', '', ''],
        ['Expenses', '', ''],
        ...incomeStatement.expenses.map(item => ['', item.name, item.amount.toString()]),
        ['', 'Total Expenses', incomeStatement.total_expenses.toString()],
        ['', '', ''],
        ['Summary', '', ''],
        ['', 'Net Income', incomeStatement.net_income.toString()]
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `income_statement_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export error:', error);
      setError('Failed to export income statement');
    } finally {
      setLoading(false);
    }
  };

  // Chart data from real income statement data
  const chartData = incomeStatement ? [
    { 
      name: 'Revenue', 
      value: incomeStatement.total_revenue
    },
    { 
      name: 'Expenses', 
      value: incomeStatement.total_expenses
    },
    { 
      name: 'Net Income', 
      value: incomeStatement.net_income
    }
  ] : [];


  const toggleSection = (section: 'revenue' | 'expenses' | 'summary') => {
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
      return <div className="loading">Loading income statement data...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (!incomeStatement || chartData.length === 0) {
      return <div className="no-data">No income statement data available for chart view</div>;
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
            <h4>Income Statement Summary</h4>
            <p>Your income statement shows revenue, expenses, and net income for the current period.</p>
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
      return <div className="loading">Loading income statement...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (!incomeStatement) {
      return <div className="no-data">No income statement data available</div>;
    }

    return (
      <div className="table-view">
        <div className="export-actions">
          <button className="export-excel" onClick={exportToExcel}>📊 Export To Excel</button>
        </div>

        <div className="income-sections">
          {/* Revenue Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('revenue')}
            >
              <span className={`expand-arrow ${expandedSections.revenue ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Revenue</span>
              <span className="section-amount">${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
            </div>
            
            {expandedSections.revenue && (
              <div className="section-content">
                {incomeStatement.revenue.map((item: IncomeItem, index: number) => (
                  <div key={index} className="line-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">${formatCurrency(item.amount).slice(1)}</span>
                  </div>
                ))}
                <div className="subsection-total-line">
                  <span>Total Revenue</span>
                  <span>${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('expenses')}
            >
              <span className={`expand-arrow ${expandedSections.expenses ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Expenses</span>
              <span className="section-amount">-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
            </div>
            
            {expandedSections.expenses && (
              <div className="section-content">
                {incomeStatement.expenses.map((item: IncomeItem, index: number) => (
                  <div key={index} className="line-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">-${formatCurrency(item.amount).slice(1)}</span>
                  </div>
                ))}
                <div className="subsection-total-line">
                  <span>Total Expenses</span>
                  <span>-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('summary')}
            >
              <span className={`expand-arrow ${expandedSections.summary ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Income Summary</span>
              <span className="section-amount">
                {incomeStatement.net_income >= 0 ? '' : '-'}
                ${formatCurrency(incomeStatement.net_income).slice(1)}
              </span>
            </div>
            
            {expandedSections.summary && (
              <div className="section-content">
                <div className="line-item">
                  <span className="item-name">Total Revenue</span>
                  <span className="item-amount">${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
                </div>
                <div className="line-item">
                  <span className="item-name">Total Expenses</span>
                  <span className="item-amount">-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
                </div>
                <div className="subsection-total-line">
                  <span>Net Income</span>
                  <span>
                    {incomeStatement.net_income >= 0 ? '' : '-'}
                    ${formatCurrency(incomeStatement.net_income).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="totals-section">
            <div className="total-line">
              <span>Total Revenue</span>
              <span>${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
            </div>
            <div className="total-line">
              <span>Total Expenses</span>
              <span>-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
            </div>
            <div className="total-line balance-check">
              <span>Net Income</span>
              <span>
                {incomeStatement.net_income >= 0 ? '' : '-'}
                ${formatCurrency(incomeStatement.net_income).slice(1)}
              </span>
            </div>
            <div className="balance-status">
              ✓ Income statement generated successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="income-container">
      <div className="income-header">
        <div className="header-top">
          <button className="back-btn" onClick={()=> navigate(-1)}>← Income Statement</button>
        </div>
        <div className="header-content">
          <h1>Income Statement</h1>
          <p>View your company's revenue, expenses, and net income</p>
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
          <span>Monthly Report</span>
          <button className="filter-btn">🔽 Filter</button>
        </div>
      </div>

      <div className="income-content">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default Income;