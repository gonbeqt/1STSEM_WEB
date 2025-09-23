import React, { useState } from 'react';
import { Download, Copy, Check, ArrowLeft } from 'lucide-react';
import './payslip.css';
import { usePayslips } from '../../../hooks/usePayslips'; // Keep for potential future use or if payslipData is not provided
import { Payslip } from '../../../../domain/entities/PayslipEntities';

interface PayslipProps {
  onBack?: () => void;
  payslipData?: Payslip; // New prop to receive payslip data
}

const EmployeePayslip: React.FC<PayslipProps> = ({
  onBack,
  payslipData // Destructure payslipData prop
}) => {
  // If payslipData is provided, use it. Otherwise, fetch from hook (or handle no data)
  const { payslips, loading, error } = usePayslips(payslipData ? payslipData.employee_id : undefined); // Fetch if payslipData not provided
  const [copied, setCopied] = useState(false);
  const [salaryConfirmed, setSalaryConfirmed] = useState(false);

  const currentPayslip: Payslip | undefined = payslipData || payslips[0]; // Use prop data first, then fetched data
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

  const handleConfirmSalary = async () => {
    if (!currentPayslip) return;

    try {
      // Assuming a backend API endpoint for updating payslip status
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/payslips/${currentPayslip.id}/status/`, {
        method: 'PUT', // Or POST, depending on your API design
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
        body: JSON.stringify({ status: 'paid' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payslip status');
      }

      // Update the local state to reflect the new status
      // This is a simplified update. In a real app, you might re-fetch the payslip
      // or update the payslip object in a global state management solution.
      setSalaryConfirmed(true);
      currentPayslip.status = 'paid'; // Directly modify the object for immediate UI update

      console.log('Payslip status updated to paid:', currentPayslip.id);
    } catch (error) {
      console.error('Error confirming salary receipt:', error);
      alert(`Failed to confirm salary receipt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // If payslipData is provided, we don't need to show loading/error from hook
  if (!payslipData && loading) {
    return (
      <div className="payslip-container">
        <div className="payslip-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="page-title">Payslip</h1>
          <div className="header-spacer"></div>
        </div>
        <div className="loading-message">Loading payslips...</div>
      </div>
    );
  }

  if (!payslipData && error) {
    return (
      <div className="payslip-container">
        <div className="payslip-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="page-title">Payslip</h1>
          <div className="header-spacer"></div>
        </div>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  if (!currentPayslip) {
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
              There is currently no payslip available.
            </p>
            <div className="no-payslip-note">
              <div className="note-icon">ℹ️</div>
              <span>Your next payslip will be available according to your payment schedule.</span>
            </div>
          </div>
        </div>
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
              <div className="period-label">Employer Name (Placeholder)</div> {/* Employer name is not in Payslip entity */}
              <div className={`status-badge ${currentPayslip.status}`}>
                <div className={`status-dot ${currentPayslip.status}`}></div>
                {currentPayslip.status === 'paid' ? 'Complete' : 'Pending'}
              </div>
            </div>
            <div className="period-date">Payment Period - {currentPayslip.pay_period_start} - {currentPayslip.pay_period_end}</div>
            <div className="period-address">
              <span className="address-label">Employee ID:</span>
              <span className="address-value">{currentPayslip.employee_id}</span>
            </div>
          </div>

        </div>

        {/* Gross Salary */}
        <div className="salary-section">
          <div className="section-header">
            <div className="section-icon">💰</div>
            <div className="section-title">Gross Salary</div>
          </div>
          <div className="amount-display">
            <div className="amount">{currentPayslip.gross_salary} ETH</div>
            <div className="usd-value">${(currentPayslip.gross_salary * 1900).toFixed(2)} USD</div> {/* Assuming 1 ETH = 1900 USD for now */}
          </div>
        </div>

        {/* Deductions */}
        <div className="deductions-section">
          <div className="section-header">
            <div className="section-icon">📋</div>
            <div className="section-title">Deductions</div>
          </div>
          <div className="deductions-list">
            {/* For now, we'll show a generic deduction as the Payslip entity doesn't have a detailed deductions array */}
            <div className="deduction-item">
              <div className="deduction-info">
                <div className="deduction-label">Total Deductions</div>
              </div>
              <div className="deduction-amounts">
                <div className="deduction-amount">-{currentPayslip.deductions} ETH</div>
                <div className="deduction-usd">-${(currentPayslip.deductions * 1900).toFixed(2)} USD</div>
              </div>
            </div>
          </div>
          
          {/* Total Deductions */}
          <div className="total-deductions">
            <div className="total-label">Total Deductions</div>
            <div className="total-amounts">
              <div className="total-amount">
                -{currentPayslip.deductions} ETH
              </div>
              <div className="total-usd">
                -${(currentPayslip.deductions * 1900).toFixed(2)} USD
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
            <div className="amount">{currentPayslip.net_salary} ETH</div>
            <div className="usd-value">${(currentPayslip.net_salary * 1900).toFixed(2)} USD</div>
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
            <span className="hash-value">N/A</span> {/* Transaction hash is not in Payslip entity */}
            <button 
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={() => handleCopy('N/A')}
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
      </div>
    </div>
  );
};

export default EmployeePayslip;