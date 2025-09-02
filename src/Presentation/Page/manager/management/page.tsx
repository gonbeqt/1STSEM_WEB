import React, { useState } from 'react';
import './management.css';
import { Plus, Search, MoreVertical, User, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import InputWithIcon from '../../../Components/InputWithIcon';
import SearchIcon from '../../../Components/icons/SearchIcon';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  avatar: string;
  status: 'active' | 'inactive' | 'on-leave';
  salary: number;
}

const EmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
   const handleAddEmployee = () => {
    navigate('/add_employee');
  };
   const handleEmployeeDetails = (employee: Employee) => {
    navigate(`/management/employee/${employee.id}`);
  };
  const employees: Employee[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      hireDate: '2022-03-15',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      status: 'active',
      salary: 95000
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      position: 'Product Manager',
      department: 'Product',
      hireDate: '2021-08-10',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      status: 'active',
      salary: 110000
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      position: 'UX Designer',
      department: 'Design',
      hireDate: '2023-01-20',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      status: 'active',
      salary: 75000
    },
    {
      id: 4,
      name: 'David Thompson',
      email: 'david.thompson@company.com',
      phone: '+1 (555) 456-7890',
      position: 'Marketing Specialist',
      department: 'Marketing',
      hireDate: '2022-11-05',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      status: 'on-leave',
      salary: 65000
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      phone: '+1 (555) 567-8901',
      position: 'Data Analyst',
      department: 'Analytics',
      hireDate: '2023-06-12',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      status: 'active',
      salary: 70000
    },
    {
      id: 6,
      name: 'James Miller',
      email: 'james.miller@company.com',
      phone: '+1 (555) 678-9012',
      position: 'HR Manager',
      department: 'Human Resources',
      hireDate: '2020-02-28',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      status: 'active',
      salary: 85000
    },
    {
      id: 7,
      name: 'Rachel Green',
      email: 'rachel.green@company.com',
      phone: '+1 (555) 789-0123',
      position: 'Sales Representative',
      department: 'Sales',
      hireDate: '2022-09-14',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      status: 'inactive',
      salary: 55000
    },
    {
      id: 8,
      name: 'Alex Kumar',
      email: 'alex.kumar@company.com',
      phone: '+1 (555) 890-1234',
      position: 'DevOps Engineer',
      department: 'Engineering',
      hireDate: '2021-12-03',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      status: 'active',
      salary: 90000
    }
  ];


  const filteredEmployees = employees.filter((employee: Employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  

  return (
    <>
    <div className="employee-management">
      {/* Header */}
      <div className="header2">
        <h1>Employee List</h1>
      </div>

     
        {/* Search and Add Employee */}
        
          <div className="payroll-header">
            <InputWithIcon
          icon={<SearchIcon />}
          placeholder="Search"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        
          <button className="add-employee-button" onClick={handleAddEmployee}>
           Add Employee
          </button>
        </div>

        {/* Employee List */}
        <div className="employee-list">
          {filteredEmployees.map((employee: Employee) => (
            <div 
              key={employee.id}
              className="employee-item"
              onClick={() => handleEmployeeDetails(employee)}
            > 
            
              <div className="employee-info">
                <img src={employee.avatar} alt="" className="employee-avatar" />
              
              <div>
                <h3 className="employee-name">{employee.name}</h3>
                <p className="employee-position">{employee.position}</p>
              </div>
              </div>
            
          </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <h3 className="empty-state-title">No employees found</h3>
            <p className="empty-state-text">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    
    </>
  );
};

export default EmployeeManagement;