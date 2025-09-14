// Reports.tsx
import React, { useState } from 'react';
import './reports.css';
import { useNavigate } from 'react-router-dom';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Financial Statements');

  const reportCategories = [
    {
      name: 'Financial Statements',
      types: [
        { name: 'Balance Sheet', icon: 'balance-icon', path: '/balance_sheet' },
        { name: 'Income Statement', icon: 'income-icon', path: '/income' },
        { name: 'Cash Flow', icon: 'cashflow-icon', path: '/cash_flow' },
        { name: 'Investment', icon: 'investment-icon', path: '/invest' },
      ],
    },
    {
      name: 'Payroll Reports',
      types: [
        { name: 'Payroll Summary', icon: 'payroll-icon', path: '/payroll_summary' },
      ],
    },
    {
      name: 'Tax Reports',
      types: [
        { name: 'Tax Summary', icon: 'tax-icon', path: '/tax_summary' },
      
      ],
    },
  ];

  const handleReportTypeClick = (path: string) => {
    navigate(path);
  };
  return (
    <div className="reports-container">
      {/* Sidebar */}
      
        <h1 className="sidebar-title">Reports</h1>
        
        {/* Report Categories */}
        <div className="report-categories">
          {reportCategories.map((category) => (
            <div
              key={category.name}
              className={`category ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.name)}
            >
              <span className="category-label">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Periods */}
        <div className="periods">
          <button className="period-btn active">Daily</button>
          <button className="period-btn">Weekly</button>
          <button className="period-btn">Monthly</button>
          <button className="period-btn">Quarterly</button>
        </div>

        {/* Report Types */}
        <div className="report-types">
          {reportCategories.find(cat => cat.name === activeCategory)?.types.map(type => (
            <div className="report-type" key={type.name} onClick={() => handleReportTypeClick(type.path)}>
              <div className={`icon ${type.icon}`}></div>
              <div className="report-info">
                <span className="report-name">{type.name}</span>
                <span className="last-updated">Last updated Today</span>
              </div>
            </div>
          ))}
        </div>
    
        <div>
                  <h1 className="sidebar-title">Risk Assessment</h1>

        </div>
        <div className="alerts-section">
          <div className="alert high">
            <div className="alert-header">
              <span className="alert-icon high-icon"></span>
              <span className="alert-title">Declining Cash Flow</span>
              <span className="severity high">High</span>
            </div>
            <p className="alert-description">Decreased by XX% compared to last quarter</p>
            <div className="recommendation">
              <strong>Recommendation:</strong> Review accounts receivable processes and consider implementing stricter credit collection policies.
            </div>
          </div>

          <div className="alert medium">
            <div className="alert-header">
              <span className="alert-icon medium-icon"></span>
              <span className="alert-title">Increasing Operational Expenses</span>
              <span className="severity medium">Medium</span>
            </div>
            <p className="alert-description">Expenses have increased by YY%</p>
            <div className="recommendation">
              <strong>Recommendation:</strong> Conduct cost audit and identify areas for potential cost reduction.
            </div>
          </div>

          <div className="alert low">
            <div className="alert-header">
              <span className="alert-icon low-icon"></span>
              <span className="alert-title">Debt-to-Equity Ratio Rising</span>
              <span className="severity low">Low</span>
            </div>
            <p className="alert-description">Debt-to-Equity Ratio is approaching ZZ</p>
            <div className="recommendation">
              <strong>Recommendation:</strong> Consider equity financing instead of taking on additional debt.
            </div>
          </div>
        </div>
    </div>
  );
};

export default Reports;