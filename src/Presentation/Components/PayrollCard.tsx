// src/Presentation/Components/PayrollCard.tsx
import React from 'react';

interface PayrollCardProps {
  amount: string;
  employees: string;
  totalLastMonth: string;
  nextPayroll: string;
}

const PayrollCard: React.FC<PayrollCardProps> = ({ amount, employees, totalLastMonth, nextPayroll }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-bold text-gray-900">{amount}</span>
        </div>
        <span className="text-gray-600">{employees}</span>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-600 mb-1">Total Last Month: {totalLastMonth}</div>
        <div className="text-sm text-gray-600">Next Payroll on {nextPayroll}</div>
      </div>
    </div>
  );
};

export default PayrollCard;
