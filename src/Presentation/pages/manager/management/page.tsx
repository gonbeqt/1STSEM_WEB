import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import InputWithIcon from '../../../components/InputWithIcon';
import SearchIcon from '../../../components/icons/SearchIcon';
import AddEmployee from './AddEmployee/page';
import EmployeeDetailModal from './EmployeeDetailModal/EmployeeDetailModal';
import { container } from '../../../../di/container';
import { useEmployeeViewModel } from '../../../../domain/viewmodel/EmployeeViewModel';
import { Employee as ApiEmployee, AddEmployeeResponse } from '../../../../domain/repositories/EmployeeRepository';
import ManagerNavbar from '../../../components/ManagerNavbar';
import Skeleton, { SkeletonCircle, SkeletonText } from '../../../components/Skeleton';
import { DetailedEmployee, filterEmployeesList, getEmployeeDisplayName, getEmployeeInitial, getStatusBadgeClass, mapApiEmployeeToDetailed } from './utils';
 
const EmployeeManagement: React.FC = () => {
  const { error: toastError, success: toastSuccess, info: toastInfo, warning: toastWarning } = useToast();
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
        const response = await getEmployeesByManager({});

        if (response.success) {
          setEmployees(response.employees);
        } else {          setEmployees([]);
        }
      } catch (error) {        setEmployees([]);
      }
    };

    fetchEmployees();
  }, [refreshTrigger, getEmployeesByManager]);

  const handleAddEmployee = () => {
    setIsAddEmployeeModal(true);
  };

  const handleEmployeeDetails = (employee: ApiEmployee) => {
    const detailed: DetailedEmployee = mapApiEmployeeToDetailed(employee);
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
    setShowEmployeeDetailModal(false);
    setIsAddEmployeeModal(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      const response = await removeEmployeeFromTeam({
        username: selectedEmployee.emailAddress // Use email address instead of username
      });

      if (response.success) {
        setRefreshTrigger(prev => prev + 1);
        handleCloseModal();
        toastSuccess('Employee removed successfully.');
      } else {        toastError(`Failed to remove employee: ${response.message}`);
      }
    } catch (error) {      toastError('An error occurred while removing the employee. Please try again.');
    }
  };

  const filteredEmployees = filterEmployeesList(employees, searchTerm);

  const handleAddEmployeeSubmit = (newEmployee: AddEmployeeResponse['employee']) => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
            <ManagerNavbar />
      
      <div className="w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
        </div>

        {/* Search and Add Employee */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <InputWithIcon
              icon={<SearchIcon />}
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-600 text-white border-none rounded-lg px-6 py-3 text-sm font-semibold hover:bg-purple-700 hover:shadow-lg transition-all duration-200 whitespace-nowrap flex-shrink-0"
            onClick={handleAddEmployee}
          >
            Add Employee
          </button>
        </div>

        {/* Employee List */}
        <div className="space-y-4">
          {isLoadingEmployees ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                >
                  <SkeletonCircle className="h-12 w-12" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <SkeletonText className="w-48 h-5" />
                    <SkeletonText className="w-36" />
                    <SkeletonText className="w-28" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : employeesError ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-red-50 rounded-xl border border-red-200 shadow-sm">
              <p className="text-red-600 text-base font-medium mb-4">Error: {employeesError}</p>
              <button
                className="bg-red-600 text-white border-none rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-red-700 transition-colors"
                onClick={() => setRefreshTrigger(prev => prev + 1)}
              >
                Retry
              </button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
              <div className="rounded-3xl border border-dashed border-purple-200 bg-purple-50/60 px-10 py-14 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No employees found matching your search' : 'No employees found'}
                </h3>
                {!searchTerm && (
                  <p className="text-sm text-gray-500 mt-3">
                    Click “Add Employee” to get started.
                  </p>
                )}
              </div>
            </div>
          ) : (
            filteredEmployees.map((employee: ApiEmployee) => (
              <div
                key={employee.user_id}
                className="flex items-center bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                onClick={() => handleEmployeeDetails(employee)}
              >
                <div className="flex items-center gap-4 w-full">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-700 flex-shrink-0">
                    {employee.profileImage ? (
                      <img 
                        src={employee.profileImage} 
                        alt={getEmployeeDisplayName(employee)} 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    ) : (
                      getEmployeeInitial(employee)
                    )}
                  </div>
                  
                  {/* Employee Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {getEmployeeDisplayName(employee)}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          Position: {employee.position || 'N/A'}
                        </p>
                        <p className="text-sm text-purple-600 font-medium">
                          {employee.department || 'N/A'}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusBadgeClass(employee.is_active)}`}>
                          {employee.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployee
        isOpen={isAddEmployeeModal}
        onClose={() => setIsAddEmployeeModal(false)}
        onSubmit={handleAddEmployeeSubmit}
      />

      {/* Employee Detail Modal */}
      {selectedApiEmployee && selectedEmployee && (
        <EmployeeDetailModal
          isOpen={showEmployeeDetailModal}
          employee={selectedApiEmployee}
          onClose={handleCloseModal}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onRemoveFromTeam={() => { void handleDeleteEmployee(); }}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;