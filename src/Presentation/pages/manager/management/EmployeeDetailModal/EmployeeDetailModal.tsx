import React, { useState, useEffect } from 'react';
import './EmployeeDetailModal.css';

interface Employee {
  id: string;
  fullName: string;
  position: string;
  employeeId: string;
  emailAddress: string;
  phoneNumber: string;
  department: string;
  baseSalary: number;
  paymentSchedule: string;
  employmentType: string;
  startDate: string;
  status: 'Active' | 'Inactive';
  profileImage?: string;
}

interface PayrollData {
  currentPeriod: {
    gross: number;
    netPay: number;
    yearToDate: number;
    deductions: {
      federal: number;
      stateTax: number;
      medicare: number;
      socialSecurity: number;
      dental: number;
    };
  };
  paymentHistory: Array<{
    date: string;
    amount: number; 
    period: string;
    payDate: string;
  }>;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

interface EmployeeDetailModalProps {
  isOpen: boolean;
  employee: Employee;
  payrollData: PayrollData;
  documents: Document[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

type TabType = 'details' | 'payroll' | 'documents';

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  employee,
  payrollData,
  documents,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'Invalid Date') {
      return 'Not provided';
    }
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Not provided';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const renderDetailsTab = () => (
    <div className="tab-content">
      <div className="info-section">
        <div className="section-header">
          <h3>Personal Information</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <label>Email</label>
            <span>{employee.emailAddress || 'Not provided'}</span>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <span>{employee.phoneNumber || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="section-header">
          <h3>Employment Information</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <label>Basic Salary</label>
            <span>{formatCurrency(employee.baseSalary)}</span>
          </div>
          <div className="info-item">
            <label>Start Date</label>
            <span>{formatDate(employee.startDate)}</span>
          </div>
          <div className="info-item">
            <label>Employment Type</label>
            <span>{employee.employmentType}</span>
          </div>
          <div className="info-item">
            <label>Payment Schedule</label>
            <span>{employee.paymentSchedule}</span>
          </div>
          <div className="info-item">
            <label>Department</label>
            <span>{employee.department}</span>
          </div>
          <div className="info-item">
            <label>Employee Status</label>
            <span className={`status-indicator ${employee.status.toLowerCase()}`}>
              {employee.status}
            </span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="section-header">
          <h3>Benefits & Perks</h3>
        </div>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🏥</div>
            <div className="benefit-details">
              <label>Health Insurance</label>
              <span className="benefit-status enrolled">Enrolled</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">💼</div>
            <div className="benefit-details">
              <label>Retirement Plan</label>
              <span className="benefit-status enrolled">Enrolled</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🦷</div>
            <div className="benefit-details">
              <label>Dental Coverage</label>
              <span className="benefit-status enrolled">Enrolled</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🏖️</div>
            <div className="benefit-details">
              <label>Paid Time Off</label>
              <span className="benefit-status available">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayrollTab = () => (
    <div className="tab-content">
      <div className="payroll-section">
        <div className="section-header">
          <h3>Current Pay Period</h3>
          <span className="period-info">September 2025</span>
        </div>
        <div className="payroll-summary">
          <div className="payroll-item highlight">
            <label>Net Pay</label>
            <span className="amount large">{formatCurrency(payrollData.currentPeriod.netPay)}</span>
          </div>
          <div className="payroll-row">
            <div className="payroll-item">
              <label>Gross Pay</label>
              <span className="amount">{formatCurrency(payrollData.currentPeriod.gross)}</span>
            </div>
            <div className="payroll-item">
              <label>Total Deductions</label>
              <span className="amount deduction">{formatCurrency(
                Object.values(payrollData.currentPeriod.deductions).reduce((a, b) => a + b, 0)
              )}</span>
            </div>
          </div>
          <div className="ytd-section">
            <div className="payroll-item">
              <label>Year to Date</label>
              <span className="amount">{formatCurrency(payrollData.currentPeriod.yearToDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="payroll-section">
        <h3>Deduction Breakdown</h3>
        <div className="deductions-list">
          <div className="deduction-item">
            <span className="deduction-label">
              <span className="deduction-icon">🏛️</span>
              Federal Tax
            </span>
            <span className="deduction-amount">{formatCurrency(payrollData.currentPeriod.deductions.federal)}</span>
          </div>
          <div className="deduction-item">
            <span className="deduction-label">
              <span className="deduction-icon">🏛️</span>
              State Tax
            </span>
            <span className="deduction-amount">{formatCurrency(payrollData.currentPeriod.deductions.stateTax)}</span>
          </div>
          <div className="deduction-item">
            <span className="deduction-label">
              <span className="deduction-icon">🏥</span>
              Medicare
            </span>
            <span className="deduction-amount">{formatCurrency(payrollData.currentPeriod.deductions.medicare)}</span>
          </div>
          <div className="deduction-item">
            <span className="deduction-label">
              <span className="deduction-icon">🛡️</span>
              Social Security
            </span>
            <span className="deduction-amount">{formatCurrency(payrollData.currentPeriod.deductions.socialSecurity)}</span>
          </div>
          <div className="deduction-item">
            <span className="deduction-label">
              <span className="deduction-icon">🦷</span>
              Dental Insurance
            </span>
            <span className="deduction-amount">{formatCurrency(payrollData.currentPeriod.deductions.dental)}</span>
          </div>
        </div>
        
        <div className="payroll-actions">
          <button className="btn-primary">
            <span className="btn-icon">📥</span>
            Download Payroll
          </button>
          <button className="btn-secondary">
            <span className="btn-icon">📧</span>
            Send Payroll
          </button>
        </div>
      </div>

      <div className="payroll-section">
        <h3>Payment History</h3>
        <div className="payment-history">
          {payrollData.paymentHistory.length > 0 ? (
            payrollData.paymentHistory.map((payment, index) => (
              <div key={index} className="payment-item">
                <div className="payment-info">
                  <div className="payment-date">
                    <strong>{formatDate(payment.date)}</strong>
                    <span className="payment-period">{payment.period}</span>
                  </div>
                  <div className="payment-details">
                    <span className="pay-date">Paid: {payment.payDate}</span>
                  </div>
                </div>
                <div className="payment-amount">
                  <span className="amount">{formatCurrency(payment.amount)}</span>
                  <button className="btn-view">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <p>No payment history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="tab-content">
      <div className="documents-section">
        <div className="section-header">
          <h3>Employee Documents</h3>
          <button className="btn-upload">
            <span className="upload-icon">+</span>
            Upload Document
          </button>
        </div>
        
        <div className="documents-list">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-icon">
                  {doc.type === 'pdf' ? '📄' : doc.type === 'image' ? '🖼️' : '📎'}
                </div>
                <div className="document-info">
                  <h4>{doc.name}</h4>
                  <div className="document-meta">
                    <span className="document-type">{doc.type.toUpperCase()}</span>
                    <span className="document-date">Uploaded: {formatDate(doc.uploadedDate)}</span>
                  </div>
                </div>
                <div className="document-actions">
                  <span className={`status ${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </span>
                  <button className="btn-view">View</button>
                  <button className="btn-download">Download</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📁</span>
              <p>No documents uploaded yet</p>
              <span className="empty-subtitle">Upload important employee documents here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="employee-detail-modal">
        <div className="modal-header">
          <button className="back-btn" onClick={onClose} aria-label="Close modal">
            <span className="back-icon">←</span>
            Back
          </button>
          <div className="header-actions">
            <button className="icon-btn delete-btn" onClick={onDelete} aria-label="Delete employee">
              <span className="action-icon">🗑️</span>
            </button>
          </div>
        </div>

        <div className="employee-profile">
          <div className="profile-image">
            {employee.profileImage ? (
              <img src={employee.profileImage} alt={`${employee.fullName}'s profile`} />
            ) : (
              <div className="profile-placeholder">
                {employee.fullName.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{employee.fullName}</h1>
            <p className="position">{employee.position} • ID: {employee.employeeId}</p>
            <div className="contact-info">
              <span className="email">
                <span className="contact-icon">📧</span>
                {employee.emailAddress}
              </span>
              <span className="phone">
                <span className="contact-icon">📞</span>
                {employee.phoneNumber}
              </span>
            </div>
            <span className={`status-badge ${employee.status.toLowerCase()}`}>
              <span className="status-dot"></span>
              {employee.status}
            </span>
          </div>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <span className="tab-icon">👤</span>
            Details
          </button>
          <button
            className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <span className="tab-icon">💰</span>
            Payroll
          </button>
          <button
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span className="tab-icon">📄</span>
            Documents
          </button>
        </div>

        <div className="tab-content-container">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'payroll' && renderPayrollTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;