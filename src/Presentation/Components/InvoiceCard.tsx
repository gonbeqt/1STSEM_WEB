import React from 'react';

interface InvoiceCardProps {
  company: string;
  date: string;
  amount: string;
  status: string;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ company, date, amount, status }) => {
  return (
    <div className="invoice-card">
      <span className="invoice-title">{company}</span>
      <span className="invoice-date">{date}</span>
      <span className="invoice-amount">{amount}</span>
      <button className="paid-btn">{status}</button>
    </div>
  );
};

export default InvoiceCard;