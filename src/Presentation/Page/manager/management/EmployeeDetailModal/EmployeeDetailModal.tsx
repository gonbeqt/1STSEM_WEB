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
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  nationality?: string;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderDetailsTab = () => (
    <div className="tab-content">
      <div className="info-section">
        <div className="section-header">
          <h3>Personal Information</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <label>Email</label>
            <span>{employee.emailAddress}</span>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <span>{employee.phoneNumber}</span>
          </div>
          <div className="info-item">
            <label>Date of Birth</label>
            <span>{employee.dateOfBirth ? formatDate(employee.dateOfBirth) : '1985-06-15'}</span>
          </div>
          <div className="info-item">
            <label>Gender</label>
            <span>{employee.gender || 'Female'}</span>
          </div>
          <div className="info-item">
            <label>Nationality</label>
            <span>{employee.nationality || 'American'}</span>
          </div>
          <div className="info-item full-width">
            <label>Address</label>
            <span>{employee.address || '123 Main Street, New York, NY 10001'}</span>
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
        </div>
      </div>

      <div className="info-section">
        <div className="section-header">
          <h3>Benefits</h3>
        </div>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🏥</div>
            <div>
              <label>Health Insurance</label>
              <span>Enrolled</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">💼</div>
            <div>
              <label>Retirement Plan</label>
              <span>Enrolled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayrollTab = () => (
    <div className="tab-content">
      <div className="payroll-section">
        <h3>Current Pay Period</h3>
        <div className="payroll-summary">
          <div className="payroll-item highlight">
            <label>Net Pay</label>
            <span className="amount large">{formatCurrency(payrollData.currentPeriod.netPay)}</span>
          </div>
          <div className="payroll-row">
            <div className="payroll-item">
              <label>Gross</label>
              <span className="amount">{formatCurrency(payrollData.currentPeriod.gross)}</span>
            </div>
            <div className="payroll-item">
              <label>Deductions</label>
              <span className="amount">{formatCurrency(
                Object.values(payrollData.currentPeriod.deductions).reduce((a, b) => a + b, 0)
              )}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="payroll-section">
        <h3>Deduction Breakdown</h3>
        <div className="deductions-list">
          <div className="deduction-item">
            <span>Federal</span>
            <span>{formatCurrency(payrollData.currentPeriod.deductions.federal)}</span>
          </div>
          <div className="deduction-item">
            <span>State Tax</span>
            <span>{formatCurrency(payrollData.currentPeriod.deductions.stateTax)}</span>
          </div>
          <div className="deduction-item">
            <span>Medicare</span>
            <span>{formatCurrency(payrollData.currentPeriod.deductions.medicare)}</span>
          </div>
          <div className="deduction-item">
            <span>Social Security</span>
            <span>{formatCurrency(payrollData.currentPeriod.deductions.socialSecurity)}</span>
          </div>
          <div className="deduction-item">
            <span>Dental</span>
            <span>{formatCurrency(payrollData.currentPeriod.deductions.dental)}</span>
          </div>
        </div>
        
        <div className="payroll-actions">
          <button className="btn-primary">Download Payroll</button>
          <button className="btn-secondary">Send Payroll</button>
        </div>
      </div>

      <div className="payroll-section">
        <h3>Payment History</h3>
        <div className="payment-history">
          {payrollData.paymentHistory.map((payment, index) => (
            <div key={index} className="payment-item">
              <div className="payment-date">
                <strong>{formatDate(payment.date)}</strong>
                <span className="payment-period">{payment.payDate}</span>
              </div>
              <div className="payment-amount">
                <span className="amount">{formatCurrency(payment.amount)}</span>
                <button className="btn-view">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="tab-content">
      <div className="documents-section">
        <h3>Employee Documents</h3>
        <div className="documents-list">
          {documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <h4>{doc.name}</h4>
                <span className="document-meta">
                  Uploaded on: {formatDate(doc.uploadedDate)}
                </span>
              </div>
              <div className="document-actions">
                <button className="btn-view">View</button>
                <span className={`status ${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-upload">+ Upload New Document</button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="employee-detail-modal">
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>
            ← Back
          </button>
          <div className="header-actions">
            <button className="icon-btn delete-btn" onClick={onDelete}>
              🗑️
            </button>
            <button className="icon-btn edit-btn" onClick={onEdit}>
              ✏️
            </button>
          </div>
        </div>

        <div className="employee-profile">
          <div className="profile-image">
            {employee.profileImage ? (
              <img src={employee.profileImage} alt={employee.fullName} />
            ) : (
              <div className="profile-placeholder">
                {employee.fullName.split(' ').map(name => name.charAt(0)).join('')}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{employee.fullName}</h1>
            <p className="position">{employee.position} • {employee.employeeId}</p>
            <div className="contact-info">
              <span className="email">📧 {employee.emailAddress}</span>
              <span className="phone">📞 {employee.phoneNumber}</span>
            </div>
            <span className={`status-badge ${employee.status.toLowerCase()}`}>
              {employee.status}
            </span>
          </div>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            Payroll
          </button>
          <button
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
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