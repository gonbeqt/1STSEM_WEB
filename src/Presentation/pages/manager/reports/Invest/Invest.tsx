// Invest.tsx - Backend Connected
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import './Invest.css';
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
  
  // State for portfolio data and UI
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

  // Load portfolio data on component mount
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

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text();
        throw new Error(`Server returned HTML error page (${response.status}). Portfolio endpoint may not be available.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch portfolio data`);
      }

      // Handle the actual response format from /api/portfolio/value/ endpoint
      if (data && typeof data.total_value !== 'undefined') {
        // Transform the portfolio value data to match expected interface
        const transformedPortfolio: PortfolioData = {
          holdings: data.breakdown ? data.breakdown.map((item: any) => ({
            symbol: item.cryptocurrency,
            name: item.cryptocurrency,
            quantity: item.amount,
            current_value: item.value,
            cost_basis: item.value, // Placeholder since this endpoint doesn't provide cost basis
            unrealized_gain_loss: 0, // Placeholder since this endpoint doesn't provide gains/losses
            percentage_of_portfolio: (item.value / data.total_value) * 100
          })) : [],
          total_value: data.total_value || 0,
          total_cost_basis: data.total_value || 0, // Placeholder
          total_unrealized_gain_loss: 0, // Placeholder
          cash_balance: 0 // Placeholder
        };
        setPortfolio(transformedPortfolio);
      } else {
        throw new Error('Invalid response format from portfolio API');
      }
    } catch (err: any) {
      console.error('Portfolio fetch error:', err);
      
      // Provide more specific error messages
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
      
      // Create a simple CSV export since the backend portfolio export endpoint is not available
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

  // Chart data from real portfolio data
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
      return <div className="loading">Loading portfolio data...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (!portfolio || chartData.length === 0) {
      return <div className="no-data">No portfolio data available for chart view</div>;
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
            <h4>Portfolio Summary</h4>
            <p>Your investment portfolio shows current holdings, performance, and total value.</p>
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
      return <div className="loading">Loading portfolio...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (!portfolio) {
      return <div className="no-data">No portfolio data available</div>;
    }

    return (
      <div className="table-view">
        <div className="export-actions">
          <button className="export-excel" onClick={exportToExcel}>📊 Export To Excel</button>
        </div>

        <div className="portfolio-sections">
          {/* Holdings Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('holdings')}
            >
              <span className={`expand-arrow ${expandedSections.holdings ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Investment Holdings</span>
              <span className="section-amount">${formatCurrency(portfolio.total_value).slice(1)}</span>
            </div>
            
            {expandedSections.holdings && (
              <div className="section-content">
                {portfolio.holdings.map((holding: InvestmentHolding, index: number) => (
                  <div key={index} className="line-item">
                    <span className="item-name">
                      {holding.symbol} - {holding.name}
                      <small className="item-details">
                        {holding.quantity} shares @ {formatPercentage(holding.percentage_of_portfolio)}
                      </small>
                    </span>
                    <span className="item-amount">
                      ${formatCurrency(holding.current_value).slice(1)}
                      <small className={`gain-loss ${
                        holding.unrealized_gain_loss >= 0 ? 'gain' : 'loss'
                      }`}>
                        {holding.unrealized_gain_loss >= 0 ? '+' : ''}
                        ${formatCurrency(holding.unrealized_gain_loss).slice(1)}
                      </small>
                    </span>
                  </div>
                ))}
                <div className="subsection-total-line">
                  <span>Total Holdings Value</span>
                  <span>${formatCurrency(portfolio.total_value).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Performance Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('performance')}
            >
              <span className={`expand-arrow ${expandedSections.performance ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Performance</span>
              <span className="section-amount">
                {portfolio.total_unrealized_gain_loss >= 0 ? '+' : ''}
                ${formatCurrency(portfolio.total_unrealized_gain_loss).slice(1)}
              </span>
            </div>
            
            {expandedSections.performance && (
              <div className="section-content">
                <div className="line-item">
                  <span className="item-name">Total Cost Basis</span>
                  <span className="item-amount">${formatCurrency(portfolio.total_cost_basis).slice(1)}</span>
                </div>
                <div className="line-item">
                  <span className="item-name">Current Market Value</span>
                  <span className="item-amount">${formatCurrency(portfolio.total_value).slice(1)}</span>
                </div>
                <div className="line-item">
                  <span className="item-name">Cash Balance</span>
                  <span className="item-amount">${formatCurrency(portfolio.cash_balance).slice(1)}</span>
                </div>
                <div className="subsection-total-line">
                  <span>Total Unrealized Gain/Loss</span>
                  <span className={portfolio.total_unrealized_gain_loss >= 0 ? 'gain' : 'loss'}>
                    {portfolio.total_unrealized_gain_loss >= 0 ? '+' : ''}
                    ${formatCurrency(portfolio.total_unrealized_gain_loss).slice(1)}
                  </span>
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
              <span className="section-title">Portfolio Summary</span>
              <span className="section-amount">
                ${formatCurrency(portfolio.total_value + portfolio.cash_balance).slice(1)}
              </span>
            </div>
            
            {expandedSections.summary && (
              <div className="section-content">
                <div className="line-item">
                  <span className="item-name">Total Investment Value</span>
                  <span className="item-amount">${formatCurrency(portfolio.total_value).slice(1)}</span>
                </div>
                <div className="line-item">
                  <span className="item-name">Available Cash</span>
                  <span className="item-amount">${formatCurrency(portfolio.cash_balance).slice(1)}</span>
                </div>
                <div className="line-item">
                  <span className="item-name">Number of Holdings</span>
                  <span className="item-amount">{portfolio.holdings.length}</span>
                </div>
                <div className="subsection-total-line">
                  <span>Total Portfolio Value</span>
                  <span>${formatCurrency(portfolio.total_value + portfolio.cash_balance).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="totals-section">
            <div className="total-line">
              <span>Investment Holdings</span>
              <span>${formatCurrency(portfolio.total_value).slice(1)}</span>
            </div>
            <div className="total-line">
              <span>Cash Balance</span>
              <span>${formatCurrency(portfolio.cash_balance).slice(1)}</span>
            </div>
            <div className="total-line balance-check">
              <span>Total Portfolio Value</span>
              <span>${formatCurrency(portfolio.total_value + portfolio.cash_balance).slice(1)}</span>
            </div>
            <div className="balance-status">
              ✓ Portfolio data loaded successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="invest-container">
      <div className="invest-header">
        <div className="header-top">
          <button className="back-btn" onClick={()=> navigate(-1)}>← Investment Portfolio</button>
        </div>
        <div className="header-content">
          <h1>Investment Portfolio</h1>
          <p>View your investment holdings, performance, and portfolio summary</p>
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
          <span>Portfolio Report</span>
          <button className="filter-btn">🔽 Filter</button>
        </div>
      </div>

      <div className="invest-content">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default Invest;