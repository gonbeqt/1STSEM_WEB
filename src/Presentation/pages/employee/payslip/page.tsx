import React, { useState } from 'react';
import { Download, Copy, Check, ArrowLeft } from 'lucide-react';
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
  employerName: string;
  employerAddress: string;
}

interface PayslipProps {
  onBack?: () => void;
  hasPayslip?: boolean;
  payslipData?: PayslipData;
}

const EmployeePayslip: React.FC<PayslipProps> = ({ 
  onBack,
  hasPayslip = true, 
  payslipData 
}) => {
  const [showNoPayslip, setShowNoPayslip] = useState(!hasPayslip);
  const [copied, setCopied] = useState(false);
  const [salaryConfirmed, setSalaryConfirmed] = useState(false);

  const defaultPayslipData: PayslipData = {
    period: 'May 01 - May 31, 2024',
    status: 'complete',
    employerName: 'Crypto Tech Solutions',
    employerAddress: '0x2341231hjf671231abc123def456',
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
      amount: '0.285 ETH',
      usdValue: '$541.75 USD'
    },
    transactionHash: '0x8D283284FS2458A9B7C1D2E3F4567890ABCDEF12'
  };

  const currentData = payslipData || defaultPayslipData;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadPDF = () => {
    // Implement PDF download logic here
    console.log('Downloading PDF...');
    // You would typically generate and download the PDF here
  };

  const handleConfirmSalary = () => {
    setSalaryConfirmed(true);
    // Implement confirmation logic here
    console.log('Salary receipt confirmed');
  };

  const togglePayslipView = () => {
    setShowNoPayslip(!showNoPayslip);
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (showNoPayslip) {
    return (
      <div className="payslip-container">
        {/* Header */}
        <div className="payslip-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="page-title">Payslip</h1>
          <div className="header-spacer"></div>
        </div>

        {/* No Payslip Message */}
        <div className="no-payslip-container">
          <div className="no-payslip-card">
            <div className="no-payslip-icon">
              <div className="payslip-illustration">📄</div>
            </div>
            <h2 className="no-payslip-title">No Payslip Available</h2>
            <p className="no-payslip-message">
              There is currently no payslip available to claim. 
              Please wait for your scheduled payment period.
            </p>
            <div className="no-payslip-note">
              <div className="note-icon">ℹ️</div>
              <span>Your next payslip will be available according to your payment schedule.</span>
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
        {onBack && (
          <button className="back-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="page-title">Payslip</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Payslip Content */}
      <div className="payslip-content">
        {/* Period Card */}
        <div className="period-card">
          <div className="period-background-decoration"></div>
          <div className="period-info">
            <div className="period-header">
              <div className="period-label">{currentData.employerName}</div>
              <div className={`status-badge ${currentData.status}`}>
                <div className={`status-dot ${currentData.status}`}></div>
                {currentData.status === 'complete' ? 'Complete' : 'Pending'}
              </div>
            </div>
            <div className="period-date">Payment Period - {currentData.period}</div>
            <div className="period-address">
              <span className="address-label">Employer Address:</span>
              <span className="address-value">{formatAddress(currentData.employerAddress)}</span>
            </div>
          </div>
          <button 
            className={`confirm-salary-btn ${salaryConfirmed ? 'confirmed' : ''}`}
            onClick={handleConfirmSalary}
            disabled={salaryConfirmed}
          >
            <div className="confirm-icon">
              {salaryConfirmed ? <Check size={16} /> : '✓'}
            </div>
            {salaryConfirmed ? 'Salary Confirmed' : 'Confirm Salary Receipt'}
          </button>
        </div>

        {/* Gross Salary */}
        <div className="salary-section">
          <div className="section-header">
            <div className="section-icon">💰</div>
            <div className="section-title">Gross Salary</div>
          </div>
          <div className="amount-display">
            <div className="amount">{currentData.grossSalary.amount}</div>
            <div className="usd-value">{currentData.grossSalary.usdValue}</div>
          </div>
        </div>

        {/* Deductions */}
        <div className="deductions-section">
          <div className="section-header">
            <div className="section-icon">📋</div>
            <div className="section-title">Deductions</div>
          </div>
          <div className="deductions-list">
            {currentData.deductions.map((deduction, index) => (
              <div key={index} className="deduction-item">
                <div className="deduction-info">
                  <div className="deduction-label">{deduction.label}</div>
                </div>
                <div className="deduction-amounts">
                  <div className="deduction-amount">-{deduction.amount}</div>
                  <div className="deduction-usd">-{deduction.usdValue}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Deductions */}
          <div className="total-deductions">
            <div className="total-label">Total Deductions</div>
            <div className="total-amounts">
              <div className="total-amount">
                -{currentData.deductions.reduce((sum, item) => {
                  const ethValue = parseFloat(item.amount.replace(' ETH', ''));
                  return sum + ethValue;
                }, 0).toFixed(4)} ETH
              </div>
              <div className="total-usd">
                -${currentData.deductions.reduce((sum, item) => {
                  const usdValue = parseFloat(item.usdValue.replace('$', '').replace(' USD', ''));
                  return sum + usdValue;
                }, 0).toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="net-salary-section">
          <div className="section-header">
            <div className="section-icon">💸</div>
            <div className="section-title">Net Salary</div>
          </div>
          <div className="amount-display">
            <div className="amount">{currentData.netSalary.amount}</div>
            <div className="usd-value">{currentData.netSalary.usdValue}</div>
          </div>
          <div className="net-salary-note">
            This is the amount you will receive after all deductions.
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="transaction-section">
          <div className="section-header">
            <div className="section-icon">🔗</div>
            <div className="transaction-label">Transaction Hash</div>
          </div>
          <div className="transaction-hash">
            <span className="hash-value">{currentData.transactionHash}</span>
            <button 
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={() => handleCopy(currentData.transactionHash)}
              aria-label="Copy transaction hash"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="transaction-note">
            Click to view transaction details on blockchain explorer
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="download-btn" onClick={handleDownloadPDF}>
            <Download size={18} />
            Download PDF
          </button>
        </div>

        {/* Toggle button for demo */}
        <button className="demo-toggle" onClick={togglePayslipView}>
          Show No Payslip State
        </button>
      </div>
    </div>
  );
};

export default EmployeePayslip;