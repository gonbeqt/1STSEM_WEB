import React, { useState } from 'react';
import './AddEmployeeModal.css';

interface Employee {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  position: string;
  baseSalary: string;
  paymentSchedule: string;
  employmentType: string;
  startDate: string;
  department: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [employee, setEmployee] = useState<Employee>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    position: '',
    baseSalary: '',
    paymentSchedule: 'Weekly',
    employmentType: 'Full-time',
    startDate: '',
    department: 'Finance',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(employee);
    onClose();
    setCurrentStep(1);
    setEmployee({
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      position: '',
      baseSalary: '',
      paymentSchedule: 'Weekly',
      employmentType: 'Full-time',
      startDate: '',
      department: 'Finance',
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={employee.fullName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="emailAddress">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={employee.emailAddress}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={employee.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={employee.position}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <div className="input-group">
              <label htmlFor="baseSalary">Basic Salary</label>
              <input
                type="text"
                id="baseSalary"
                name="baseSalary"
                value={employee.baseSalary}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="paymentSchedule">Payment Schedule</label>
              <select
                id="paymentSchedule"
                name="paymentSchedule"
                value={employee.paymentSchedule}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="employmentType">Employment Type</label>
              <select
                id="employmentType"
                name="employmentType"
                value={employee.employmentType}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <div className="input-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={employee.startDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={employee.department}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <div className="input-group">
              <label htmlFor="taxExempt">Tax Exemptions</label>
              <input
                type="text"
                id="taxExempt"
                name="taxExempt"
                className="form-input"
                placeholder="Tax exemption details"
              />
            </div>
            <div className="input-group">
              <label htmlFor="allowances">Allowances</label>
              <input
                type="text"
                id="allowances"
                name="allowances"
                className="form-input"
                placeholder="Allowance details"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-content">
            <div className="input-group">
              <label htmlFor="jobContribution">Job Contribution</label>
              <input
                type="text"
                id="jobContribution"
                name="jobContribution"
                className="form-input"
                placeholder="Job contribution details"
              />
            </div>
            <div className="input-group">
              <label htmlFor="healthInsurance">Health Insurance</label>
              <input
                type="text"
                id="healthInsurance"
                name="healthInsurance"
                className="form-input"
                placeholder="Health insurance details"
              />
            </div>
            <div className="input-group">
              <label htmlFor="lifeInsurance">Life Insurance</label>
              <input
                type="text"
                id="lifeInsurance"
                name="lifeInsurance"
                className="form-input"
                placeholder="Life insurance details"
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="step-content summary">
            <h3>Summary</h3>
            <div className="summary-item">
              <strong>Full Name:</strong> {employee.fullName}
            </div>
            <div className="summary-item">
              <strong>Email:</strong> {employee.emailAddress}
            </div>
            <div className="summary-item">
              <strong>Phone:</strong> {employee.phoneNumber}
            </div>
            <div className="summary-item">
              <strong>Position:</strong> {employee.position}
            </div>
            <div className="summary-item">
              <strong>Salary:</strong> {employee.baseSalary}
            </div>
            <div className="summary-item">
              <strong>Schedule:</strong> {employee.paymentSchedule}
            </div>
            <div className="summary-item">
              <strong>Type:</strong> {employee.employmentType}
            </div>
            <div className="summary-item">
              <strong>Start Date:</strong> {employee.startDate}
            </div>
            <div className="summary-item">
              <strong>Department:</strong> {employee.department}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            ←
          </button>
          <h2>Add New Employee</h2>
        </div>

        <div className="progress-bar">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`progress-step ${
                step <= currentStep ? 'active' : ''
              } ${step === currentStep ? 'current' : ''}`}
            />
          ))}
        </div>

        <div className="modal-body">{renderStep()}</div>

        <div className="modal-footer">
          {currentStep > 1 && (
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          )}
          {currentStep < 6 ? (
            <button className="next-button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="submit-button" onClick={handleSubmit}>
              Add Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;