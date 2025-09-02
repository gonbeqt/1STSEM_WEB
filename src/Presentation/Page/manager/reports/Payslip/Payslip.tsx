import React, { useState } from 'react';
import './Payslip.css';
import { useNavigate } from 'react-router';

interface PayslipData {
  name: string;
  position: string;
  grossPay: number;
  deductions: {
    incomeTax: number;
    socialSecurity: number;
    medicare: number;
    retirementPlan: number;
    healthInsurance: number;
  };
  netPay: number;
}

interface SalaryData {
  ytdEarnings: number;
  ytdDeductions: number;
  currentNetPay: number;
  salaryHistory: Array<{ month: string; amount: number }>;
}

const Payslip: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Today' | 'Yesterday' | '7D' | 'Custom'>('Today');
  
  const salaryData: SalaryData = {
    ytdEarnings: 33600,
    ytdDeductions: 11352,
    currentNetPay: 5600,
    salaryHistory: [
      { month: 'Feb', amount: 5100 },
      { month: 'Mar', amount: 5200 },
      { month: 'Apr', amount: 5300 },
      { month: 'May', amount: 5400 },
      { month: 'Jun', amount: 5500 },
      { month: 'Jul', amount: 5550 },
      { month: 'Aug', amount: 5600 },
      { month: 'Sep', amount: 5650 },
      { month: 'Oct', amount: 5700 },
      { month: 'Nov', amount: 5750 },
      { month: 'Dec', amount: 5800 }
    ]
  };

  const payslipData: PayslipData[] = [
    {
      name: 'John Doe',
      position: 'Senior Accountant',
      grossPay: 7000,
      deductions: {
        incomeTax: 1050,
        socialSecurity: 210,
        medicare: 102,
        retirementPlan: 350,
        healthInsurance: 180
      },
      netPay: 5108
    },
    {
      name: 'John Doe',
      position: 'Senior Accountant',
      grossPay: 7000,
      deductions: {
        incomeTax: 1050,
        socialSecurity: 210,
        medicare: 102,
        retirementPlan: 350,
        healthInsurance: 180
      },
      netPay: 5108
    }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

const calculateDeductionPercentage = (deductions: number, earnings: number): string => {
  return `${((deductions / earnings) * 100).toFixed(1)}% of gross pay`;
};

const generatePolylinePoints = (data: Array<{ month: string; amount: number }>): string => {
    return data
      .map(
        (point, index) =>
          `${20 + index * 30},${200 - (point.amount - 4000) / 20}`
      )
      .join(' ');
  };

  const navigate = useNavigate();
  return (
    <div className="salary-payslip-container">
      
      {/* Header */}
      <div className="header4">
        <button className="back-button" onClick={() => navigate(-1)} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Salary & Payslip</h1>
      </div>

      {/* Time Period Tabs */}
      <div className="time-tabs">
        {(['Today', 'Yesterday', '7D', 'Custom'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Custom' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* YTD Summary Cards */}
      <div className="ytd-summary">
        <div className="ytd-card">
          <h3>YTD Earnings</h3>
          <div className="ytd-amount">{formatCurrency(salaryData.ytdEarnings)}</div>
          <div className="ytd-change">+$400 from last month</div>
        </div>
        <div className="ytd-card">
          <h3>YTD Deductions</h3>
          <div className="ytd-amount">{formatCurrency(salaryData.ytdDeductions)}</div>
          <div className="ytd-change">
            {calculateDeductionPercentage(salaryData.ytdDeductions, salaryData.ytdEarnings)}
          </div>
        </div>
      </div>

      {/* Salary History Chart */}
      <div className="salary-history">
        <div className="chart-header">
          <h3>Salary History</h3>
          <div className="current-pay">
            <span>Current Net Pay</span>
            <span className="pay-amount">{formatCurrency(salaryData.currentNetPay)}</span>
            <button className="period-selector">
              12M
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="chart-container">
          <div className="chart-grid">
            {[6000, 5500, 5000, 4500, 4000].map((value) => (
              <div key={value} className="grid-line">
                <span className="grid-label">${value}</span>
              </div>
            ))}
          </div>
          <svg className="chart-svg" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="salaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <polyline
              points={generatePolylinePoints(salaryData.salaryHistory.slice(-11))}
              fill="none"
              stroke="url(#salaryGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {salaryData.salaryHistory.slice(-11).map((point, index) => (
              <circle
                key={index}
                cx={20 + index * 30}
                cy={200 - (point.amount - 4000) / 20}
                r="4"
                fill="#8B5CF6"
              />
            ))}
          </svg>
          <div className="chart-months">
            {salaryData.salaryHistory.slice(-11).map((point) => (
              <span key={point.month} className="month-label">{point.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Payslips */}
      <div className="payslips-section">
        <h3>Employee Payslip</h3>
        {payslipData.map((payslip, index) => (
          <div key={index} className="payslip-card">
            <div className="payslip-header">
              <div className="employee-info">
                <h4>{payslip.name}</h4>
                <p>{payslip.position}</p>
              </div>
              <button className="export-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Export PDF
              </button>
            </div>

            <div className="payslip-details">
              <div className="pay-item gross-pay">
                <span>Gross Pay</span>
                <span>{formatCurrency(payslip.grossPay)}</span>
              </div>

              <div className="deductions-section">
                <h5>Deductions</h5>
                <div className="pay-item">
                  <span>Income Tax</span>
                  <span>-${payslip.deductions.incomeTax}</span>
                </div>
                <div className="pay-item">
                  <span>Social Security</span>
                  <span>-${payslip.deductions.socialSecurity}</span>
                </div>
                <div className="pay-item">
                  <span>Medicare</span>
                  <span>-${payslip.deductions.medicare}</span>
                </div>
                <div className="pay-item">
                  <span>Retirement Plan</span>
                  <span>-${payslip.deductions.retirementPlan}</span>
                </div>
                <div className="pay-item">
                  <span>Health Insurance</span>
                  <span>-${payslip.deductions.healthInsurance}</span>
                </div>
              </div>

              <div className="pay-item net-pay">
                <span>Net Pay</span>
                <span>{formatCurrency(payslip.netPay)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payslip;