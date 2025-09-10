import React, { useState } from 'react';
import './management.css';
import { Plus, Search, MoreVertical, User, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import InputWithIcon from '../../../Components/InputWithIcon';
import SearchIcon from '../../../Components/icons/SearchIcon';
import { useNavigate } from 'react-router-dom';
import AddEmployee from './AddEmployee/AddEmployeeModal';
import EmployeeDetailModal from './EmployeeDetailModal/EmployeeDetailModal';

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

// Extended interface for detail view (matching the modal component)
interface DetailedEmployee {
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

const EmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddEmployeeModal, setIsAddEmployeeModal] = useState(false);
  const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<DetailedEmployee | null>(null);

  const handleAddEmployee = () => {
    setIsAddEmployeeModal(true);
  };

  // Sample payroll data matching the modal interface
  const samplePayrollData: PayrollData = {
    currentPeriod: {
      gross: 3500.00,
      netPay: 2650.00,
      yearToDate: 42000.00,
      deductions: {
        federal: 420.00,
        stateTax: 150.00,
        medicare: 50.75,
        socialSecurity: 217.00,
        dental: 12.25,
      },
    },
    paymentHistory: [
      {
        date: '2023-05-31',
        amount: 3350.00,
        period: 'May 2023',
        payDate: 'May 31, 2023',
      },
      {
        date: '2023-05-15',
        amount: 3250.00,
        period: 'May 2023',
        payDate: 'May 15, 2023',
      },
      {
        date: '2023-04-30',
        amount: 3350.00,
        period: 'Apr 2023',
        payDate: 'Apr 30, 2023',
      },
    ],
  };

  const sampleDocuments: Document[] = [
    {
      id: '1',
      name: 'Employment Contract',
      type: 'PDF',
      uploadedDate: '2023-01-15',
      status: 'Active',
    },
    {
      id: '2',
      name: 'NDA Agreement',
      type: 'PDF',
      uploadedDate: '2023-02-01',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Tax Forms',
      type: 'PDF',
      uploadedDate: '2023-10-01',
      status: 'Active',
    },
  ];

  const handleEmployeeDetails = (employee: Employee) => {
    // Convert employee data to detailed format
    const detailed: DetailedEmployee = {
      id: employee.id.toString(),
      fullName: employee.name,
      employeeId: `EMP-${employee.id.toString().padStart(3, '0')}`,
      emailAddress: employee.email,
      phoneNumber: employee.phone,
      position: employee.position,
      department: employee.department,
      baseSalary: employee.salary,
      paymentSchedule: 'Weekly',
      employmentType: 'Full-time',
      startDate: employee.hireDate,
      dateOfBirth: '1990-01-01',
      address: '123 Main Street, New York, NY 10001',
      gender: 'Female',
      nationality: 'American',
      status: employee.status === 'active' ? 'Active' : 'Inactive',
      profileImage: employee.avatar,
    };

    setSelectedEmployee(detailed);
    setShowEmployeeDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowEmployeeDetailModal(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = () => {
    console.log('Edit employee:', selectedEmployee?.fullName);
    // Close the detail modal and open the add employee modal for editing
    setShowEmployeeDetailModal(false);
    setIsAddEmployeeModal(true);
  };

  const handleDeleteEmployee = () => {
    console.log('Delete employee:', selectedEmployee?.fullName);
    // Implement delete functionality
    if (window.confirm(`Are you sure you want to delete ${selectedEmployee?.fullName}?`)) {
      // Here you would typically call an API to delete the employee
      // For now, just close the modal
      handleCloseModal();
      // You could also remove the employee from the local state/refetch data
    }
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

  const handleAddEmployeeSubmit = (employee: any) => {
    console.log('New employee submitted:', employee);
    // Implement your add employee logic here
    setIsAddEmployeeModal(false);
  };

  return (
    <>
      <div className="employee-management">
        {/* Header */}
        <div className="header56">
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
                <img src={employee.avatar} alt={employee.name} className="employee-avatar" />

                <div className="employee-container">
                  <div className="employee-first">
                    <h3 className="employee-name1">{employee.name}</h3>
                    <p className='employee-salary1'>${employee.salary.toLocaleString()}</p>
                  </div>
                  <div className="employee-second">
                    <p className="employee-position1">{employee.position}</p>
                    <p className="employee-netpay1">Net pay</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <h3 className="empty-state-title">No employees found</h3>
          </div>
        )}

        {/* Add Employee Modal */}
        <AddEmployee
          isOpen={isAddEmployeeModal}
          onClose={() => setIsAddEmployeeModal(false)}
          onSubmit={handleAddEmployeeSubmit}
        />

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <EmployeeDetailModal
            isOpen={showEmployeeDetailModal}
            employee={selectedEmployee}
            payrollData={samplePayrollData}
            documents={sampleDocuments}
            onClose={handleCloseModal}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        )}
      </div>
    </>
  );
};

export default EmployeeManagement;