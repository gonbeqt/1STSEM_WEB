import { CreatePayslipRequest, CreatePayslipResponse, Payslip } from '../entities/PayslipEntities';
import { 
  CreatePayrollEntryRequest, 
  CreatePayrollEntryResponse,
  ProcessPayrollPaymentRequest,
  ProcessPayrollPaymentResponse,
  CreateRecurringPaymentRequest,
  CreateRecurringPaymentResponse,
  GetPaymentScheduleRequest,
  GetPaymentScheduleResponse
} from '../entities/PayrollEntities';

export interface PayslipRepository {
  createPayslip(request: CreatePayslipRequest): Promise<CreatePayslipResponse>;
  getUserPayslips(employee_id?: string, status?: string): Promise<Payslip[]>;
  
  // New payroll methods
  createPayrollEntry(request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryResponse>;
  processPayrollPayment(request: ProcessPayrollPaymentRequest): Promise<ProcessPayrollPaymentResponse>;
  createRecurringPayment(request: CreateRecurringPaymentRequest): Promise<CreateRecurringPaymentResponse>;
  getPaymentSchedule(request: GetPaymentScheduleRequest): Promise<GetPaymentScheduleResponse>;
}