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

  constructor(private readonly api: ApiService) {}

  async createPayslip(request: CreatePayslipRequest): Promise<CreatePayslipResponse> {
    try {
      const data = await this.api.post<CreatePayslipResponse>(`${this.apiUrl}/payslips/create/`, request);
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

  async getUserPayslips(employee_id?: string, status?: string): Promise<Payslip[]> {
    try {
      const params = new URLSearchParams();
      if (employee_id) params.append('employee_id', employee_id);
      if (status) params.append('status', status);

      const data = await this.api.get<any>(`${this.apiUrl}/manager/payslips/list/?${params.toString()}`);

      if (data.success && data.payslips) {
        return data.payslips as Payslip[];
      }

      return this.getMockPayslips(employee_id, status);
    } catch (error: any) {
      console.error('Error fetching user payslips:', error);
      return this.getMockPayslips(employee_id, status);
    }
  }

  private getMockPayslips(employee_id?: string, status?: string): Payslip[] {
    const mockPayslips: Payslip[] = [
      {
        payslip_id: '4e799c98-5a03-4e2a-bf21-e5e97e6328bc',
        payslip_number: 'PS-2025-10-000026',
        user_id: employee_id || '68dc79f5832f59f405bbc830',
        employee_id: employee_id || '68dc8ad197f623d507ee73fa',
        employee_name: 'Justin Caronongan',
        employee_email: 'eshavilario11@gmail.com',
        employee_wallet: undefined,
        department: 'Finance',
        position: 'Palusot',
        pay_period_start: '2025-08-07T00:00:00.000+00:00',
        pay_period_end: '2025-08-08T00:00:00.000+00:00',
        pay_date: '2025-08-08T00:00:00.000+00:00',
        base_salary: 29.95,
        salary_currency: 'USD',
        overtime_pay: 0,
        bonus: 0,
        allowances: 0,
        total_earnings: 29.95,
        tax_deduction: 0,
        insurance_deduction: 0,
        retirement_deduction: 0,
        other_deductions: 0,
        total_deductions: 0,
        final_net_pay: 29.95,
        cryptocurrency: 'ETH',
        crypto_amount: 29.95,
        usd_equivalent: 29.95,
        status: 'GENERATED',
        notes: 'Payroll processed for Regular Payroll',
        created_at: '2025-10-01T10:59:57.835+00:00',
        issued_at: '2025-10-01T10:59:57.835+00:00',
        payment_processed: false,
        pdf_generated: false,
      },
      {
        payslip_id: '4e799c98-5a03-4e2a-bf21-e5e97e6328bd',
        payslip_number: 'PS-2025-10-000027',
        user_id: employee_id || '68dc79f5832f59f405bbc830',
        employee_id: employee_id || '68dc8ad197f623d507ee73fa',
        employee_name: 'Justin Caronongan',
        employee_email: 'eshavilario11@gmail.com',
        employee_wallet: undefined,
        department: 'Finance',
        position: 'Palusot',
        pay_period_start: '2025-08-01T00:00:00.000+00:00',
        pay_period_end: '2025-08-31T00:00:00.000+00:00',
        pay_date: '2025-09-01T00:00:00.000+00:00',
        base_salary: 5000,
        salary_currency: 'USD',
        overtime_pay: 500,
        bonus: 1000,
        allowances: 200,
        total_earnings: 6700,
        tax_deduction: 1340,
        insurance_deduction: 200,
        retirement_deduction: 300,
        other_deductions: 100,
        total_deductions: 1940,
        final_net_pay: 4760,
        cryptocurrency: 'ETH',
        crypto_amount: 2.5,
        usd_equivalent: 4760,
        status: 'PAID',
        notes: 'Monthly salary payment',
        created_at: '2025-09-01T10:00:00.000+00:00',
        issued_at: '2025-09-01T09:00:00.000+00:00',
        payment_processed: true,
        pdf_generated: true,
      },
    ];

    if (status && status !== 'all') {
      const normalizedStatus = status.toUpperCase();
      return mockPayslips.filter((payslip) => payslip.status.toUpperCase() === normalizedStatus);
    }

    return mockPayslips;
  }

  async createPayrollEntry(request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryResponse> {
    try {
      const data = await this.api.post<CreatePayrollEntryResponse>(`${this.apiUrl}/payroll/create/`, request);
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
      const data = await this.api.post<CreatePayrollEntryResponse>(`${this.apiUrl}/payroll/create/`, request);
      return data as CreatePayrollEntryResponse;
    } catch (error: any) {
      console.error('Single payroll entry creation error:', error);

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

  async processPayrollPayment(request: ProcessPayrollPaymentRequest): Promise<ProcessPayrollPaymentResponse> {
    try {
      const data = await this.api.post<ProcessPayrollPaymentResponse>(`${this.apiUrl}/payroll/process/`, request);
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
      const data = await this.api.post<CreateRecurringPaymentResponse>(`${this.apiUrl}/payroll/recurring/create/`, request);
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
      const data = await this.api.get<GetPaymentScheduleResponse>(`${this.apiUrl}/payroll/schedule/?${params.toString()}`);

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
      const data = await this.api.get<GetEmployeePayrollDetailsResponse>(`${this.apiUrl}/admin/manager/payroll/employee-details/?${params.toString()}`);

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
