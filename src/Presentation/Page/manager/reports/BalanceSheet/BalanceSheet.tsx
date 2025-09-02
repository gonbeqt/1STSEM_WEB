import React, { useState } from 'react';
import './BalanceSheet.css';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartDataPoint {
  month: string;
  assets: number;
  liabilities: number;
  equity: number;
}

interface BalanceSheetData {
  quickRatio: number;
  quickRatioChange: string;
  totalAssets: string;
  totalLiabilities: string;
  totalEquity: string;
  assetsChange: string;
  liabilitiesChange: string;
  equityChange: string;
  chartData: ChartDataPoint[];
  lineChartData: number[];
}

interface BalanceSheetProps {
  onBack?: () => void;
  onExportToExcel?: () => void;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ onExportToExcel }) => {
  const navigation = useNavigate();
  const handleAssets = () => {
    navigation('/assets');
  }
  const handleLiabilities = () => {
    navigation('/liabilities');
  }
  const handleEquity = () => {
    navigation('/equity');
  }
  const [activeTimeframe, setActiveTimeframe] = useState<string>('Today');

  const timeframes = ['Today', 'Yesterday', '7D', 'Custom'];

  const balanceData: BalanceSheetData = {
    quickRatio: 1.8,
    quickRatioChange: '+8.5 from last month',
    totalAssets: '$245,000',
    totalLiabilities: '$122,000',
    totalEquity: '$123,000',
    assetsChange: '+8.5% from last month',
    liabilitiesChange: '+8.5% from last month',
    equityChange: '+8.5% from last month',
    chartData: [
      { month: 'Jan', assets: 220, liabilities: 110, equity: 100 },
      { month: 'Feb', assets: 240, liabilities: 120, equity: 110 },
      { month: 'Mar', assets: 210, liabilities: 100, equity: 95 },
      { month: 'Apr', assets: 250, liabilities: 125, equity: 115 },
      { month: 'May', assets: 230, liabilities: 115, equity: 105 },
      { month: 'Jun', assets: 260, liabilities: 130, equity: 120 },
    ],
    lineChartData: [1.5, 1.6, 1.4, 1.7, 1.6, 1.8, 1.7, 1.9, 1.8, 2.0, 1.9, 1.8]
  };

  const lineChartData = balanceData.chartData.map((item, index) => ({
    month: item.month,
    quickRatio: balanceData.lineChartData[index]
  }));

  return (
    <div className="balance-sheet-container">
      <div className="balance-sheet-card">
        {/* Header */}
        <div className="header4">
        <button className="back-button" onClick={() => navigation(-1)} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Balance Sheet</h1>
      </div>

        {/* Timeframe Selector */}
        <div className="timeframe-selector">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              className={`timeframe-button ${activeTimeframe === timeframe ? 'active' : ''}`}
              onClick={() => setActiveTimeframe(timeframe)}
            >
              {timeframe}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="balance-content">
          {/* Quick Ratio Section */}
          <div className="quick-ratio-section">
            <h3 className="section-subtitle">Quick Ratio</h3>
            <div className="quick-ratio-card">
              <div className="ratio-header">
                <div className="ratio-value">{balanceData.quickRatio}</div>
                <div className="ratio-period">
                  <span className="period-label">1M</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <p className="ratio-change">{balanceData.quickRatioChange}</p>

              {/* Line Chart */}
              <div className="line-chart-container">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={lineChartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quickRatio" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Balance Overview */}
          <div className="balance-overview-section">
            <h3 className="section-subtitle">Balance Overview</h3>
            <div className="bar-chart-card">
              <div className="bar-chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={balanceData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="assets" fill="#82ca9d" name="Assets" />
                    <Bar dataKey="liabilities" fill="#8884d8" name="Liabilities" />
                    <Bar dataKey="equity" fill="#ffc658" name="Equity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card" onClick={handleAssets}>
              <h4 className="card-title">Total Assets</h4>
              <p className="card-amount">{balanceData.totalAssets}</p>
              <p className="card-change positive">{balanceData.assetsChange}</p>
            </div>

            <div className="summary-card" onClick={handleLiabilities}>
              <h4 className="card-title">Total Liabilities</h4>
              <p className="card-amount">{balanceData.totalLiabilities}</p>
              <p className="card-change positive">{balanceData.liabilitiesChange}</p>
            </div>

            <div className="summary-card" onClick={handleEquity}>
              <h4 className="card-title">Total Equity</h4>
              <p className="card-amount">{balanceData.totalEquity}</p>
              <p className="card-change positive">{balanceData.equityChange}</p>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="export-section">
          <button className="export-button" onClick={onExportToExcel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;