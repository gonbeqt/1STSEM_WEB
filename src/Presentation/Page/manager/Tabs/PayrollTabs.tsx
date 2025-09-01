import React, { useState } from 'react';
import InputWithIcon from '../../../Components/InputWithIcon';
import SearchIcon from '../../../Components/icons/SearchIcon';
import './PayrollTab.css';

interface Employee {
  id: number;
  name: string;
  role: string;
  salary: string;
  avatar: string;
}

const PayrollTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const employees: Employee[] = [
    { id: 1, name: 'Yuno Cruz', role: 'Designer', salary: 'Ð238,588', avatar: '/avatar-placeholder.png' },
    { id: 2, name: 'Yuno Cruz', role: 'Designer', salary: 'Ð238,588', avatar: '/avatar-placeholder.png' },
    { id: 3, name: 'Yuno Cruz', role: 'Designer', salary: 'Ð238,588', avatar: '/avatar-placeholder.png' },
    { id: 4, name: 'Yuno Cruz', role: 'Designer', salary: 'Ð238,588', avatar: '/avatar-placeholder.png' },
    { id: 5, name: 'Yuno Cruz', role: 'Designer', salary: 'Ð238,588', avatar: '/avatar-placeholder.png' },
  ];

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
        <button className="add-employee-button">Add Employee</button>
      </div>
      
      <div className="employee-list">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="employee-card">
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