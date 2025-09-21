import React, { useState, useEffect } from 'react';
import './AddEmployee.css';
import { useAddEmployee } from '../../../../hooks/useAddEmployee';
import { AddEmployeeRequest, AddEmployeeResponse } from '../../../../../domain/repositories/EmployeeRepository';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: AddEmployeeResponse['employee']) => void;
}

const AddEmployee: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');

  const { addEmployee, isLoading, error, successMessage, setError, setSuccessMessage } = useAddEmployee();

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setUsername('');
      setEmail('');
      setPassword('');
      setFullName('');
      setDepartment('');
      setPosition('');
      setPhone('');
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, setError, setSuccessMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const request: AddEmployeeRequest = {
      username,
      email,
      password,
      full_name: fullName || undefined,
      department: department || undefined,
      position: position || undefined,
      phone: phone || undefined,
    };

    const newEmployee = await addEmployee(request);
    if (newEmployee) {
      onSubmit(newEmployee); // Notify parent component of submission with the new employee data
      onClose(); // Close modal on success
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Employee</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="add-employee-form">
          {isLoading && <p className="loading-message">Adding employee...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position:</label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
