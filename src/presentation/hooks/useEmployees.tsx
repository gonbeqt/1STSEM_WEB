import { useState, useEffect, useCallback } from 'react';
import { container } from '../../di/container';
import { useEmployeeViewModel } from '../../domain/viewmodel/EmployeeViewModel';
import { Employee as ApiEmployee, AddEmployeeRequest, AddEmployeeResponse } from '../../domain/repositories/EmployeeRepository';

export interface UseEmployeesReturn {
  employees: ApiEmployee[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  
  fetchEmployees: () => Promise<void>;
  addEmployee: (request: AddEmployeeRequest) => Promise<AddEmployeeResponse>;
  refreshEmployees: () => void;
  clearMessages: () => void;
}

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await getEmployeesByManager({});
      
      if (response.success) {
        setEmployees(response.employees);
      } else {        setEmployees([]);
      }
    } catch (error) {      setEmployees([]);
    }
  }, [getEmployeesByManager]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, refreshTrigger]);

  const addEmployee = async (request: AddEmployeeRequest): Promise<AddEmployeeResponse> => {
    const response = await addEmployeeAction(request);
    
    if (response.success) {
      setRefreshTrigger(prev => prev + 1);
    }
    
    return response;
  };

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