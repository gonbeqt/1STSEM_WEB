import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputWithIcon from '../../../../../Components/InputWithIcon';
import SearchIcon from '../../../../../Components/icons/SearchIcon';
import './PayrollTab.css';



const PayrollTab = () => {
    const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
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

const handleEmployeeClick = (employeeId: number) => {
    navigate(`/manager/payroll/employee/${employeeId}`);
  };
   const handleAddEmployee = () => {
    navigate('/add_employee');
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

    return (
    <div className="payroll-container">
      <div className="payroll-header">
        <InputWithIcon
          icon={<SearchIcon />}
          placeholder="Search"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
        <button className="add-employee-button" onClick={handleAddEmployee}>Add Employee</button>
      </div>
      
      <div className="employee-list">
        {filteredEmployees.map(employee => (
          <div 
            key={employee.id} 
            className="employee-card"
            onClick={() => handleEmployeeClick(employee.id)}
          >
            <div className="employee-info">
              <img src={employee.avatar} alt="" className="employee-avatar" />
              <div>
                <h3 className="employee-name">{employee.name}</h3>
                <p className="employee-role">{employee.role}</p>
              </div>
            </div>
            <span className="employee-salary">{employee.salary}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default PayrollTab;