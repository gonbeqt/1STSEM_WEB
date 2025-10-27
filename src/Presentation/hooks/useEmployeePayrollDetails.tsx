import { useState, useCallback } from 'react';
import { GetEmployeePayrollDetailsUseCase } from '../../domain/usecases/GetEmployeePayrollDetailsUseCase';
import { EmployeePayrollDetails } from '../../domain/entities/PayrollEntities';

export const useEmployeePayrollDetails = (
  getEmployeePayrollDetailsUseCase: GetEmployeePayrollDetailsUseCase
) => {
  const [payrollDetails, setPayrollDetails] = useState<EmployeePayrollDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);

  const fetchEmployeePayrollDetails = useCallback(async (employeeId: string) => {
    if (currentEmployeeId === employeeId && (isLoading || payrollDetails)) {
      return { success: true, employee_payroll: payrollDetails };
    }

    try {
      setCurrentEmployeeId(employeeId);
      setIsLoading(true);
      setError(null);
      
      
      const response = await getEmployeePayrollDetailsUseCase.execute({ employee_id: employeeId });
      
      if (response.success) {
        let payrollData: EmployeePayrollDetails | null = null;
        
        if (response.employee_payroll) {
          payrollData = response.employee_payroll;
        } else if (response.payroll_entries || response.payslips) {
          payrollData = {
            employee_id: response.employee_details?.employee_id || employeeId,
            employee_name: response.employee_details?.full_name || '',
            employee_email: response.employee_details?.email || '',
            department: '',
            position: '',
            total_payslips: response.payslips?.length || 0,
            total_earnings: response.payroll_entries?.reduce((sum, entry) => sum + (entry.salary_amount || 0), 0) || 0,
            total_deductions: 0,
            net_pay: response.payroll_entries?.reduce((sum, entry) => sum + (entry.amount || 0), 0) || 0,
            currency: response.payroll_entries?.[0]?.salary_currency || 'USD',
            payroll_entries: response.payroll_entries || [],
            recent_payslips: response.payslips || []
          };
        }
        
        setPayrollDetails(payrollData);
        
        if (payrollData) {
        } else {
        }
        setError(null); // Clear any previous errors
      } else {
        setError(response.error || 'Failed to fetch employee payroll details');
        setPayrollDetails(null);      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setPayrollDetails(null);      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [getEmployeePayrollDetailsUseCase, currentEmployeeId, isLoading, payrollDetails]);

  const clearPayrollDetails = useCallback(() => {
    setPayrollDetails(null);
    setError(null);
    setCurrentEmployeeId(null);
  }, []);

  return {
    payrollDetails,
    isLoading,
    error,
    fetchEmployeePayrollDetails,
    clearPayrollDetails
  };
};
