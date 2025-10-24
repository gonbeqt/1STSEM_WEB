import { ApiService } from '../api/ApiService';
import { CreatePayslipRequest, CreatePayslipResponse, Payslip } from '../../domain/entities/PayslipEntities';
import {
  CreatePayrollEntryRequest,
  CreateSinglePayrollEntryRequest,
  CreatePayrollEntryResponse,
  ProcessPayrollPaymentRequest,
  ProcessPayrollPaymentResponse,
  CreateRecurringPaymentRequest,
  CreateRecurringPaymentResponse,
  GetPaymentScheduleRequest,
  GetPaymentScheduleResponse,
  GetEmployeePayrollDetailsRequest,
  GetEmployeePayrollDetailsResponse,
} from '../../domain/entities/PayrollEntities';

export class PayslipRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL || '';

  private buildUrl(path: string): string {
    // If full URL provided return as-is
    if (/^https?:\/\//i.test(path)) return path;
    // Ensure leading slash and let ApiService's baseURL resolve it
    return path.startsWith('/') ? path : `/${path}`;
  }

  constructor(private readonly api: ApiService) {}

  async createPayslip(request: CreatePayslipRequest): Promise<CreatePayslipResponse> {
    try {
  const data = await this.api.post<CreatePayslipResponse>(this.buildUrl('/payslips/create/'), request);
      return data as CreatePayslipResponse;
    } catch (error: any) {
      console.error('Payslip creation error:', error);

      if (error.response) {
        return {
          success: false,
          error: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`,
        };
      }
      if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.',
        };
      }
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async getUserPayslips(filters?: {
    userId?: string;
    employeeId?: string;
    status?: string;
    isManager?: boolean;
    email?: string;
  }): Promise<Payslip[]> {
    try {
      const searchParams = new URLSearchParams();
      if (filters?.userId) searchParams.append('user_id', filters.userId);
      if (filters?.employeeId) searchParams.append('employee_id', filters.employeeId);
      if (filters?.status) searchParams.append('status', filters.status);
      if (filters?.isManager != null) searchParams.append('is_manager', String(filters.isManager));
      if (filters?.email) searchParams.append('email', filters.email);

      const query = searchParams.toString();
  const url = query ? this.buildUrl(`/manager/payslips/list/?${query}`) : this.buildUrl('/manager/payslips/list/');

  const data = await this.api.get<any>(url);

      if (data.success && data.payslips) {
        return data.payslips as Payslip[];
      }

      // Return empty array if the response does not contain payslips
      return [];
    } catch (error: any) {
      console.error('Error fetching user payslips:', error);
      // Return empty array on error to satisfy the return type
      return [];
    }
  }

  async createPayrollEntry(request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryResponse> {
    try {
  const data = await this.api.post<any>(this.buildUrl('/payroll/create/'), request);
      if (data?.payroll_entry) {
        return data.payroll_entry as CreatePayrollEntryResponse;
      }
      if (data?.payrollEntry) {
        return data.payrollEntry as CreatePayrollEntryResponse;
      }
      return data as CreatePayrollEntryResponse;
    } catch (error: any) {
      console.error('Payroll entry creation error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(errorMessage);
      }
      if (error.request) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  async createSinglePayrollEntry(request: CreateSinglePayrollEntryRequest): Promise<CreatePayrollEntryResponse> {
    try {
      // Basic client-side validation to ensure the payload contains the employee identifier the backend expects
      if (!request || (!request.employee_id && !request.employee_user_id)) {
        throw new Error('employee_id or employee_user_id is required to create a payroll entry');
      }

      const url = this.buildUrl('/payroll/create/');
      // Helpful debug info when endpoint returns unexpected errors
      // eslint-disable-next-line no-console
      console.info('[PayslipRemoteDataSource] createSinglePayrollEntry -> POST', { url, payload: request });

      const data = await this.api.post<any>(url, request);
      if (data?.payroll_entry) {
        return data.payroll_entry as CreatePayrollEntryResponse;
      }
      if (data?.payrollEntry) {
        return data.payrollEntry as CreatePayrollEntryResponse;
      }
      return data as CreatePayrollEntryResponse;
    } catch (error: any) {
      console.error('Single payroll entry creation error:', error);

      // If backend route is not found (404) or network error occurred, fall back to local creation
      const status = error?.response?.status;
      if (status === 404) {
        console.warn('[PayslipRemoteDataSource] Backend payroll endpoint not found (404) — falling back to local creation');
        return this.createPayrollEntryLocal(request);
      }
      if (error.request && !error.response) {
        console.warn('[PayslipRemoteDataSource] Network/request error — falling back to local creation');
        return this.createPayrollEntryLocal(request);
      }

      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(errorMessage);
      }
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  /**
   * Client-side (local) implementation to build a payroll entry object that mirrors backend response.
   * Useful for previewing new payroll entries or when working offline.
   */
  async createPayrollEntryLocal(request: CreateSinglePayrollEntryRequest): Promise<CreatePayrollEntryResponse> {
    // Minimal validation
    if (!request || !request.employee_id) {
      throw new Error('employee_id is required to create a local payroll entry');
    }

    // Use the browser's UUID if available, fall back to timestamp-based id
    const entryId = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : `local-${Date.now()}`;

    const now = new Date().toISOString();

    const salaryAmount = Number(request.salary_amount || request.amount || 0) || 0;
    const currency = request.salary_currency || request.salary_currency || 'USD';

    const payrollEntry: CreatePayrollEntryResponse = {
      _id: entryId,
      entry_id: entryId,
      user_id: request.employee_user_id || request.employee_id,
      employee_name: request.employee_name || 'Unknown',
      employee_wallet: request.employee_wallet || '',
      salary_amount: salaryAmount,
      salary_currency: currency,
      payment_frequency: request.payment_frequency || 'MONTHLY',
      amount: typeof request.amount === 'number' ? request.amount : salaryAmount,
      cryptocurrency: request.cryptocurrency || 'ETH',
      usd_equivalent: salaryAmount,
      payment_date: request.payment_date || request.start_date || now,
      start_date: request.start_date || request.payment_date || now,
      is_active: true,
      status: 'SCHEDULED',
      notes: request.notes || '',
      created_at: now,
      processed_at: undefined,
    } as CreatePayrollEntryResponse;

    return Promise.resolve(payrollEntry);
  }

  async processPayrollPayment(request: ProcessPayrollPaymentRequest): Promise<ProcessPayrollPaymentResponse> {
    try {
  const data = await this.api.post<ProcessPayrollPaymentResponse>(this.buildUrl('/payroll/process/'), request);
      return data as ProcessPayrollPaymentResponse;
    } catch (error: any) {
      console.error('Payroll payment processing error:', error);

      if (error.response) {
        return {
          success: false,
          error: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`,
        };
      }
      if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.',
        };
      }
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async createRecurringPayment(request: CreateRecurringPaymentRequest): Promise<CreateRecurringPaymentResponse> {
    try {
  const data = await this.api.post<CreateRecurringPaymentResponse>(this.buildUrl('/payroll/recurring/create/'), request);
      return data as CreateRecurringPaymentResponse;
    } catch (error: any) {
      console.error('Recurring payment creation error:', error);

      if (error.response) {
        return {
          success: false,
          error: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`,
        };
      }
      if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.',
        };
      }
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async getPaymentSchedule(request: GetPaymentScheduleRequest): Promise<GetPaymentScheduleResponse> {
    try {
      const params = new URLSearchParams();
      if (request.days) params.append('days', request.days.toString());
  const data = await this.api.get<GetPaymentScheduleResponse>(this.buildUrl(`/payroll/schedule/?${params.toString()}`));

      return data as GetPaymentScheduleResponse;
    } catch (error: any) {
      console.error('Payment schedule error:', error);

      if (error.response) {
        return {
          success: false,
          error: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`,
        };
      }
      if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.',
        };
      }
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async getEmployeePayrollDetails(request: GetEmployeePayrollDetailsRequest): Promise<GetEmployeePayrollDetailsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('employee_id', request.employee_id);
  const data = await this.api.get<GetEmployeePayrollDetailsResponse>(this.buildUrl(`/admin/manager/payroll/employee-details/?${params.toString()}`));

      return data as GetEmployeePayrollDetailsResponse;
    } catch (error: any) {
      console.error('Employee payroll details error:', error);

      if (error.response) {
        return {
          success: false,
          error: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`,
        };
      }
      if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.',
        };
      }
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}
