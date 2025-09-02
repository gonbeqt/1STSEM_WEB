import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import '../Assets/Assets.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';


// Types
interface LiabilitiesItem {
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

const Liabilities: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const navigation = useNavigate();
  const totalEarnings = '$245,000';

  const liabilities: LiabilitiesItem[] = [
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
       <div className="header4">
        <button className="back-button" onClick={() => navigation(-1)} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Your Liabilities</h1>
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
            {liabilities.map((asset, index) => (
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
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
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

export default Liabilities;
