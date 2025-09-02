import React, { useState } from 'react';
import './reports.css';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BalanceSheetData {
  assets: string;
  liabilities: string;
  equity: string;
}

interface PayrollData {
  amount: string;
  period: string;
}

interface GeneralReportsData {
  netCashFlow: string;
  chartData: { month: string; value: number ,value2: number}[];
}

interface FinancialSummaryProps {
  onBack?: () => void;
  onDownloadPDF?: () => void;
}

const Reports: React.FC<FinancialSummaryProps> = ({  onDownloadPDF }) => {
  const navigation = useNavigate();
  const handleBalanceSheet = () => {
    navigation('/balance_sheet');
  };
  const [activeTimeframe, setActiveTimeframe] = useState<string>('7 Days');

  const timeframes = ['7 Days', '28 Days', '90 Days', '365 Days'];

  const balanceSheetData: BalanceSheetData = {
    assets: '$249k',
    liabilities: '$349k',
    equity: '$249k'
  };

  const payrollData: PayrollData = {
    amount: '$5,600',
    period: 'Latest Net Pay'
  };

  const generalReportsData: GeneralReportsData = {
    netCashFlow: '+$2,600',
    chartData: [
      { month: 'Jan', value: 20 ,value2: 20},
      { month: 'Feb', value: 45,value2: 20 },
      { month: 'Mar', value: 30,value2: 20 },
      { month: 'Apr', value: 60 ,value2: 20},
      { month: 'May', value: 40 ,value2: 20},
      { month: 'Jun', value: 70 ,value2: 20},
      { month: 'Jul', value: 35 ,value2: 20},
      { month: 'Aug', value: 55 ,value2: 20},
      { month: 'Sep', value: 25 ,value2: 20},
      { month: 'Oct', value: 50,value2: 20 },
      { month: 'Nov', value: 40 ,value2: 20},
      { month: 'Dec', value: 65,value2: 20 },
    ]
  };

  return (
    <div className="financial-summary-container">
      <div className="financial-summary-card">
        {/* Header */}
        <div className="header">
          <button className="back-button" onClick={() => navigation(-1)} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="header-content">
            
            <h1 className="header-title">Financial Summary</h1>
          </div>
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
        <div className="summary-content">
          {/* Balance Sheet */}
          <div className="summary-section">
            <div className="section-header">
              <h3 className="section-title">Balance Sheet</h3>
            </div>

            <div className="balance-sheet-metrics">
              <div className="metric-item">
                <div className="metric-value-container">
                  <span className="metric-label">Quick Ratio</span>
                  <span className="metric-value">1.8</span>
                </div>

                <button className="view-details-btn" onClick={handleBalanceSheet}>View Details</button>

              </div>
            </div>

            <div className="balance-sheet-grid">
              <div className="balance-item">
                <span className="balance-label">Assets</span>
                <span className="balance-value">{balanceSheetData.assets}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Liabilities</span>
                <span className="balance-value">{balanceSheetData.liabilities}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Equity</span>
                <span className="balance-value">{balanceSheetData.equity}</span>
              </div>
            </div>
          </div>

          {/* Risk Alert */}
          <div className="summary-section">
            <h3 className="section-title">Risk Alert</h3>
            <div className="risk-alert">
              <div className="risk-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10.29 3.86L1.82 18A2 2 0 003.64 21H20.36A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="risk-content">
                <p className="risk-title">Warning</p>
                <p className="risk-description">Payment from Client X decreased for 2 consecutive months</p>
              </div>
            </div>
          </div>

          {/* Salary/Payslip */}
          <div className="summary-section">
            <div className="section-header">
              <h3 className="section-title">Salary / Payslip</h3>
              <button className="view-details-btn">View Details</button>
            </div>

            <div className="payroll-info">
              <p className="payroll-label">{payrollData.period}</p>
              <p className="payroll-amount">{payrollData.amount}</p>
            </div>

            {/* Simple line chart representation */}
            <div className="chart-container">
              <svg className="line-chart" viewBox="0 0 300 60">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  points="0,40 25,30 50,45 75,25 100,35 125,20 150,40 175,30 200,45 225,25 250,35 275,20 300,30"
                />
              </svg>
            </div>
          </div>

          {/* General Reports */}
          <div className="summary-section">
            <div className="section-header">
              <h3 className="section-title">General Reports</h3>
              <button className="view-details-btn">View Details</button>
            </div>

            <div className="cash-flow-info">
              <p className="cash-flow-label">Net Cash Flow</p>
              <p className="cash-flow-amount positive">{generalReportsData.netCashFlow}</p>
            </div>

            {/* Bar Chart */}
            <div className="bar-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={generalReportsData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Cash In" />
                  <Bar dataKey="value2" fill="#8884d8" name="Cash Out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="download-section">
          <button className="download-button" onClick={onDownloadPDF}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
