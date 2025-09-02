import React, { useState } from 'react';
import './AddEmployee.css';
import { useNavigate } from 'react-router-dom';

interface Employee {
  fullName: string;
  gender: string;
  hireDate: string;
  employeeId: string;
  designation: string;
}

interface AddEmployeeProps {
  onSubmit?: (employee: Employee) => void;
}
const employees = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Software Engineer',
    salary: '$5000',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Product Manager',
    salary: '$6000',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  // Add more employee objects as needed
];

const AddEmployee: React.FC<AddEmployeeProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Employee>({
    fullName: '',
    gender: '',
    hireDate: '',
    employeeId: '',
    designation: ''
  });
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };
const handleEmployeeClick = (employeeId: number) => {
    navigate(`/manager/payroll/employee/${employeeId}`);
  };
  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  return (
    <div className="add-employee-container">
      <div className="add-employee-card">
        {/* Header */}
        <div className="header">
          <button className="back-button" onClick={() => navigate(-1)} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="header-title">Add Employee</h1>
        </div>

        {/* Profile Picture */}
        <div className="profile-section">
          <div className="profile-picture">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-section">
            <h2 className="section-title">Employee Information</h2>
            
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hireDate" className="form-label">Hire Date</label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
                className="form-input date-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="employeeId" className="form-label">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter employee ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="designation" className="form-label">Designation</label>
              <select
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select designation</option>
                <option value="Designer">Designer</option>
                <option value="Developer">Developer</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Intern">Intern</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="QA Engineer">QA Engineer</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className={`continue-button ${isFormValid() ? 'active' : ''}`}
            disabled={!isFormValid()}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;