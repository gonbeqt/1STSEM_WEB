import { useState } from 'react';
import { container } from '../../di/container';
import { AddEmployeeRequest, AddEmployeeResponse } from '../../domain/repositories/EmployeeRepository';

export const useAddEmployee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addEmployee = async (request: AddEmployeeRequest): Promise<AddEmployeeResponse['employee'] | null> => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response: AddEmployeeResponse = await container.addEmployeeUseCase.execute(request);
      if (response.success && response.employee) {
        setSuccessMessage(response.message);
        return response.employee;
      } else {
        setError(response.message || 'Failed to add employee');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addEmployee,
    isLoading,
    error,
    successMessage,
    setError, // Allow clearing errors from component
    setSuccessMessage, // Allow clearing success messages from component
  };
};
