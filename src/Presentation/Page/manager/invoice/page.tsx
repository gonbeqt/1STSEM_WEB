import React, { useState } from 'react';
import './invoice.css';

const invoiceData = [
  { id: 1, description: "You paid for Payroll. Please view receipt.", amount: 12950, status: "Paid" },
  { id: 2, description: "You paid for Payroll. Please view receipt.", amount: 12950, status: "Paid" },
  { id: 3, description: "You paid for Payroll. Please view receipt.", amount: 12950, status: "Paid" },
  { id: 4, description: "You paid for Payroll. Please view receipt.", amount: 12950, status: "Paid" },
];

const Invoice = () => {
  const [filter, setFilter] = useState("All");

  return (
    
    <div className="invoice-bg invoice-desktop">
      <header className="dashboard-header">
        <div className="header-left">
          <span className="menu-icon">☰</span>
          <span className="page-title">Invoice</span>
        </div>
        
      </header>
      <div className="invoice-summary">
        <div className="invoice-summary-card">
          <div className="invoice-summary-label">Total Billed Amount</div>
          <div className="invoice-summary-value">₱12,340</div>
        </div>
        <div className="invoice-summary-card">
          <div className="invoice-summary-label">Paid Invoices</div>
          <div className="invoice-summary-value">10</div>
        </div>
      </div>
      <div className="invoice-filters">
        <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All</button>
        <button className={filter === "Last30" ? "active" : ""} onClick={() => setFilter("Last30")}>Last 30 days</button>
        <button className={filter === "Custom" ? "active" : ""} onClick={() => setFilter("Custom")}>Custom</button>
      </div>
      <div className="invoice-list">
        {invoiceData.map(item => (
          <div key={item.id} className="invoice-item">
            <div>
              <div className="invoice-item-type">Expenses</div>
              <div className="invoice-item-desc">{String(item.description)}</div>
              <div className="invoice-item-actions">
                <span className="invoice-paid">Paid</span>
                <button className="invoice-receipt-btn">View receipt</button>
              </div>
            </div>
            <div className="invoice-item-amount">₱{item.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoice;