import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { services } from '../../../../../Data/serviceData';
import './ServiceDetails.css';

interface FormData {
  wallet: string;
  walletId: string;
  amount: string;
  category: string;
  date: string;
  time: string;
  frequency: string;
  notes: string;
}

const ServiceDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('Service ID from URL:', id);
  const serviceData = services.find(service => service.id === id);
  console.log('Services data:', services);
  console.log('Found service data:', serviceData);

  const [formData, setFormData] = useState<FormData>({
    wallet: 'Coinbase',
    walletId: serviceData?.walletId || '',
    amount: serviceData?.defaultAmount || '',
    category: serviceData?.category || '',
    date: '',
    time: '',
    frequency: 'Monthly',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/service/overview', {
      state: {
        serviceName: serviceData?.name,
        icon: serviceData?.icon,
        ...formData
      }
    });
  };

  if (!serviceData) {
    return <div>Service not found</div>;
  }

  return (
    <div className="service-details-container">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate(-1)} type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
         
        </button>
         
          <span>Automate Service Payment</span> 
      </header>

      <div className="service-profile">
        <div className={`service-icon ${serviceData.id}`}>
          {serviceData.icon}
        </div>
        <div className="service-info-text">
          <h2>{serviceData.name}</h2>
          <p>{serviceData.provider}</p>
        </div>
      </div>

      <form className="service-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <h3 className="section-title">Wallet Details</h3>
          <div className="form-group form-group-full">
            <label>Wallet</label>
            <select 
              value={formData.wallet}
              onChange={(e) => setFormData({...formData, wallet: e.target.value})}
            >
              <option value="Coinbase">Coinbase</option>
            </select>
          </div>

          <div className="form-group form-group-full">
            <label>Wallet ID</label>
            <input 
              type="text"
              value={formData.walletId}
              onChange={(e) => setFormData({...formData, walletId: e.target.value})}
            />
          </div>
        </section>

        <section className="form-section">
          <h3 className="section-title">Transaction Details</h3>
          <div className="form-group form-group-full">
            <label>Amount</label>
            <div className="amount-input">
              <select className="eth-select">
                <option value="ETH">ETH</option>
              </select>
              <input 
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group form-group-full">
            <label>Category</label>
            <input type="text" value={serviceData.category} disabled />
          </div>

          <div className="form-group form-group-full">
            <label>Schedule</label>
            <div className="schedule-inputs">
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
              <input 
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group form-group-full">
            <label>Frequency</label>
            <select 
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div className="form-group form-group-full">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Add notes"
            />
          </div>
        </section>

        <div className="form-actions form-group-full">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="continue-btn">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceDetails;