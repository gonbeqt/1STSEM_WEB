import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface InvestmentHolding {
  symbol: string;
  name: string;
  quantity: number;
  current_value: number;
  cost_basis: number;
  unrealized_gain_loss: number;
  percentage_of_portfolio: number;
}

interface PortfolioData {
  holdings: InvestmentHolding[];
  total_value: number;
  total_cost_basis: number;
  total_unrealized_gain_loss: number;
  cash_balance: number;
}

const Invest: React.FC = () => {
  const navigate = useNavigate();
  
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [expandedSections, setExpandedSections] = useState<{
    holdings: boolean;
    performance: boolean;
    summary: boolean;
  }>({
    holdings: true,
    performance: false,
    summary: false,
  });

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
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
        const htmlText = await response.text();
        throw new Error(`Server returned HTML error page (${response.status}). Portfolio endpoint may not be available.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch portfolio data`);
      }

      if (data && typeof data.total_value !== 'undefined') {
        const transformedPortfolio: PortfolioData = {
          holdings: data.breakdown ? data.breakdown.map((item: any) => ({
            symbol: item.cryptocurrency,
            name: item.cryptocurrency,
            quantity: item.amount,
            current_value: item.value,
            cost_basis: item.value,
            unrealized_gain_loss: 0,
            percentage_of_portfolio: (item.value / data.total_value) * 100
          })) : [],
          total_value: data.total_value || 0,
          total_cost_basis: data.total_value || 0,
          total_unrealized_gain_loss: 0,
          cash_balance: 0
        };
        setPortfolio(transformedPortfolio);
      } else {
        throw new Error('Invalid response format from portfolio API');
      }
    } catch (err: any) {
      console.error('Portfolio fetch error:', err);
      
      let errorMessage = 'Failed to load portfolio data';
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to the backend server. Please check if the server is running.';
      } else if (err.message.includes('401')) {
        errorMessage = 'Authentication error: Please log in again.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error: The portfolio service is currently unavailable.';
      } else {
        errorMessage = err.message || 'Failed to load portfolio data';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);
      
      if (!portfolio) {
        return;
      }

      const csvContent = [
        ['Symbol', 'Name', 'Quantity', 'Current Value', 'Percentage'],
        ...portfolio.holdings.map(holding => [
          holding.symbol,
          holding.name,
          holding.quantity.toString(),
          holding.current_value.toString(),
          formatPercentage(holding.percentage_of_portfolio)
        ]),
        ['', '', 'Total Portfolio Value:', portfolio.total_value.toString(), '100%']
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('CSV export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = portfolio ? portfolio.holdings.map(holding => ({
    name: holding.symbol,
    value: holding.current_value,
    percentage: holding.percentage_of_portfolio
  })) : [];

  const toggleSection = (section: 'holdings' | 'performance' | 'summary') => {
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

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(2)}%`;
  };

  const renderChartView = () => {
    if (loading) {
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading portfolio data...</div>;
    }

    if (error) {
      return <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">Error: {error}</div>;
    }

    if (!portfolio || chartData.length === 0) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No portfolio data available for chart view</div>;
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
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h4>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">Your investment portfolio shows current holdings, performance, and total value.</p>
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
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading portfolio...</div>;
    }

    if (error) {
      return <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">Error: {error}</div>;
    }

    if (!portfolio) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No portfolio data available</div>;
    }

    return (
      <div className="table-view flex flex-col h-full bg-white">
        <div className="export-actions p-4 border-b border-gray-200 bg-white flex justify-end">
          <button className="export-excel py-2.5 px-4 bg-emerald-500 text-white border-none rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-600 transition-colors" onClick={exportToExcel}>📊 Export To Excel</button>
        </div>

        <div className="portfolio-sections flex-1 overflow-y-auto bg-gray-50">
          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('holdings')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.holdings ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Investment Holdings</span>
              <span className="section-amount text-lg text-gray-900 font-bold">${formatCurrency(portfolio.total_value).slice(1)}</span>
            </div>
            
            {expandedSections.holdings && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                {portfolio.holdings.map((holding: InvestmentHolding, index: number) => (
                  <div key={index} className="line-item flex justify-between items-start py-4 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <span className="item-name flex flex-col gap-1 text-gray-700">
                      {holding.symbol} - {holding.name}
                      <small className="item-details text-xs text-gray-400 font-normal">{holding.quantity} shares @ {formatPercentage(holding.percentage_of_portfolio)}</small>
                    </span>
                    <span className="item-amount flex flex-col items-end gap-1 font-semibold text-gray-900">
                      ${formatCurrency(holding.current_value).slice(1)}
                      <small className={`gain-loss text-xs font-medium ${holding.unrealized_gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.unrealized_gain_loss >= 0 ? '+' : ''}
                        ${formatCurrency(holding.unrealized_gain_loss).slice(1)}
                      </small>
                    </span>
                  </div>
                ))}
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Holdings Value</span>
                  <span>${formatCurrency(portfolio.total_value).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('performance')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.performance ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Performance</span>
              <span className="section-amount text-lg text-gray-900 font-bold">
                {portfolio.total_unrealized_gain_loss >= 0 ? '+' : ''}
                ${formatCurrency(portfolio.total_unrealized_gain_loss).slice(1)}
              </span>
            </div>
            
            {expandedSections.performance && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                <div className="line-item flex justify-between items-start py-4 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Total Cost Basis</span>
                  <span className="item-amount flex flex-col items-end gap-1 font-semibold text-gray-900">${formatCurrency(portfolio.total_cost_basis).slice(1)}</span>
                </div>
                <div className="line-item flex justify-between items-start py-4 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Current Market Value</span>
                  <span className="item-amount flex flex-col items-end gap-1 font-semibold text-gray-900">${formatCurrency(portfolio.total_value).slice(1)}</span>
                </div>
                <div className="line-item flex justify-between items-start py-4 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Cash Balance</span>
                  <span className="item-amount flex flex-col items-end gap-1 font-semibold text-gray-900">${formatCurrency(portfolio.cash_balance).slice(1)}</span>
                </div>
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Unrealized Gain/Loss</span>
                  <span className={portfolio.total_unrealized_gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {portfolio.total_unrealized_gain_loss >= 0 ? '+' : ''}
                    ${formatCurrency(portfolio.total_unrealized_gain_loss).slice(1)}
                  </span>
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
              <span className="section-title flex-1 text-lg text-gray-900">Portfolio Summary</span>
              <span className="section-amount text-lg text-gray-900 font-bold">${formatCurrency(portfolio.total_value + portfolio.cash_balance).slice(1)}</span>
            </div>
            
            {expandedSections.summary && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                <div className="line-item flex justify-between items-start py-4 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Total Investment Value</span>
                  <span className="item-amount flex flex-col items-end gap-1 font-semibold text-gray-900">${formatCurrency(portfolio.total_value).slice(1)}</span>
                </div>
                <div className="line-item flex justify-between items-start py-4 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Available Cash</span>
                  <span className="item-amount flex flex-col items-end gap-1 font-semibold text-gray-900">${formatCurrency(portfolio.cash_balance).slice(1)}</span>
                </div>
                <div className="line-item flex justify-between items-start py-4 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Number of Holdings</span>
                  <span className="item-amount flex flex-col items-end gap-1 font-semibold text-gray-900">{portfolio.holdings.length}</span>
                </div>
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Portfolio Value</span>
                  <span>${formatCurrency(portfolio.total_value + portfolio.cash_balance).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="totals-section bg-white p-6 border-t-4 border-gray-200 mt-2">
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Investment Holdings</span>
              <span>${formatCurrency(portfolio.total_value).slice(1)}</span>
            </div>
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Cash Balance</span>
              <span>${formatCurrency(portfolio.cash_balance).slice(1)}</span>
            </div>
            <div className="total-line balance-check flex justify-between items-center py-4 mt-4 text-lg font-bold text-gray-900 border-t-2 border-gray-300 border-b-4 border-double border-gray-700">
              <span>Total Portfolio Value</span>
              <span>${formatCurrency(portfolio.total_value + portfolio.cash_balance).slice(1)}</span>
            </div>
            <div className="balance-status text-center text-emerald-600 text-base font-semibold mt-5 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
              ✓ Portfolio data loaded successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="invest-container flex flex-col w-full h-screen bg-white font-sans rounded-none border border-gray-200 shadow-md md:rounded-none">
      <div className="invest-header bg-white p-6 border-b border-gray-200">
        <div className="header-top mb-4">
          <button className="back-btn bg-transparent border-none text-gray-500 text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-all" onClick={() => navigate(-1)}>← Investment Portfolio</button>
        </div>
        <div className="header-content">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight md:text-xl">Investment Portfolio</h1>
          <p className="text-base text-gray-500 mb-5 leading-snug">View your investment holdings, performance, and portfolio summary</p>
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
          <span>Portfolio Report</span>
          <button className="filter-btn bg-transparent border border-gray-300 text-purple-600 text-sm flex items-center gap-1.5 py-1.5 px-3 rounded-md hover:bg-gray-50 hover:border-purple-600 transition-all">🔽 Filter</button>
        </div>
      </div>

      <div className="invest-content flex-1 overflow-y-auto bg-gray-50">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default Invest;