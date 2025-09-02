import React from 'react';
import './ManagementEmployeDetails.css';
import { useNavigate } from 'react-router-dom';

interface EmployeeData {
  id: number;
  fullName: string;
  designation: string;
  gender: string;
  hireDate: string;
  employeeId: string;
  wallet: string;
  walletId: string;
  balance: string;
  category: string;
  transactionDate: string;
  time: string;
  notes: string;
}

interface EmployeeDetailsProps {
  employee?: EmployeeData;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const defaultEmployee: EmployeeData = {
  id: 1,
  fullName: "Yuno Cruz",
  designation: "Designer", 
  gender: "Male",
  hireDate: "25 January 2025",
  employeeId: "1234",
  wallet: "Coinbase",
  walletId: "0xhj6s-34v",
  balance: "0xhj6s-34v",
  category: "Payroll",
  transactionDate: "28 August 2025",
  time: "10:30 AM",
  notes: "Keep it Up!"
};

const ManagementEmployeeDetails: React.FC<EmployeeDetailsProps> = ({ 
  employee = defaultEmployee, 

  onEdit, 
  onDelete 
}) => {
  const navigation = useNavigate();
  return (
    <div className="employee-details-container">
      <div className="employee-details-card">
        {/* Header */}
        <div className="header">
          <button className="back-button" onClick={() => navigation(-1)} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="header-title">Employee Details</h1>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-picture">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="profile-info">
            <h2 className="employee-name">{employee.fullName}</h2>
            <p className="employee-designation">{employee.designation}</p>
          </div>
        </div>

        {/* Content */}
        <div className="details-content">
          {/* Employee Information */}
          <div className="info-section">
            <h3 className="section-title">Employee Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{employee.fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{employee.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Hire Date</span>
                <span className="info-value">{employee.hireDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Employee ID</span>
                <span className="info-value">{employee.employeeId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Designation</span>
                <span className="info-value">{employee.designation}</span>
              </div>
            </div>
          </div>

          {/* Wallet Details */}
          <div className="info-section">
            <h3 className="section-title">Wallet Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Wallet</span>
                <span className="info-value">{employee.wallet}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Wallet ID</span>
                <span className="info-value">{employee.walletId}</span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="info-section">
            <h3 className="section-title">Transaction Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Balance</span>
                <span className="info-value">{employee.balance}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">{employee.category}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date</span>
                <span className="info-value">{employee.transactionDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time</span>
                <span className="info-value">{employee.time}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Notes</span>
                <span className="info-value">{employee.notes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="delete-button" onClick={onDelete} type="button">
            Delete
          </button>
          <button className="edit-button" onClick={onEdit} type="button">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagementEmployeeDetails;