// src/Presentation/hooks/useEmployees.tsx
import { useState, useEffect, useCallback } from 'react';
import { container } from '../../di/container';
import { useEmployeeViewModel } from '../../domain/viewmodel/EmployeeViewModel';
import { Employee as ApiEmployee, AddEmployeeRequest, AddEmployeeResponse } from '../../domain/repositories/EmployeeRepository';

export interface UseEmployeesReturn {
  employees: ApiEmployee[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  
  // Actions
  fetchEmployees: () => Promise<void>;
  addEmployee: (request: AddEmployeeRequest) => Promise<AddEmployeeResponse>;
  refreshEmployees: () => void;
  clearMessages: () => void;
}

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Use the Employee ViewModel
  const { 
    addEmployee: addEmployeeAction,
    getEmployeesByManager, 
    isLoading, 
    error,
    success,
    clearMessages
  } = useEmployeeViewModel(
    container.addEmployeeUseCase, 
    container.getEmployeesByManagerUseCase,
    container.removeEmployeeFromTeamUseCase
  );

  // Fetch employees function
  const fetchEmployees = useCallback(async () => {
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
  }, [getEmployeesByManager]);

  // Fetch employees on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, refreshTrigger]);

  // Add employee with automatic refresh
  const addEmployee = async (request: AddEmployeeRequest): Promise<AddEmployeeResponse> => {
    const response = await addEmployeeAction(request);
    
    // If successful, refresh the employee list
    if (response.success) {
      setRefreshTrigger(prev => prev + 1);
    }
    
    return response;
  };

  // Manual refresh function
  const refreshEmployees = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    employees,
    isLoading,
    error,
    success,
    fetchEmployees,
    addEmployee,
    refreshEmployees,
    clearMessages
  };
};