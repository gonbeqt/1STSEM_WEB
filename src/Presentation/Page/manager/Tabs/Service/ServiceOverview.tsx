import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ServiceOverview.css';

interface ServiceOverviewData {
  serviceName?: string;
  icon?: string;
  wallet: string;
  walletId: string;
  amount: string;
  category: string;
  date: string;
  time: string;
  frequency: string;
  notes: string;
}

const ServiceOverview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceData = location.state as ServiceOverviewData;

  return (
    <div className="overview-container">
      <header className="overview-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Overview
        </button>
      </header>

      <div className="overview-content">
        <div className="service-header">
          <span className="service-icon">{serviceData.icon}</span>
          <div className="service-info">
            <h2>{serviceData.serviceName}</h2>
            <p>{serviceData.category}</p>
          </div>
        </div>

        <div className="details-list">
          <div className="detail-item">
            <span className="detail-label">Wallet</span>
            <span className="detail-value">{serviceData.wallet}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wallet ID</span>
            <span className="detail-value">{serviceData.walletId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Amount</span>
            <span className="detail-value">{serviceData.amount}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Category</span>
            <span className="detail-value">{serviceData.category}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">{serviceData.date}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time</span>
            <span className="detail-value">{serviceData.time}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Frequency</span>
            <span className="detail-value">{serviceData.frequency}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Notes</span>
            <span className="detail-value">{serviceData.notes || 'N/A'}</span>
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

export default ServiceOverview;