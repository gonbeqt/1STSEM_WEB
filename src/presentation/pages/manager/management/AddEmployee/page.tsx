import React, { useState } from 'react';
import './AddEmployee.css';
import { container } from '../../../../../di/container';
import { useEmployeeViewModel } from '../../../../../domain/viewmodel/EmployeeViewModel';
import { AddEmployeeRequest, AddEmployeeResponse } from '../../../../../domain/repositories/EmployeeRepository';

interface AddEmployeeData {
  email: string;
  position: string;
  department: string;
  full_name: string;
  phone: string;
}

interface AddEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: AddEmployeeResponse['employee']) => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Use the Employee ViewModel
  const { 
    addEmployee, 
    isLoading, 
    error, 
    success, 
    clearMessages 
  } = useEmployeeViewModel(
    container.addEmployeeUseCase, 
    container.getEmployeesByManagerUseCase
  );

  const [formData, setFormData] = useState<AddEmployeeData>({
    email: '',
    position: '',
    department: 'Finance',
    full_name: '',
    phone: ''
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Employee email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Clear previous messages
    clearMessages();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare the request according to the backend API
      const request: AddEmployeeRequest = {
        email: formData.email,
        position: formData.position || undefined,
        department: formData.department || undefined,
        full_name: formData.full_name || undefined,
        phone: formData.phone || undefined
      };

      console.log('Adding employee to team:', request);
      
      const response = await addEmployee(request);

      if (response.success && response.employee) {
        console.log('Employee added to team successfully:', response.employee);
        
        // Reset form
        setFormData({
          email: '',
          position: '',
          department: 'Finance',
          full_name: '',
          phone: ''
        });
        setValidationErrors({});
        
        // Call the onSubmit callback with the response data
        onSubmit(response.employee);
        
        // Close the modal
        onClose();
        
        // Show success message
        alert(`Employee ${response.employee.full_name || response.employee.username} has been added to your team successfully!`);
      } else {
        // Error is already handled by the ViewModel hook
        console.error('Failed to add employee to team:', response.message);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      position: '',
      department: 'Finance',
      full_name: '',
      phone: ''
    });
    setValidationErrors({});
    clearMessages();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          {/* Header */}
          <div className="modal-header">
            <button 
              className="close-button" 
              onClick={handleClose}
              disabled={isLoading}
            >
              ←
            </button>
            <h2>Add Employee to Team</h2>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="step-content">
              {/* Email Field */}
              <div className="input-group">
                <label htmlFor="email">Employee Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${validationErrors.email ? 'error' : ''}`}
                  placeholder="Enter existing employee's email"
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <span className="error-message">{validationErrors.email}</span>
                )}
              </div>

              {/* Full Name Field */}
              <div className="input-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional: Update employee's full name"
                  disabled={isLoading}
                />
              </div>

              {/* Position Field */}
              <div className="input-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional: Specify position"
                  disabled={isLoading}
                />
              </div>

              {/* Department Field */}
              <div className="input-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={isLoading}
                >
                  <option value="">Select Department</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Sales">Sales</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
              </div>

              {/* Phone Field */}
              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional: Add phone number"
                  disabled={isLoading}
                />
              </div>

              {/* Info Box */}
              <div className="info-box">
                <strong>Note:</strong> This will add an existing employee to your team. 
                The employee must already be registered in the system.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button 
              className="back-button" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add to Team'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="error-notification">
          <strong>Error:</strong> {error}
          <button onClick={clearMessages} className="notification-close">
            ×
          </button>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="success-notification">
          <strong>Success:</strong> {success}
          <button onClick={clearMessages} className="notification-close">
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default AddEmployee;