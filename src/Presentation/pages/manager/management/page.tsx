import React, { useState, useEffect } from 'react';
import InputWithIcon from '../../../components/InputWithIcon';
import SearchIcon from '../../../components/icons/SearchIcon';
import AddEmployee from './AddEmployee/page';
import EmployeeDetailModal from './EmployeeDetailModal/EmployeeDetailModal';
import { container } from '../../../../di/container';
import { useEmployeeViewModel } from '../../../../domain/viewmodel/EmployeeViewModel';
import { Employee as ApiEmployee, AddEmployeeResponse } from '../../../../domain/repositories/EmployeeRepository';

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
  const [selectedApiEmployee, setSelectedApiEmployee] = useState<ApiEmployee | null>(null);
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    getEmployeesByManager,
    removeEmployeeFromTeam,
    isLoading: isLoadingEmployees,
    error: employeesError
  } = useEmployeeViewModel(
    container.addEmployeeUseCase,
    container.getEmployeesByManagerUseCase,
    container.removeEmployeeFromTeamUseCase
  );

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log('Fetching employees...');
        const response = await getEmployeesByManager({});

        if (response.success) {
          console.log('Employees fetched successfully:', response.employees);
          setEmployees(response.employees);
        } else {
          console.error('Failed to fetch employees:', response.error);
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, [refreshTrigger, getEmployeesByManager]);

  const handleAddEmployee = () => {
    setIsAddEmployeeModal(true);
  };

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
    const detailed: DetailedEmployee = {
      id: employee.user_id,
      fullName: employee.full_name || employee.username,
      employeeId: employee.employee_id || employee.user_id,
      emailAddress: employee.email,
      phoneNumber: employee.phone || 'N/A',
      position: employee.position || 'N/A',
      department: employee.department || 'N/A',
      baseSalary: 0,
      paymentSchedule: 'Weekly',
      employmentType: 'Full-time',
      startDate: employee.hired_date || employee.created_at,
      dateOfBirth: 'N/A',
      address: 'N/A',
      gender: 'N/A',
      nationality: 'N/A',
      status: employee.is_active ? 'Active' : 'Inactive',
      profileImage: employee.profileImage || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=User',
    };

    setSelectedEmployee(detailed);
    setSelectedApiEmployee(employee);
    setShowEmployeeDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowEmployeeDetailModal(false);
    setSelectedEmployee(null);
    setSelectedApiEmployee(null);
  };

  const handleEditEmployee = () => {
    console.log('Edit employee:', selectedEmployee?.fullName);
    setShowEmployeeDetailModal(false);
    setIsAddEmployeeModal(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    console.log('Remove employee from team:', selectedEmployee.fullName);
    const confirmMessage = `Are you sure you want to remove ${selectedEmployee.fullName} from your team? They will become available for other managers to assign.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await removeEmployeeFromTeam({
          username: selectedEmployee.emailAddress // Use email address instead of username
        });
        
        if (response.success) {
          console.log('Employee removed successfully:', response.message);
          // Refresh the employee list
          setRefreshTrigger(prev => prev + 1);
          handleCloseModal();
        } else {
          console.error('Failed to remove employee:', response.message);
          alert(`Failed to remove employee: ${response.message}`);
        }
      } catch (error) {
        console.error('Error removing employee:', error);
        alert('An error occurred while removing the employee. Please try again.');
      }
    }
  };

  const filteredEmployees = employees.filter((employee: ApiEmployee) => {
    const matchesSearch = employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddEmployeeSubmit = (newEmployee: AddEmployeeResponse['employee']) => {
    console.log('New employee added successfully:', newEmployee);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full h-full rounded-xl p-6 bg-gray-100 animate-slideIn text-gray-900 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 m-0 leading-tight md:text-xl">Employee List</h1>
      </div>

      {/* Search and Add Employee */}
      <div className="flex flex-row justify-between items-center mb-6 gap-3">
        <div className="flex-1 min-w-100">
          <InputWithIcon
            icon={<SearchIcon />}
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none rounded-lg px-6 py-3.5 text-sm font-semibold hover:from-purple-600 hover:to-purple-700 hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0"
          onClick={handleAddEmployee}
        >
          Add Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="flex flex-col gap-3">
        {isLoadingEmployees ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-base relative after:content-[''] after:inline-block after:w-5 after:h-5 after:border-2 after:border-gray-300 after:border-t-purple-500 after:rounded-full after:animate-spin after:ml-2 after:align-middle">
              Loading employees...
            </p>
          </div>
        ) : employeesError ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-600 text-base font-medium mb-4">Error: {employeesError}</p>
            <button
              className="bg-red-600 text-white border-none rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-red-700 transition-colors"
              onClick={() => setRefreshTrigger(prev => prev + 1)}
            >
              Retry
            </button>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-xl border-2 border-dashed border-gray-300 my-5">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No employees found matching your search' : 'No employees found'}
            </h3>
            {!searchTerm && (
              <p className="text-gray-600 text-sm text-center mt-2">
                Click "Add Employee" to get started
              </p>
            )}
          </div>
        ) : (
          filteredEmployees.map((employee: ApiEmployee) => (
            <div
              key={employee.user_id}
              className="flex items-center bg-white rounded-xl p-5 border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 hover:border-purple-500 hover:shadow-md hover:-translate-y-0.5 transition-all"
              onClick={() => handleEmployeeDetails(employee)}
            >
              <div className="flex items-center gap-4 w-full">
                <img
                  src={employee.profileImage || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=User'}
                  alt={employee.full_name || employee.username}
                  className="rounded-full w-14 h-14 object-cover border-2 border-gray-200 flex-shrink-0 hover:scale-105 transition-transform md:w-12 md:h-12"
                />
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 m-0 overflow-hidden text-ellipsis whitespace-nowrap md:text-base">
                        {employee.full_name || employee.username}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium m-0 md:text-xs">
                        Position: {employee.position || 'N/A'}
                      </p>
                    </div>
                    <p className="text-xs text-green-800 bg-green-100 px-3 py-1 rounded-full font-medium uppercase tracking-wide m-0 flex-shrink-0 md:text-[11px]">
                      STATUS: {employee.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <h5 className="text-sm text-purple-500 font-medium m-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1 md:text-xs">
                      {employee.department || 'N/A'}
                    </h5>
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
          onRemoveFromTeam={handleDeleteEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;