import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EmployeeDetails.css';

interface EmployeeFormData {
  wallet: string;
  walletId: string;
  amount: string;
  category: string;
  scheduleDate: string;
  scheduleTime: string;
  frequency: string;
  notes: string;
}

// Dummy employees array for demonstration; replace with actual data source or import as needed
const employees = [
  {
    id: 1,
    name: "John Doe",
    role: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    walletId: "0x1234567890abcdef"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    walletId: "0xabcdef1234567890"
  }
];

const EmployeeDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const employee = employees.find(emp => emp.id === Number(id));

  const [formData, setFormData] = useState<EmployeeFormData>({
    wallet: 'Coinbase',
    walletId: employee?.walletId || '',
    amount: '0.039',
    category: 'Payroll',
    scheduleDate: '',
    scheduleTime: '',
    frequency: 'Monthly',
    notes: ''
  });

  if (!employee) {
    return <div>Employee not found</div>;
  }

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/manager/payroll/overview', {
      state: {
        employeeName: employee.name,
        role: employee.role,
        avatar: employee.avatar,
        wallet: formData.wallet,
        walletId: formData.walletId,
        amount: formData.amount,
        category: formData.category,
        date: formData.scheduleDate,
        time: formData.scheduleTime,
        notes: formData.notes
      }
    });
  };

  return (
    <div className="employee-details-container">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Automate Payroll
        </button>
      </header>

      <div className="employee-profile">
        <img src={employee.avatar} alt="" className="large-avatar" />
        <h2>{employee.name}</h2>
        <p>{employee.role}</p>
      </div>

      <form className="payroll-form">
        <div className="form-group form-group-full">
          <label>Wallet</label>
          <select 
            value={formData.wallet}
            onChange={(e) => setFormData({...formData, wallet: e.target.value})}
          >
            <option value="Coinbase">Coinbase</option>
            <option value="MetaMask">MetaMask</option>
            <option value="TrustWallet">Trust Wallet</option>
          </select>
        </div>

        <div className="form-group form-group-full">
          <label>Wallet ID</label>
          <input 
            type="text" 
            value={formData.walletId}
            onChange={(e) => setFormData({...formData, walletId: e.target.value})}
            placeholder="Enter wallet ID" 
          />
        </div>

        <div className="form-group form-group-full">
          <label>Amount</label>
          <div className="amount-input">
            <span className="currency">ETH</span>
            <input 
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group form-group-full">
          <label>Category</label>
          <input type="text" value={formData.category} disabled />
        </div>

        <div className="form-group">
          <label>Schedule Date</label>
          <input 
            type="date"
            value={formData.scheduleDate}
            onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
          />
        </div>

        <div className="form-group" >
          <label>Schedule Time</label>
          <input 
            type="time"
            value={formData.scheduleTime}
            onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
          />
        </div>

        <div className="form-group form-group-full">
          <label>Frequency</label>
          <select 
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
          >
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
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

        <div className="form-actions form-group-full">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="continue-btn" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeDetails;