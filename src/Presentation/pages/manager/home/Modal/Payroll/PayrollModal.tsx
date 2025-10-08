
// src/Presentation/pages/manager/home/Modal/Payroll/PayrollModal.tsx
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { container } from '../../../../../../di/container';
import { usePayrollViewModel } from '../../../../../../domain/viewmodel/PayrollViewModel';
import { useEmployeeViewModel } from '../../../../../../domain/viewmodel/EmployeeViewModel';
import type {
  PayrollEmployee as PayrollEmployeeEntity,
  ProcessPayrollPaymentResponse
} from '../../../../../../domain/entities/PayrollEntities';
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
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [activeAction, setActiveAction] = useState<'create' | 'process' | null>(null);
  const [createdEntries, setCreatedEntries] = useState<CreatedPayrollEntry[]>([]);
  const [lastCreationSummary, setLastCreationSummary] = useState<PayrollCreationSummary | null>(null);
  const [manualEntryId, setManualEntryId] = useState<string>('');
  const [manualProcessingStatus, setManualProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [manualProcessingError, setManualProcessingError] = useState<string>('');
  const [manualSuccessMessage, setManualSuccessMessage] = useState<string>('');

  const { error, clearMessages, processPayrollPayment } = usePayrollViewModel(
    container.createPayrollEntryUseCase,
    container.processPayrollPaymentUseCase
  );
  
  const [employees, setEmployees] = useState<PayrollEmployeeUI[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);
  
  const { getEmployeesByManager } = useEmployeeViewModel(
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
      setProcessStatus('idle');
      setErrorMessage('');
      setSuccessMessage('');
      setProcessingMessage('');
      setActiveAction(null);
      setCreatedEntries([]);
      setLastCreationSummary(null);
      setManualEntryId('');
      setManualProcessingStatus('idle');
      setManualProcessingError('');
      setManualSuccessMessage('');
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

  const selectedEmployeesCount = employees.filter(emp => emp.selected).length;
  const selectedCreatedEntriesCount = createdEntries.filter(entry => entry.selected).length;

  interface NormalizedPayrollEntry {
    entry_id: string;
    employee_name: string;
    amount: number;
    salary_amount: number;
    salary_currency?: string;
    cryptocurrency?: string;
    [key: string]: any;
  }

  interface PayrollCreationResult {
    ui: PayrollEmployeeUI;
    entity: PayrollEmployeeEntity;
    response?: NormalizedPayrollEntry;
    error?: string;
  }

  interface PayrollCreationSummary {
    success: boolean;
    successCount: number;
    errorCount: number;
    totalEmployees: number;
    results: PayrollCreationResult[];
  }

  interface CreatedPayrollEntry {
    entry: NormalizedPayrollEntry;
    selected: boolean;
    status: 'idle' | 'processing' | 'success' | 'error';
    result?: ProcessPayrollPaymentResponse;
    error?: string;
  }

  interface ProcessedEntryResult {
    entryId: string;
    status: 'success' | 'error';
    response?: ProcessPayrollPaymentResponse;
    error?: string;
  }

  interface ProcessedEntriesSummary {
    success: boolean;
    successCount: number;
    errorCount: number;
    totalEntries: number;
    results: ProcessedEntryResult[];
  }

  const normalizePayrollEntryResponse = (
    response: any,
    entity: PayrollEmployeeEntity,
    payrollRequest: Record<string, any>
  ): NormalizedPayrollEntry | null => {
    if (!response) {
      return null;
    }

    const rawEntry = response?.payroll_entry ?? response?.entry ?? response;
    if (!rawEntry || typeof rawEntry !== 'object') {
      return null;
    }

    const entryId: string | undefined = rawEntry.entry_id || rawEntry.id || rawEntry._id;
    if (!entryId) {
      return null;
    }

    const fallbackAmount = Number(
      rawEntry.amount ??
      rawEntry.salary_amount ??
      payrollRequest.amount ??
      payrollRequest.salary_amount ??
      entity.salary_amount ??
      0
    );

    const fallbackSalaryAmount = Number(
      rawEntry.salary_amount ??
      rawEntry.amount ??
      payrollRequest.salary_amount ??
      payrollRequest.amount ??
      entity.salary_amount ??
      fallbackAmount ??
      0
    );

    const salaryCurrency = rawEntry.salary_currency ?? payrollRequest.salary_currency ?? rawEntry.cryptocurrency ?? payrollRequest.cryptocurrency ?? 'USD';
    const cryptoCurrency = rawEntry.cryptocurrency ?? payrollRequest.cryptocurrency ?? rawEntry.salary_currency ?? payrollRequest.salary_currency ?? salaryCurrency;

    return {
      ...rawEntry,
      entry_id: entryId,
      employee_name: rawEntry.employee_name ?? entity.employee_name ?? entity.user_id ?? '',
      amount: Number.isFinite(fallbackAmount) ? fallbackAmount : 0,
      salary_amount: Number.isFinite(fallbackSalaryAmount) ? fallbackSalaryAmount : 0,
      salary_currency: salaryCurrency,
      cryptocurrency: cryptoCurrency
    } as NormalizedPayrollEntry;
  };

  const createPayrollEntries = async (selectedEmployees: PayrollEmployeeUI[]): Promise<PayrollCreationSummary> => {
    // Convert UI employees to PayrollEmployee entities
    const mappedEmployees = selectedEmployees.map((employee) => ({
      ui: employee,
      entity: {
        employee_id: employee.id,
        user_id: employee.user_id,
        employee_name: employee.name,
        employee_email: employee.email,
        employee_wallet: undefined,
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
      } as PayrollEmployeeEntity
    }));

    const results: PayrollCreationResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const { ui, entity } of mappedEmployees) {
      const payrollRequest = {
        employee_id: entity.employee_id,
        employee_user_id: entity.user_id,
        payroll_type: payrollType,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        pay_date: payDate,
        start_date: payPeriodStart,
        payment_date: payDate,
        employee_name: entity.employee_name,
        employee_wallet: entity.employee_wallet || undefined,
        salary_amount: entity.salary_amount,
        salary_currency: entity.salary_currency || 'USDC',
        payment_frequency: 'MONTHLY',
        amount: entity.salary_amount,
        cryptocurrency: entity.salary_currency || 'USDC',
        notes: `Payroll processed for ${payrollType} - ${entity.employee_name}`
      };

      try {
        const repositoryResult = await container.payslipRepository.createSinglePayrollEntry(payrollRequest);
        const normalizedEntry = normalizePayrollEntryResponse(repositoryResult, entity, payrollRequest);

        if (normalizedEntry) {
          results.push({
            ui,
            entity,
            response: normalizedEntry
          });
          successCount++;
        } else {
          const normalizationError = 'Failed to parse payroll entry response from server.';
          console.error('❌ Unable to normalize payroll entry response:', repositoryResult);
          results.push({
            ui,
            entity,
            error: normalizationError
          });
          errorCount++;
        }
      } catch (creationError: any) {
        const errorText = creationError instanceof Error ? creationError.message : creationError?.toString() || 'Unknown error';
        console.error('❌ Error creating payroll for employee:', entity.employee_name, creationError);
        results.push({
          ui,
          entity,
          error: errorText
        });
        errorCount++;
      }
    }

    return {
      success: successCount > 0,
      successCount,
      errorCount,
      totalEmployees: mappedEmployees.length,
      results
    };
  };

  const handleCreatePayroll = async () => {
    const selectedEmployees = employees.filter(emp => emp.selected);

    if (selectedEmployees.length === 0) {
      setErrorMessage('Please select at least one employee to create payroll entries.');
      setProcessStatus('error');
      return;
    }

    setActiveAction('create');
    setProcessingMessage('Creating payroll entries...');
    setProcessStatus('processing');
    clearMessages();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const creationSummary = await createPayrollEntries(selectedEmployees);
      setLastCreationSummary(creationSummary);

      const successfulEntries = creationSummary.results
        .filter((result): result is PayrollCreationResult & { response: NormalizedPayrollEntry } => Boolean(result.response))
        .map(result => ({
          entry: result.response,
          selected: true,
          status: 'idle' as const
        }));

      if (successfulEntries.length > 0) {
        setCreatedEntries(successfulEntries);
      }

      if (creationSummary.success) {
        const entryIds = successfulEntries.map(item => item.entry.entry_id).filter(Boolean);
        const idsMessage = entryIds.length > 0
          ? ` Entry ID${entryIds.length > 1 ? 's' : ''}: ${entryIds.join(', ')}`
          : '';

        if (creationSummary.errorCount === 0) {
          setSuccessMessage(`Successfully created payroll entries for all ${creationSummary.successCount} employees!${idsMessage}`);
        } else {
          setSuccessMessage(`Created payroll entries for ${creationSummary.successCount} employees. ${creationSummary.errorCount} failed.${idsMessage}`);
        }
        setProcessStatus('success');
        setProcessingMessage('');

        onProcess({
          action: 'create',
          payrollType,
          payPeriodStart,
          payPeriodEnd,
          payDate,
          employees: selectedEmployees,
          total: getTotalAmount(),
          creationSummary,
          createdEntries: successfulEntries.map(item => item.entry),
          processedEntries: []
        });
      } else {
        setErrorMessage(`Failed to create payroll entries. ${creationSummary.errorCount} out of ${creationSummary.totalEmployees} failed.`);
        setProcessStatus('error');
        setProcessingMessage('');
      }
    } catch (error) {
      console.error('Error creating payroll entries:', error);
      setErrorMessage('An unexpected error occurred while creating payroll entries.');
      setProcessStatus('error');
      setProcessingMessage('');
    } finally {
      setActiveAction(null);
    }
  };

  const handleProcessPayroll = async () => {
    const entriesToProcess = createdEntries.filter(entry => entry.selected);
    const totalProcessedAmount = entriesToProcess.reduce((sum, entry) => {
      const amountValue = Number(entry.entry.amount ?? entry.entry.salary_amount ?? 0);
      return sum + (Number.isFinite(amountValue) ? amountValue : 0);
    }, 0);

    if (entriesToProcess.length === 0) {
      setErrorMessage('Select at least one payroll entry to process or enter an Entry ID below.');
      setProcessStatus('error');
      return;
    }

    setActiveAction('process');
    setProcessingMessage('Processing selected payroll entries...');
    setProcessStatus('processing');
    clearMessages();
    setErrorMessage('');
    setSuccessMessage('');

    // Prepare mutable copy to update statuses progressively
    const nextEntries: CreatedPayrollEntry[] = createdEntries.map(entry =>
      entry.selected
        ? { ...entry, status: 'processing' as const, error: undefined }
        : { ...entry }
    );
    setCreatedEntries(nextEntries);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < nextEntries.length; i++) {
      const current = nextEntries[i];
      if (!current.selected) continue;

      const entryId = current.entry.entry_id;

      try {
        const response = await processPayrollPayment({ entry_id: entryId });

        if (response.success) {
          successCount++;
          nextEntries[i] = {
            ...current,
            status: 'success' as const,
            result: response,
            error: undefined
          };
        } else {
          errorCount++;
          const errorText = response.error || response.message || 'Failed to process payroll payment.';
          nextEntries[i] = {
            ...current,
            status: 'error' as const,
            result: response,
            error: errorText
          };
        }
      } catch (processError: any) {
        errorCount++;
        const errorText = processError instanceof Error ? processError.message : processError?.toString() || 'Unexpected error';
        console.error('❌ Error processing payroll payment for entry:', entryId, processError);
        nextEntries[i] = {
          ...current,
          status: 'error' as const,
          error: errorText
        };
      }
    }

    setCreatedEntries([...nextEntries]);

    const processedResults: ProcessedEntryResult[] = nextEntries
      .filter(entry => entry.selected)
      .map(entry => ({
        entryId: entry.entry.entry_id,
        status: entry.status === 'success' ? 'success' : 'error',
        response: entry.result,
        error: entry.error
      }));

    const processSummary: ProcessedEntriesSummary = {
      success: successCount > 0,
      successCount,
      errorCount,
      totalEntries: entriesToProcess.length,
      results: processedResults
    };

    if (processSummary.success) {
      const failuresText = processSummary.errorCount > 0
        ? ` ${processSummary.errorCount} payment${processSummary.errorCount === 1 ? '' : 's'} failed.`
        : '';
      setSuccessMessage(`Processed payroll payments for ${processSummary.successCount} entr${processSummary.successCount === 1 ? 'y' : 'ies'}.${failuresText}`);
      setProcessStatus('success');
      setProcessingMessage('');
    } else {
      const reason = processSummary.totalEntries === 0
        ? 'No payroll entries were available for processing.'
        : 'Failed to process payroll payments.';
      setErrorMessage(reason);
      setProcessStatus('error');
      setProcessingMessage('');
    }

    onProcess({
      action: 'process',
      payrollType,
      payPeriodStart,
      payPeriodEnd,
      payDate,
      employees: entriesToProcess,
      total: totalProcessedAmount,
      creationSummary: lastCreationSummary,
      processSummary,
      processedEntries: processedResults
    });

    setActiveAction(null);
  };

  const handleProcessManualEntry = async () => {
    const entryId = manualEntryId.trim();

    if (!entryId) {
      setManualProcessingStatus('error');
      setManualProcessingError('Entry ID is required.');
      return;
    }

    setActiveAction('process');
    setProcessingMessage('Processing payroll payment...');
    setProcessStatus('processing');
    setManualProcessingStatus('processing');
    setManualProcessingError('');
    setManualSuccessMessage('');
    clearMessages();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await processPayrollPayment({ entry_id: entryId });

      if (response.success) {
        setSuccessMessage(`Payroll payment processed successfully for entry ${entryId}.`);
        setManualProcessingStatus('success');
        setManualEntryId('');
        setProcessStatus('success');
        setManualSuccessMessage(`Payroll payment processed successfully for entry ${entryId}.`);
      } else {
        const errorText = response.error || response.message || 'Failed to process payroll payment.';
        setManualProcessingError(errorText);
        setManualProcessingStatus('error');
        setProcessStatus('error');
        setErrorMessage(errorText);
        setManualSuccessMessage('');
      }

      onProcess({
        action: 'process',
        payrollType,
        payPeriodStart,
        payPeriodEnd,
        payDate,
        employees: [],
        total: 0,
        creationSummary: lastCreationSummary,
        processSummary: {
          success: Boolean(response?.success),
          successCount: response.success ? 1 : 0,
          errorCount: response.success ? 0 : 1,
          totalEntries: 1,
          results: [{
            entryId,
            status: response.success ? 'success' : 'error',
            response,
            error: response.success ? undefined : (response.error || response.message)
          }]
        } as ProcessedEntriesSummary,
        processedEntries: [{
          entryId,
          status: response.success ? 'success' : 'error',
          response,
          error: response.success ? undefined : (response.error || response.message)
        }]
      });
    } catch (error: any) {
      const errorText = error instanceof Error ? error.message : error?.toString() || 'Unexpected error occurred.';
      console.error('❌ Error processing payroll payment manually:', error);
      setManualProcessingError(errorText);
      setManualProcessingStatus('error');
      setErrorMessage(errorText);
      setProcessStatus('error');
      setManualSuccessMessage('');
    } finally {
      setProcessingMessage('');
      setActiveAction(null);
    }
  };

  const toggleCreatedEntry = (entryId: string) => {
    setCreatedEntries(prev =>
      prev.map(entry =>
        entry.entry.entry_id === entryId
          ? { ...entry, selected: !entry.selected }
          : entry
      )
    );
  };

  const copyEntryIdToClipboard = async (entryId: string) => {
    try {
      await navigator.clipboard.writeText(entryId);
      setSuccessMessage(`Copied entry ID ${entryId} to clipboard.`);
      setProcessStatus('success');
    } catch (error) {
      console.error('Failed to copy entry ID:', error);
      setErrorMessage('Failed to copy entry ID. Please copy manually.');
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
                <p className="text-sm text-blue-800 font-medium">{processingMessage || 'Processing payroll...'}</p>
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

          {createdEntries.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800 m-0">Created Payroll Entries</p>
                  <p className="text-xs text-gray-500 m-0">Select the entries you want to process or copy their IDs for later.</p>
                </div>
                <span className="text-xs text-gray-600">{selectedCreatedEntriesCount} selected</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {createdEntries.map(created => (
                  <div
                    key={created.entry.entry_id}
                    className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={created.selected}
                      onChange={() => toggleCreatedEntry(created.entry.entry_id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">Entry ID: {created.entry.entry_id}</p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                            created.status === 'success'
                              ? 'bg-green-100 text-green-700'
                              : created.status === 'error'
                                ? 'bg-red-100 text-red-600'
                                : created.status === 'processing'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {created.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        Employee: {created.entry.employee_name || '—'} • Amount: ${Number(created.entry.amount || created.entry.salary_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} {created.entry.salary_currency || created.entry.cryptocurrency || 'USD'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyEntryIdToClipboard(created.entry.entry_id)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                        >
                          Copy ID
                        </button>
                        {created.error && (
                          <span className="text-xs text-red-600">{created.error}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 p-3 border border-dashed border-gray-300 rounded-md bg-white">
            <p className="text-sm font-semibold text-gray-800 mb-2">Process an existing payroll entry</p>
            <p className="text-xs text-gray-500 mb-3">
              Already have a scheduled entry ID from an earlier run? Paste it here to trigger payment without recreating the payroll.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={manualEntryId}
                onChange={(e) => {
                  setManualEntryId(e.target.value);
                  if (manualProcessingStatus !== 'idle') {
                    setManualProcessingStatus('idle');
                    setManualProcessingError('');
                  }
                  if (manualSuccessMessage) {
                    setManualSuccessMessage('');
                  }
                }}
                placeholder="Enter payroll entry ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleProcessManualEntry}
                disabled={processStatus === 'processing'}
                className="sm:w-auto px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {manualProcessingStatus === 'processing' ? 'Processing…' : 'Process Entry'}
              </button>
            </div>
            {manualProcessingStatus === 'error' && manualProcessingError && (
              <p className="mt-2 text-xs text-red-600">{manualProcessingError}</p>
            )}
            {manualProcessingStatus === 'success' && manualSuccessMessage && (
              <p className="mt-2 text-xs text-green-600">{manualSuccessMessage}</p>
            )}
          </div>

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
                {selectedEmployeesCount} selected
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
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="sm:w-auto sm:flex-none p-2 rounded-md text-sm font-medium cursor-pointer transition-all border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            type="button"
          >
            Cancel
          </button>
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <button
              onClick={handleCreatePayroll}
              disabled={selectedEmployeesCount === 0 || processStatus === 'processing'}
              className="flex-1 p-2 rounded-md text-sm font-medium cursor-pointer transition-all text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center gap-2"
              type="button"
            >
              {processStatus === 'processing' && activeAction === 'create' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Payroll'
              )}
            </button>
            <button
              onClick={handleProcessPayroll}
              disabled={selectedCreatedEntriesCount === 0 || processStatus === 'processing'}
              className="flex-1 p-2 rounded-md text-sm font-medium cursor-pointer transition-all text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center gap-2"
              type="button"
            >
              {processStatus === 'processing' && activeAction === 'process' ? (
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
    </div>
  );
};

export default PayrollModal;