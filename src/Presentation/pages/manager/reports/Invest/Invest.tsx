import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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


  const chartData = portfolio ? portfolio.holdings.map(holding => ({
    name: holding.symbol,
    value: holding.current_value,
    percentage: holding.percentage_of_portfolio,
    fill: '#8884d8'
  })) : [];


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
    if (!portfolio) {
      setError('No portfolio data to export');
      return;
    }

    try {
      // Prepare data for Excel export
      const excelData = [
        ['INVESTMENT PORTFOLIO'],
        [`As of: ${new Date().toISOString().split('T')[0]}`],
        ['Total Portfolio Value', portfolio.total_value],
        ['Total Cost Basis', portfolio.total_cost_basis],
        ['Total Unrealized G/L', portfolio.total_unrealized_gain_loss],
        ['Cash Balance', portfolio.cash_balance],
        [''],
        ['HOLDINGS', ''],
        ['Symbol', 'Name', 'Quantity', 'Current Value', 'Percentage'],
        ...portfolio.holdings.map(holding => [
          holding.symbol,
          holding.name,
          holding.quantity,
          holding.current_value,
          holding.percentage_of_portfolio
        ])
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 10 }, // Symbol
        { wch: 20 }, // Name
        { wch: 10 }, // Quantity
        { wch: 15 }, // Current Value
        { wch: 12 }  // Percentage
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Investment Portfolio');

      // Generate Excel file and save
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `InvestmentPortfolio_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {
      setError(err.message || 'Failed to export to Excel');
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

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(2)}%`;
  };

  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h4>
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
              <span className="text-gray-600">Total Portfolio Value</span>
              <span className="font-semibold text-gray-900">{formatCurrency(portfolio?.total_value || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Cost Basis</span>
              <span className="font-semibold text-gray-900">{formatCurrency(portfolio?.total_cost_basis || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Unrealized G/L</span>
              <span className="font-semibold text-gray-900">{formatCurrency(portfolio?.total_unrealized_gain_loss || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Cash Balance</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(portfolio?.cash_balance || 0)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h4>
        {portfolio ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your investment portfolio has a total value of <strong>{formatCurrency(portfolio.total_value)}</strong> 
              with <strong>{portfolio.holdings.length}</strong> holdings and a cash balance of <strong>{formatCurrency(portfolio.cash_balance)}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The portfolio shows an unrealized gain/loss of <strong>{formatCurrency(portfolio.total_unrealized_gain_loss)}</strong> 
              based on a total cost basis of <strong>{formatCurrency(portfolio.total_cost_basis)}</strong>.
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
            Loading portfolio data...
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
          onClick={fetchPortfolioData}
        >
          Refresh
        </button>
      </div>

      {/* Simple Investment Portfolio Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Portfolio Metrics */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TOTAL PORTFOLIO VALUE</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(portfolio?.total_value || 0)}</td>
            </tr>
            
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TOTAL COST BASIS</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(portfolio?.total_cost_basis || 0)}</td>
            </tr>
            
            <tr className="bg-purple-50">
              <td className="px-6 py-4 font-semibold text-gray-900">UNREALIZED G/L</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(portfolio?.total_unrealized_gain_loss || 0)}</td>
            </tr>
            
            <tr className="bg-yellow-50">
              <td className="px-6 py-4 font-semibold text-gray-900">CASH BALANCE</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(portfolio?.cash_balance || 0)}</td>
            </tr>
            
            {/* Holdings */}
            {portfolio?.holdings.slice(0, 5).map((holding, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">
                  {holding.symbol} - {holding.name}
                  <span className="text-xs text-gray-400 ml-2">({formatPercentage(holding.percentage_of_portfolio)})</span>
                </td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(holding.current_value)}</td>
              </tr>
            ))}
            
            {portfolio && portfolio.holdings.length > 5 && (
              <tr className="bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">... and {portfolio.holdings.length - 5} more holdings</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Portfolio data loaded successfully</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="investment-portfolio-container w-full min-h-screen bg-white">
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
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Investment Portfolio</h1>
        <p className="text-gray-600">
          Portfolio Report | {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading portfolio data...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            Error: {error}
            <button className="ml-4 text-red-800 underline" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        {!loading && !error && (activeView === 'chart' ? renderChartView() : renderTableView())}
      </div>
    </div>
  );
};

export default Invest;