import React, { useState } from 'react';
import { ChevronLeft, Download, Copy } from 'lucide-react';
import './payslip.css';

interface PayslipItem {
  label: string;
  amount: string;
  usdValue: string;
  type?: 'deduction' | 'earning';
}

interface PayslipData {
  period: string;
  status: 'complete' | 'pending';
  grossSalary: {
    amount: string;
    usdValue: string;
  };
  deductions: PayslipItem[];
  netSalary: {
    amount: string;
    usdValue: string;
  };
  transactionHash: string;
}

interface PayslipProps {
  onBack?: () => void;
  hasPayslip?: boolean;
  payslipData?: PayslipData;
}

const EmployeePayslip: React.FC<PayslipProps> = ({ 
  hasPayslip = true, 
  payslipData 
}) => {
  const [showNoPayslip, setShowNoPayslip] = useState(!hasPayslip);

  const defaultPayslipData: PayslipData = {
    period: 'May 01 - May 31',
    status: 'complete',
    grossSalary: {
      amount: '0.55 ETH',
      usdValue: '$1,045.00 USD'
    },
    deductions: [
      {
        label: 'Income Tax',
        amount: '0.11 ETH',
        usdValue: '$209.00 USD',
        type: 'deduction'
      },
      {
        label: 'Health Insurance',
        amount: '0.0275 ETH',
        usdValue: '$52.25 USD',
        type: 'deduction'
      },
      {
        label: 'Retirement Fund',
        amount: '0.0385 ETH',
        usdValue: '$73.15 USD',
        type: 'deduction'
      },
      {
        label: 'Social Security',
        amount: '0.0385 ETH',
        usdValue: '$73.15 USD',
        type: 'deduction'
      },
      {
        label: 'Medicare',
        amount: '0.0275 ETH',
        usdValue: '$52.25 USD',
        type: 'deduction'
      }
    ],
    netSalary: {
      amount: '0.55 ETH',
      usdValue: '$1,045.00 USD'
    },
    transactionHash: '0x8D2...458'
  };

  const currentData = payslipData || defaultPayslipData;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePayslipView = () => {
    setShowNoPayslip(!showNoPayslip);
  };

  if (showNoPayslip) {
    return (
      <div className="payslip-container">
        {/* Header */}
        <div className="payslip-header">
        
          <h1 className="page-title">Payslip</h1>
          <div className="header-spacer"></div>
        </div>

        {/* No Payslip Message */}
        <div className="no-payslip-container">
          <div className="no-payslip-card">
            <div className="no-payslip-icon">📄</div>
            <h2 className="no-payslip-title">No Payslip Available</h2>
            <p className="no-payslip-message">
              There is currently no payslip available to claim. 
              Please wait for your scheduled payment period.
            </p>
            <div className="no-payslip-note">
              Your next payslip will be available according to your payment schedule.
            </div>
          </div>
        </div>

        {/* Toggle button for demo */}
        <button className="demo-toggle" onClick={togglePayslipView}>
          Show Payslip Demo
        </button>
      </div>
    );
  }

  return (
    <div className="payslip-container">
      {/* Header */}
      <div className="payslip-header">
    
        <h1 className="page-title">Payslip</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Payslip Content */}
      <div className="payslip-content">
        {/* Period Info */}
        <div className="period-card">
          <div className="period-info">
            <div className="period-header">
              <div className="period-label">Crypto Tech Solutions</div>
              <div className={`status-badge ${currentData.status}`}>
                {currentData.status === 'complete' ? 'Complete' : 'Pending'}
              </div>
            </div>
            <div className="period-date">Payment Period - {currentData.period}</div>
            <div className="period-address">0x234...abc123</div>
          </div>
          <button className="confirm-salary-btn">
            <div className="confirm-icon">✓</div>
            Confirm Salary Receipt
          </button>
        </div>

        {/* Gross Salary */}
        <div className="salary-section">
          <div className="section-title">Gross Salary</div>
          <div className="amount-display">
            <div className="amount">{currentData.grossSalary.amount}</div>
            <div className="usd-value">{currentData.grossSalary.usdValue}</div>
          </div>
        </div>

        {/* Deductions */}
        <div className="deductions-section">
          <div className="section-title">Deductions</div>
          <div className="deductions-list">
            {currentData.deductions.map((deduction, index) => (
              <div key={index} className="deduction-item">
                <div className="deduction-label">{deduction.label}</div>
                <div className="deduction-amounts">
                  <div className="deduction-amount">{deduction.amount}</div>
                  <div className="deduction-usd">{deduction.usdValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Net Salary */}
        <div className="net-salary-section">
          <div className="section-title">Net Salary</div>
          <div className="amount-display">
            <div className="amount">{currentData.netSalary.amount}</div>
            <div className="usd-value">{currentData.netSalary.usdValue}</div>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="transaction-section">
          <div className="transaction-label">Transaction Hash</div>
          <div className="transaction-hash">
            <span>{currentData.transactionHash}</span>
            <button className="copy-btn" onClick={() => handleCopy(currentData.transactionHash)}>
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Download Button */}
        <button className="download-btn">
          <Download size={18} />
          Download PDF
        </button>

        {/* Toggle button for demo */}
        <button className="demo-toggle" onClick={togglePayslipView}>
          Show No Payslip State
        </button>
      </div>
    </div>
  );
};

export default EmployeePayslip;