
// src/Presentation/pages/manager/home/Modal/Payroll/PayrollModal.tsx
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { container } from '../../../../../../di/container';
import { usePayrollViewModel } from '../../../../../../domain/viewmodel/PayrollViewModel';
import { useEmployeeViewModel } from '../../../../../../domain/viewmodel/EmployeeViewModel';
import { CreatePayrollEntryRequest, PayrollEmployee as PayrollEmployeeEntity } from '../../../../../../domain/entities/PayrollEntities';
import { Employee as ApiEmployee } from '../../../../../../domain/repositories/EmployeeRepository';

interface PayrollEmployeeUI {
  id: string;
  user_id: string; // Employee's user_id for backend API
  name: string;
  amount: number;
  status: string;
  selected: boolean;
  email: string;
  department: string;
  position: string;
}

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (data: any) => void;
}

const PayrollModal: React.FC<PayrollModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [payrollType, setPayrollType] = useState<string>('Regular Payroll');
  const [payPeriodStart, setPayPeriodStart] = useState<string>('');
  const [payPeriodEnd, setPayPeriodEnd] = useState<string>('');
  const [payDate, setPayDate] = useState<string>('');
  const [processStatus, setProcessStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const { createPayrollEntry, processPayrollPayment, isLoading, error, success, clearMessages } = usePayrollViewModel(
    container.createPayrollEntryUseCase,
    container.processPayrollPaymentUseCase
  );
  
  const [employees, setEmployees] = useState<PayrollEmployeeUI[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);
  
  const { getEmployeesByManager, isLoading: isLoadingEmployeesFromAPI } = useEmployeeViewModel(
    container.addEmployeeUseCase,
    container.getEmployeesByManagerUseCase,
    container.removeEmployeeFromTeamUseCase
  );

  // Initialize dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setPayPeriodStart(today);
      setPayPeriodEnd(today);
      setPayDate(today);
    }
  }, [isOpen]);

  // Fetch employees when modal opens
  useEffect(() => {
    const fetchEmployees = async () => {
      if (isOpen && employees.length === 0) {
        setIsLoadingEmployees(true);
        try {
          const response = await getEmployeesByManager({});
          if (response.success && response.employees) {
            // Convert API employees to PayrollEmployeeUI format
            const payrollEmployees: PayrollEmployeeUI[] = response.employees.map((emp: ApiEmployee) => ({
              id: emp.employee_id || emp.user_id,
              user_id: emp.user_id, // Store the actual user_id for backend API
              name: emp.full_name || emp.username,
              amount: 0, // Default amount, can be set by user
              status: emp.is_active ? 'Active' : 'Inactive',
              selected: true, // Default to selected
              email: emp.email,
              department: emp.department || 'General',
              position: emp.position || 'Employee'
            }));
            setEmployees(payrollEmployees);
          }
        } catch (error) {
          console.error('Error fetching employees:', error);
          setErrorMessage('Failed to load employees. Please try again.');
          setProcessStatus('error');
        } finally {
          setIsLoadingEmployees(false);
        }
      }
    };

    fetchEmployees();
  }, [isOpen, getEmployeesByManager, employees.length]);

  const toggleEmployee = (id: string) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, selected: !emp.selected } : emp
      )
    );
  };

  const updateEmployeeAmount = (id: string, amount: number) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, amount } : emp
      )
    );
  };

  const getTotalAmount = (): number => {
    return employees
      .filter(emp => emp.selected)
      .reduce((sum, emp) => sum + emp.amount, 0);
  };

  const handleProcess = async () => {
    const selectedEmployees = employees.filter(emp => emp.selected);
    
    if (selectedEmployees.length === 0) {
      setErrorMessage('Please select at least one employee to process payroll.');
      setProcessStatus('error');
      return;
    }

    setProcessStatus('processing');
    clearMessages();

    try {
      // Convert UI employees to PayrollEmployee entities
      const payrollEmployees: PayrollEmployeeEntity[] = selectedEmployees.map((employee) => ({
        employee_id: employee.id,
        user_id: employee.user_id, // Include user_id for backend processing
        employee_name: employee.name,
        employee_email: employee.email,
        department: employee.department,
        position: employee.position,
        salary_amount: employee.amount,
        salary_currency: 'USD',
        overtime_pay: 0,
        bonus: 0,
        allowances: 0,
        tax_deduction: 0,
        insurance_deduction: 0,
        retirement_deduction: 0,
        other_deductions: 0
      }));

      // Create payroll entries for each employee (backend expects individual entries)
      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const employee of payrollEmployees) {
        const payrollRequest = {
          employee_id: employee.employee_id, // Backend expects employee_id, not employee_user_id
          employee_user_id: employee.user_id, // Keep for reference
          payroll_type: payrollType,
          pay_period_start: payPeriodStart,
          pay_period_end: payPeriodEnd,
          pay_date: payDate,
          start_date: payPeriodStart,
          payment_date: payDate,
          employee_name: employee.employee_name,
          employee_wallet: employee.employee_wallet || undefined,
          salary_amount: employee.salary_amount,
          salary_currency: employee.salary_currency || 'USDC',
          payment_frequency: 'MONTHLY',
          amount: employee.salary_amount, // Use salary_amount as amount
          cryptocurrency: employee.salary_currency || 'USDC',
          notes: `Payroll processed for ${payrollType} - ${employee.employee_name}`
        };

        console.log('🔄 Sending payroll request for employee:', employee.employee_name, payrollRequest);
        
        try {
          // Call the repository directly for individual payroll entries
          const repositoryResult = await container.payslipRepository.createSinglePayrollEntry(payrollRequest);
          
          const result = {
            success: true,
            payroll_entry: repositoryResult,
            message: 'Payroll entry created successfully'
          };
          
          results.push(result);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('❌ Error creating payroll for employee:', employee.employee_name, error);
          results.push({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      const result = {
        success: successCount > 0,
        successCount,
        errorCount,
        totalEmployees: payrollEmployees.length,
        results
      };
      
      if (result.success) {
        if (result.errorCount === 0) {
          setSuccessMessage(`Successfully created payroll entries for all ${result.successCount} employees!`);
        } else {
          setSuccessMessage(`Created payroll entries for ${result.successCount} employees. ${result.errorCount} failed.`);
        }
        setProcessStatus('success');
        
        // Call the original onProcess callback with the results
        onProcess({
          payrollType,
          payPeriodStart,
          payPeriodEnd,
          payDate,
          employees: selectedEmployees,
          total: getTotalAmount(),
          payrollEntryId: (() => {
            const successResult = result.results.find(r => r.success && 'payroll_entry' in r);
            return successResult && 'payroll_entry' in successResult ? successResult.payroll_entry.entry_id : 'multiple';
          })(),
          payrollEntry: result
        });
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setErrorMessage(`Failed to create payroll entries. ${result.errorCount} out of ${result.totalEmployees} failed.`);
        setProcessStatus('error');
      }
    } catch (error) {
      console.error('Error processing payroll:', error);
      setErrorMessage('An unexpected error occurred while processing payroll.');
      setProcessStatus('error');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-5 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 m-0">Process Payroll</h2>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4 leading-normal">
            Process automated batch payments for your employees with calculated deductions and taxes.
          </p>

          {/* Status Messages */}
          {processStatus === 'processing' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-800 font-medium">Processing payroll...</p>
              </div>
            </div>
          )}

          {processStatus === 'success' && successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-800 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {processStatus === 'error' && (errorMessage || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800 font-medium">{errorMessage || error}</p>
              </div>
            </div>
          )}

          {/* Payroll Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payroll Type
            </label>
            <select
              value={payrollType}
              onChange={(e) => setPayrollType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
            >
              <option>Regular Payroll</option>
              <option>Bonus Payroll</option>
              <option>Special Payroll</option>
            </select>
          </div>

          {/* Pay Period */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Period Start
              </label>
              <input
                type="date"
                value={payPeriodStart}
                onChange={(e) => setPayPeriodStart(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Period End
              </label>
              <input
                type="date"
                value={payPeriodEnd}
                onChange={(e) => setPayPeriodEnd(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
              />
            </div>
          </div>

          {/* Pay Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Date
            </label>
            <input
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
            />
          </div>

          {/* Employees */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Employees to be paid
              </label>
              <span className="text-xs text-gray-600">
                {employees.filter(emp => emp.selected).length} selected
              </span>
            </div>
            
            <div className="max-h-64 overflow-y-auto pr-1">
              {isLoadingEmployees ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">Loading employees...</span>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No employees found</p>
                </div>
              ) : (
                employees.map((employee) => (
                  <div key={employee.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-md mb-3 last:mb-0 transition-colors hover:border-gray-300">
                    <input
                      type="checkbox"
                      checked={employee.selected}
                      onChange={() => toggleEmployee(employee.id)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 m-0 mb-1">{employee.name}</p>
                          <p className="text-xs text-gray-600 m-0">{employee.department} • {employee.position}</p>
                          <p className="text-xs text-gray-500 m-0">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 font-medium">Amount:</label>
                        <input
                          type="number"
                          value={employee.amount}
                          onChange={(e) => updateEmployeeAmount(employee.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span className="text-xs text-gray-500">USD</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ${getTotalAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
            </div>
          </div>

          {/* Notices */}
          <div className="mb-4 space-y-3">
            <div className="flex gap-2 p-3 bg-blue-50 rounded-md">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-900 m-0 mb-1">Payroll Payment Notice</p>
                <p className="text-xs text-blue-900 m-0 leading-normal">
                  This will initiate payment processing for selected employees. Ensure addresses,
                  bank information, and tax data are up-to-date before processing.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 p-3 bg-yellow-50 rounded-md">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-yellow-900 m-0 mb-1">Important Notice</p>
                <p className="text-xs text-yellow-900 m-0 leading-normal">
                  Review employee information, communication preferences, and
                  personal data before final submission. Errors or corrections should be resolved before
                  submitting to Payroll Service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 p-2 rounded-md text-sm font-medium cursor-pointer transition-all border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={employees.filter(emp => emp.selected).length === 0 || processStatus === 'processing'}
            className="flex-1 p-2 rounded-md text-sm font-medium cursor-pointer transition-all text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center gap-2"
            type="button"
          >
            {processStatus === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Payroll'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PayrollModal;