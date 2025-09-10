// Reports.tsx
import React from 'react';
import './reports.css';
import { useNavigate } from 'react-router-dom';

const Reports: React.FC = () => {
  const navigate = useNavigate()
  const handleBalanceSheet = ()=>{
    navigate('/balance_sheet')
  }
  const handleCashFlow = ()=>{
    navigate('/cash_flow')
  }
  const handleIncome = ()=>{
    navigate('/income')
  }
   const handleInvest = ()=>{
    navigate('/invest')
  }
  return (
    <div className="reports-container">
      {/* Sidebar */}
      
        <h1 className="sidebar-title">Reports</h1>
        
        {/* Report Categories */}
        <div className="report-categories">
          <div className="category active">
            <span className="category-label">Financial Statements</span>
          </div>
          <div className="category">
            <span className="category-label">Payroll Reports</span>
          </div>
          <div className="category">
            <span className="category-label">Tax Reports</span>
          </div>
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
          <div className="report-type" onClick={handleBalanceSheet}>
            <div className="icon balance-icon"></div>
            <div className="report-info">
              <span className="report-name">Balance Sheet</span>
              <span className="last-updated">Last updated Today</span>
            </div>
          </div>
          <div className="report-type" onClick={handleIncome}>
            <div className="icon income-icon"></div>
            <div className="report-info">
              <span className="report-name">Income Statement</span>
              <span className="last-updated">Last updated Today</span>
            </div>
          </div>
          <div className="report-type" onClick={handleCashFlow}>
            <div className="icon cashflow-icon"></div>
            <div className="report-info">
              <span className="report-name">Cash Flow</span>
              <span className="last-updated">Last updated Today</span>
            </div>
          </div>
          <div className="report-type" onClick={handleInvest}>
            <div className="icon investment-icon"></div>
            <div className="report-info">
              <span className="report-name">Investment</span>
              <span className="last-updated">Last updated Today</span>
            </div>
          </div>
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