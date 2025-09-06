import React from 'react';

interface PayrollCardProps {
  amount: string;
  employees: string;
  totalLastMonth: string;
  nextPayroll: string;
}

const PayrollCard: React.FC<PayrollCardProps> = ({ amount, employees, totalLastMonth, nextPayroll }) => {
  return (
    <div className="payroll-card">
      <div className="payroll-left">
        <div className="payroll-amount-container">
          <span className="payroll-icon">💰</span>
          <span className="payroll-amount3">{amount}</span>
        </div>
        <span className="payroll-employees">{employees}</span>
      </div>
      <div className="payroll-right">
        <span className="payroll-total">Total Last Month: {totalLastMonth}</span>
        <span className="payroll-next">Next Payroll on {nextPayroll}</span>
      </div>
    </div>
  );
};

export default PayrollCard;