import React, { useState } from 'react';
import './management.css';

import InputWithIcon from '../../../components/InputWithIcon';
import SearchIcon from '../../../components/icons/SearchIcon';

import AddEmployee from './AddEmployee/page';
import EmployeeDetailModal from './EmployeeDetailModal/EmployeeDetailModal';
import { useEmployees } from '../../../hooks/useEmployees';
import { AddEmployeeResponse, Employee as ApiEmployee } from '../../../../domain/repositories/EmployeeRepository';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddEmployeeModal, setIsAddEmployeeModal] = useState(false);
  const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<DetailedEmployee | null>(null);

  const { employees, isLoading: isLoadingEmployees, error: employeesError, fetchEmployees } = useEmployees();

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

  const handleEmployeeDetails = (employee: ApiEmployee) => {
    // Convert employee data to detailed format
    const detailed: DetailedEmployee = {
      id: employee.user_id,
      fullName: employee.full_name || employee.username,
      employeeId: employee.employee_id || employee.user_id,
      emailAddress: employee.email,
      phoneNumber: employee.phone || 'N/A',
      position: employee.position || 'N/A',
      department: employee.department || 'N/A',
      baseSalary: 0, // Assuming salary is not part of this API response
      paymentSchedule: 'Weekly',
      employmentType: 'Full-time',
      startDate: employee.hired_date || employee.created_at,
      dateOfBirth: 'N/A',
      address: 'N/A',
      gender: 'N/A',
      nationality: 'N/A',
      status: employee.is_active ? 'Active' : 'Inactive',
      profileImage: 'https://randomuser.me/api/portraits/men/avatar.jpg', // Placeholder
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

  const filteredEmployees = employees.filter((employee: ApiEmployee) => {
    const matchesSearch = employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddEmployeeSubmit = (newEmployee: AddEmployeeResponse['employee']) => {
    console.log('New employee added successfully:', newEmployee);
    fetchEmployees(); // Refresh the list after adding a new employee
    // Optionally, show a success toast or message on the management page
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
          {isLoadingEmployees ? (
            <p>Loading employees...</p>
          ) : employeesError ? (
            <p className="error-message">Error: {employeesError}</p>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-state-title">No employees found</h3>
            </div>
          ) : (
            filteredEmployees.map((employee: ApiEmployee) => (
              <div
                key={employee.user_id}
                className="employee-item"
                onClick={() => handleEmployeeDetails(employee)}
              >
                <div className="employee-info">
                  <img src={'https://randomuser.me/api/portraits/men/avatar.jpg'} alt={employee.full_name || employee.username} className="employee-avatar" />

                  <div className="employee-container">
                    <div className="employee-first">
                      <h3 className="employee-name1">{employee.full_name || employee.username}</h3>
                      <p className='employee-salary1'>Position: {employee.position || 'N/A'}</p>
                    </div>
                    <div className="employee-second">
                      <h5 className="employee-position1">{employee.department || 'N/A'}</h5>
                      <p className="employee-netpay1">Status: {employee.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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