import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PayrollOverview.css';

interface PayrollData {
  employeeName: string;
  role: string;
  avatar: string;
  wallet: string;
  walletId: string;
  amount: string;
  category: string;
  date: string;
  time: string;
  notes: string;
}

const PayrollOverview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payrollData = location.state as PayrollData;

  return (
    <div className="overview-container">
      <header className="overview-header">
        <button className="back-button" onClick={() => navigate(-1)} type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
        
         
        </button>
         <span> Overview</span>
      </header>

      <div className="overview-content">
        <div className="employee-header">
          <img src={payrollData.avatar} alt="" className="employee-avatar" />
          <div className="employee-info">
            <h2>{payrollData.employeeName}</h2>
            <p>{payrollData.role}</p>
          </div>
        </div>

        <div className="details-list">
          <div className="detail-item">
            <span className="detail-label">Wallet</span>
            <span className="detail-value">{payrollData.wallet}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wallet ID</span>
            <span className="detail-value">{payrollData.walletId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Amount</span>
            <span className="detail-value">{payrollData.amount}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Category</span>
            <span className="detail-value">{payrollData.category}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">{payrollData.date}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time</span>
            <span className="detail-value">{payrollData.time}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Notes</span>
            <span className="detail-value">{payrollData.notes || 'Keep it Up!'}</span>
          </div>
        </div>

        <div className="overview-actions">
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="save-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollOverview;