import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import './Assets.css';
// Types
interface AssetItem {
  name: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  progress: number; // 0-100 percentage
}

interface ChartDataPoint {
  month: string;
  value: number;
}

interface InsightItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: 'positive' | 'negative';
}

const Assets: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');

  const totalEarnings = '$245,000';

  const assets: AssetItem[] = [
    {
      name: 'Wallet Balance',
      amount: '$85,000',
      change: '+2,000',
      changeType: 'positive',
      progress: 85
    },
    {
      name: 'Completed Transactions',
      amount: '$62,000',
      change: '-800',
      changeType: 'negative',
      progress: 75
    },
    {
      name: 'Rewards & Bonuses',
      amount: '$45,000',
      change: '+1,200',
      changeType: 'positive',
      progress: 60
    },
    {
      name: 'Saved Files & Data',
      amount: '$38,000',
      change: '',
      changeType: 'positive',
      progress: 45
    },
    {
      name: 'Referral Credits',
      amount: '$15,000',
      change: '-200',
      changeType: 'negative',
      progress: 20
    }
  ];

  const chartData: ChartDataPoint[] = [
    { month: 'Jan', value: 235 },
    { month: 'Feb', value: 238 },
    { month: 'Mar', value: 240 },
    { month: 'Apr', value: 242 },
    { month: 'May', value: 244 },
    { month: 'Jun', value: 245 }
  ];

  const insights: InsightItem[] = [
    {
      icon: <TrendingUp size={16} />,
      title: 'Wallet Balance Increased',
      description: 'Your wallet balance has grown by 2.4% this month, improving your liquidity position.',
      type: 'positive'
    },
    {
      icon: <TrendingUp size={16} />,
      title: 'Rewards Growth',
      description: 'Your rewards and bonuses increased by 2.7% this month from completed transactions.',
      type: 'positive'
    },
    {
      icon: <TrendingDown size={16} />,
      title: 'Completed Transactions',
      description: 'Value from completed transactions decreased slightly by 1.3% compared to last month.',
      type: 'negative'
    }
  ];



  return (
    <>


      <div className="dashboard">
        {/* Header */}
        <div className="container">
        <div className="header">
          <ArrowLeft size={24} className="back-arrow" />
          <h1 className="header-title">Your Assets</h1>
        </div>

        {/* Total Earnings */}
        <div className="total-earnings">
          <h2 className="earnings-title">Total Earnings</h2>
          <div className="earnings-amount">{totalEarnings}</div>
        </div>

        {/* Assets Breakdown */}
        <div className="section">
          <h3 className="section-title">Assets Breakdown</h3>
          <div className="assets-list">
            {assets.map((asset, index) => (
              <div key={index} className="asset-item">
                <div className="asset-info">
                  <div className="asset-name">{asset.name}</div>
                  <div className="asset-details">
                    <span className="asset-amount">{asset.amount}</span>
                    {asset.change && (
                      <span className={`asset-change ${asset.changeType}`}>
                        {asset.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"

                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assets Growth Chart */}
        <div className="section">
          <h3 className="section-title">Assets Growth</h3>
          <div className="chart-header">
            <div className="chart-info">
              <div className="chart-period-label">6-Month Change</div>
              <div className="chart-value">+$10,000 (+4.3%)</div>
            </div>
            <button className="period-selector">
              {selectedPeriod}
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="chart-container">
            <svg viewBox="0 0 350 160" className="chart-svg">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                  key={i}
                  x1="30"
                  y1={30 + i * 20}
                  x2="320"
                  y2={30 + i * 20}
                  className="chart-grid"
                />
              ))}

              {/* Y-axis labels */}
              <text x="20" y="35" fill="#9ca3af" fontSize="10" textAnchor="end">$250K</text>
              <text x="20" y="55" fill="#9ca3af" fontSize="10" textAnchor="end">$245K</text>
              <text x="20" y="75" fill="#9ca3af" fontSize="10" textAnchor="end">$240K</text>
              <text x="20" y="95" fill="#9ca3af" fontSize="10" textAnchor="end">$235K</text>
              <text x="20" y="115" fill="#9ca3af" fontSize="10" textAnchor="end">$230K</text>

              {/* Chart area */}
              <path
                d="M 30 100 L 88 85 L 146 75 L 204 65 L 262 45 L 320 30 L 320 130 L 30 130 Z"
                className="chart-area"
              />

              {/* Chart line */}
              <path
                d="M 30 100 L 88 85 L 146 75 L 204 65 L 262 45 L 320 30"
                className="chart-line"
              />

              {/* Data points */}
              {chartData.map((_, i) => {
                const x = 30 + (i * 58);
                const y = 100 - (i * 14);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    className="chart-point"
                  />
                );
              })}
            </svg>
          </div>

          <div className="chart-labels">
            {chartData.map((point, i) => (
              <span key={i} className="chart-label">{point.month}</span>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="section">
          <h3 className="section-title">Insights</h3>
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-item ${insight.type}`}>
                <div className="insight-icon-container">
                  {insight.icon}
                </div>
                <div className="insight-content">
                  <h4 className="insight-title">{insight.title}</h4>
                  <p className="insight-description">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        </div>
      </div>
    </>
  );
};

export default Assets;