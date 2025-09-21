import { useState, useEffect } from 'react';
import { container } from '../../di/container';
import { Employee, GetEmployeesByManagerRequest } from '../../domain/repositories/EmployeeRepository';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const request: GetEmployeesByManagerRequest = {}; // No specific request params for now
      const response = await container.getEmployeesByManagerUseCase.execute(request);
      if (response.success && response.employees) {
        setEmployees(response.employees);
      } else {
        setError(response.error || 'Failed to fetch employees');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []); // Fetch employees on component mount

  return {
    employees,
    isLoading,
    error,
    fetchEmployees, // Allow refreshing the list
  };
};
