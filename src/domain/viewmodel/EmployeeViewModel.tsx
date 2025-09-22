import { useState, useCallback, useMemo } from 'react';
import { AddEmployeeUseCase } from '../usecases/AddEmployeeUseCase';
import { GetEmployeesByManagerUseCase } from '../usecases/GetEmployeesByManagerUseCase';
import { AddEmployeeRequest, AddEmployeeResponse, GetEmployeesByManagerRequest, GetEmployeesByManagerResponse } from '../repositories/EmployeeRepository';

export class EmployeeViewModel {
  constructor(
    private addEmployeeUseCase: AddEmployeeUseCase,
    private getEmployeesByManagerUseCase: GetEmployeesByManagerUseCase
  ) {}

  async addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    return await this.addEmployeeUseCase.execute(request);
  }

  async getEmployeesByManager(request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse> {
    return await this.getEmployeesByManagerUseCase.execute(request);
  }
}

// React Hook for Employee Operations
export const useEmployeeViewModel = (
  addEmployeeUseCase: AddEmployeeUseCase,
  getEmployeesByManagerUseCase: GetEmployeesByManagerUseCase
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const viewModel = useMemo(() => new EmployeeViewModel(addEmployeeUseCase, getEmployeesByManagerUseCase), [addEmployeeUseCase, getEmployeesByManagerUseCase]);

  const addEmployee = useCallback(async (request: AddEmployeeRequest): Promise<AddEmployeeResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await viewModel.addEmployee(request);
      
      if (response.success) {
        setSuccess(response.message);
      } else {
        setError(response.message || 'Failed to add employee');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        error: 'UNKNOWN_ERROR'
      };
    } finally {
      setIsLoading(false);
    }
  }, [viewModel]);

  const getEmployeesByManager = useCallback(async (request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await viewModel.getEmployeesByManager(request);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch employees';
      setError(errorMessage);
      return {
        employees: [],
        total_count: 0,
        manager: '',
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [viewModel]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    addEmployee,
    getEmployeesByManager,
    isLoading,
    error,
    success,
    clearMessages
  };
};