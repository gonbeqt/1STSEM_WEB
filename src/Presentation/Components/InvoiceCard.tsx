import React from 'react';

interface InvoiceCardProps {
  company: string;
  date: string;
  amount: string;
  status: string;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ company, date, amount, status }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md space-x-4">
      <span className="font-semibold text-gray-900">{company}</span>
      <span className="text-sm text-gray-600">{date}</span>
      <span className="font-bold text-gray-900">{amount}</span>
      <button className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
        {status}
      </button>
    </div>
  );
};

export default InvoiceCard;