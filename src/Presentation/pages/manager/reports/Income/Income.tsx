import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    generateIncomeStatement();
  }, []);

  const generateIncomeStatement = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
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

  const exportToExcel = async () => {
    try {
      setLoading(true);
      
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
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading income statement data...</div>;
    }

    if (error) {
      return <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">Error: {error}</div>;
    }

    if (!incomeStatement || chartData.length === 0) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No income statement data available for chart view</div>;
    }

    return (
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
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-summary bg-white rounded-xl p-6 mt-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Income Statement Summary</h4>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">Your income statement shows revenue, expenses, and net income for the current period.</p>
          <div className="btn-container flex gap-3 flex-wrap md:flex-col">
            <button className="close-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>Close</button>
            <button className="download-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all" onClick={exportToExcel}>Download Report</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    if (loading) {
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading income statement...</div>;
    }

    if (error) {
      return <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">Error: {error}</div>;
    }

    if (!incomeStatement) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No income statement data available</div>;
    }

    return (
      <div className="table-view flex flex-col h-full bg-white">
        <div className="export-actions p-4 border-b border-gray-200 bg-white flex justify-end">
          <button className="export-excel py-2.5 px-4 bg-emerald-500 text-white border-none rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-600 transition-colors" onClick={exportToExcel}>📊 Export To Excel</button>
        </div>

        <div className="income-sections flex-1 overflow-y-auto bg-gray-50">
          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('revenue')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.revenue ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Revenue</span>
              <span className="section-amount text-lg text-gray-900 font-bold">${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
            </div>
            
            {expandedSections.revenue && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                {incomeStatement.revenue.map((item: IncomeItem, index: number) => (
                  <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                    <span className="item-name flex-1 text-gray-700">{item.name}</span>
                    <span className="item-amount font-semibold text-gray-900">${formatCurrency(item.amount).slice(1)}</span>
                  </div>
                ))}
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Revenue</span>
                  <span>${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('expenses')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.expenses ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Expenses</span>
              <span className="section-amount text-lg text-gray-900 font-bold">-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
            </div>
            
            {expandedSections.expenses && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                {incomeStatement.expenses.map((item: IncomeItem, index: number) => (
                  <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                    <span className="item-name flex-1 text-gray-700">{item.name}</span>
                    <span className="item-amount font-semibold text-gray-900">-${formatCurrency(item.amount).slice(1)}</span>
                  </div>
                ))}
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Expenses</span>
                  <span>-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('summary')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.summary ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Income Summary</span>
              <span className="section-amount text-lg text-gray-900 font-bold">
                {incomeStatement.net_income >= 0 ? '' : '-'}
                ${formatCurrency(incomeStatement.net_income).slice(1)}
              </span>
            </div>
            
            {expandedSections.summary && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                <div className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  <span className="item-name flex-1 text-gray-700">Total Revenue</span>
                  <span className="item-amount font-semibold text-gray-900">${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
                </div>
                <div className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  <span className="item-name flex-1 text-gray-700">Total Expenses</span>
                  <span className="item-amount font-semibold text-gray-900">-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
                </div>
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Net Income</span>
                  <span>
                    {incomeStatement.net_income >= 0 ? '' : '-'}
                    ${formatCurrency(incomeStatement.net_income).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="totals-section bg-white p-6 border-t-4 border-gray-200 mt-2">
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Total Revenue</span>
              <span>${formatCurrency(incomeStatement.total_revenue).slice(1)}</span>
            </div>
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Total Expenses</span>
              <span>-${formatCurrency(incomeStatement.total_expenses).slice(1)}</span>
            </div>
            <div className="total-line balance-check flex justify-between items-center py-4 mt-4 text-lg font-bold text-gray-900 border-t-2 border-gray-300 border-b-4 border-double border-gray-700">
              <span>Net Income</span>
              <span>
                {incomeStatement.net_income >= 0 ? '' : '-'}
                ${formatCurrency(incomeStatement.net_income).slice(1)}
              </span>
            </div>
            <div className="balance-status text-center text-emerald-600 text-base font-semibold mt-5 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
              ✓ Income statement generated successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="income-container flex flex-col w-full h-screen bg-white font-sans rounded-none border border-gray-200 shadow-md md:rounded-none">
      <div className="income-header bg-white p-6 border-b border-gray-200">
        <div className="header-top mb-4">
          <button className="back-btn bg-transparent border-none text-gray-500 text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-all" onClick={() => navigate(-1)}>← Income Statement</button>
        </div>
        <div className="header-content">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight md:text-xl">Income Statement</h1>
          <p className="text-base text-gray-500 mb-5 leading-snug">View your company's revenue, expenses, and net income</p>
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
          <span>Monthly Report</span>
          <button className="filter-btn bg-transparent border border-gray-300 text-purple-600 text-sm flex items-center gap-1.5 py-1.5 px-3 rounded-md hover:bg-gray-50 hover:border-purple-600 transition-all">🔽 Filter</button>
        </div>
      </div>

      <div className="income-content flex-1 overflow-y-auto bg-gray-50">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default Income;