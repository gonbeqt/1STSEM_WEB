import React, { useState } from 'react';
import './reports.css';
import Charts from '../../Components/Charts';

const summaryData = [
  { label: "Total Profit", value: "₱12,340" },
  { label: "Deductions", value: "₱2,340" },
];

const taxableData = [
  { label: "Total Earnings", value: "₱12,340" },
  { label: "Deductions", value: "₱2,340" },
  { label: "Taxable Amount", value: "₱12,340" },
  { label: "Estimated Tax Payable", value: "₱2,340" },
];

const profitLossData = [
  { label: "Total Gains", value: "₱12,340" },
  { label: "Total Losses", value: "₱2,340" },
];

const Report = () => {
  const [tab, setTab] = useState("Financial");

  return (
    <div className="report-bg report-desktop">
      <header className="dashboard-header">
        <div className="header-left">
          <span className="menu-icon">☰</span>
          <span className="page-title">Reports</span>
        </div>
        <div className="header-center">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
        <div className="header-right">
          <span className="notification-icon">🔔</span>
          <img src="https://i.pravatar.cc/40?img=3" alt="Profile" className="profile-pic" />
        </div>
      </header>

      <div className="report-tabs">
        <button className={tab === "Financial" ? "active" : ""} onClick={() => setTab("Financial")}>
          <span role="img" aria-label="Financial">💼</span> Financial Report
        </button>
        <button className={tab === "Tax" ? "active" : ""} onClick={() => setTab("Tax")}>
          <span role="img" aria-label="Tax">📄</span> Tax Report
        </button>
        <button className={tab === "Crypto" ? "active" : ""} onClick={() => setTab("Crypto")}>
          <span role="img" aria-label="Crypto">🪙</span> Crypto News
        </button>
      </div>

      <div className="report-section">
        <div className="report-section-title">Financial Summary</div>
        <div className="report-summary-cards">
          {summaryData.map((item, idx) => (
            <div className="report-summary-card" key={idx}>
              <div className="report-summary-label">{item.label}</div>
              <div className="report-summary-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-quick-insights">
        <div className="report-quick-insights-content">Quick Insights</div>
        <div className="report-quick-insights-dots">...</div>
      </div>

      <div className="report-actions">
        <button className="report-action-btn">Export as PDF</button>
        <button className="report-action-btn">Share</button>
        <button className="report-action-btn primary">Generate Report</button>
      </div>

      <div className="report-section">
        <div className="report-section-title">Taxable Income Summary</div>
        <div className="report-summary-cards">
          {taxableData.map((item, idx) => (
            <div className="report-summary-card" key={idx}>
              <div className="report-summary-label">{item.label}</div>
              <div className="report-summary-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-chart-section">
        <div className="report-section-title">Income vs Tax Comparison</div>
        <div className="report-chart">
          <Charts />
        </div>
      </div>

      <div className="report-quick-insights">
        <div className="report-quick-insights-content">Crypto News</div>
        <div className="report-quick-insights-dots">...</div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Profit/Loss Summary</div>
        <div className="report-summary-cards">
          {profitLossData.map((item, idx) => (
            <div className="report-summary-card" key={idx}>
              <div className="report-summary-label">{item.label}</div>
              <div className="report-summary-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;