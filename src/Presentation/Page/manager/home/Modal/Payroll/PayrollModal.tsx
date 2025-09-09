import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info } from 'lucide-react';
import './PayrollModal.css' 

interface Employee {
  id: string;
  name: string;
  amount: number;
  status: string;
  selected: boolean;
}

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (data: any) => void;
}

const PayrollModal: React.FC<PayrollModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [payrollType, setPayrollType] = useState<string>('Regular Payroll');
  const [payPeriodStart, setPayPeriodStart] = useState<string>('2025-08-07');
  const [payPeriodEnd, setPayPeriodEnd] = useState<string>('2025-08-07');
  const [payDate, setPayDate] = useState<string>('2025-08-07');
  
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      amount: 3350.00,
      status: 'Ready (AutoPay ON 7/29)',
      selected: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      amount: 2800.00,
      status: 'Calculated (PY12345, 8-30)',
      selected: true
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      amount: 2450.00,
      status: 'Payroll Submitted',
      selected: true
    },
    {
      id: '4',
      name: 'David Kim',
      amount: 2250.00,
      status: 'Tax Calculated',
      selected: false
    }
  ]);

  const toggleEmployee = (id: string) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, selected: !emp.selected } : emp
      )
    );
  };

  const getTotalAmount = (): number => {
    return employees
      .filter(emp => emp.selected)
      .reduce((sum, emp) => sum + emp.amount, 0);
  };

  const handleProcess = () => {
    const selectedEmployees = employees.filter(emp => emp.selected);
    onProcess({
      payrollType,
      payPeriodStart,
      payPeriodEnd,
      payDate,
      employees: selectedEmployees,
      total: getTotalAmount()
    });
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="payroll-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="payroll-modal-container">
        {/* Header */}
        <div className="payroll-modal-header">
          <div className="payroll-modal-title">
            <div className="payroll-modal-icon">
              <div className="payroll-modal-icon-inner"></div>
            </div>
            <h2>Process Payroll</h2>
          </div>
          <button
            onClick={onClose}
            className="payroll-modal-close"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="payroll-modal-content">
          <p className="payroll-modal-description">
            Process automated batch payments for your employees with calculated deductions and taxes.
          </p>

          {/* Payroll Type */}
          <div className="payroll-form-group">
            <label className="payroll-form-label">
              Payroll Type
            </label>
            <select
              value={payrollType}
              onChange={(e) => setPayrollType(e.target.value)}
              className="payroll-form-select"
            >
              <option>Regular Payroll</option>
              <option>Bonus Payroll</option>
              <option>Special Payroll</option>
            </select>
          </div>

          {/* Pay Period */}
          <div className="payroll-form-row">
            <div className="payroll-form-group">
              <label className="payroll-form-label">
                Pay Period Start
              </label>
              <input
                type="date"
                value={payPeriodStart}
                onChange={(e) => setPayPeriodStart(e.target.value)}
                className="payroll-form-input"
              />
            </div>
            <div className="payroll-form-group">
              <label className="payroll-form-label">
                Pay Period End
              </label>
              <input
                type="date"
                value={payPeriodEnd}
                onChange={(e) => setPayPeriodEnd(e.target.value)}
                className="payroll-form-input"
              />
            </div>
          </div>

          {/* Pay Date */}
          <div className="payroll-form-group">
            <label className="payroll-form-label">
              Pay Date
            </label>
            <input
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="payroll-form-input"
            />
          </div>

          {/* Employees */}
          <div className="payroll-employee-section">
            <div className="payroll-employee-header">
              <label className="payroll-form-label">
                Employees to be paid
              </label>
              <span className="payroll-employee-count">
                {employees.filter(emp => emp.selected).length} selected
              </span>
            </div>
            
            <div className="payroll-employee-list">
              {employees.map((employee) => (
                <div key={employee.id} className="payroll-employee-item">
                  <input
                    type="checkbox"
                    checked={employee.selected}
                    onChange={() => toggleEmployee(employee.id)}
                    className="payroll-employee-checkbox"
                  />
                  <div className="payroll-employee-info">
                    <div className="payroll-employee-details">
                      <div>
                        <p className="payroll-employee-name">{employee.name}</p>
                        <p className="payroll-employee-status">{employee.status}</p>
                      </div>
                      <p className="payroll-employee-amount">
                        ₱{employee.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="payroll-total-section">
            <div className="payroll-total-row">
              <span className="payroll-total-label">Total</span>
              <span className="payroll-total-amount">
                ₱{getTotalAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Notices */}
          <div className="payroll-notices">
            <div className="payroll-notice payroll-notice-info">
              <Info size={16} className="payroll-notice-icon" />
              <div className="payroll-notice-content">
                <p className="payroll-notice-title">Payroll Payment Notice</p>
                <p className="payroll-notice-text">
                  This will initiate payment processing for selected employees. Ensure addresses,
                  bank information, and tax data are up-to-date before processing.
                </p>
              </div>
            </div>
            
            <div className="payroll-notice payroll-notice-warning">
              <AlertCircle size={16} className="payroll-notice-icon" />
              <div className="payroll-notice-content">
                <p className="payroll-notice-title">Important Notice</p>
                <p className="payroll-notice-text">
                  Review employee information, communication preferences, and
                  personal data before final submission. Errors or corrections should be resolved before
                  submitting to Payroll Service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="payroll-modal-footer">
          <button
            onClick={onClose}
            className="payroll-btn payroll-btn-secondary"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={employees.filter(emp => emp.selected).length === 0}
            className="payroll-btn payroll-btn-primary"
            type="button"
          >
            Process Payroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollModal;