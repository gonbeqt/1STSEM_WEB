import { PayslipRepository } from "../../domain/repositories/PayslipRepository";
import { CreatePayslipRequest, CreatePayslipResponse, Payslip } from "../../domain/entities/PayslipEntities";
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
  GetEmployeePayrollDetailsResponse
} from "../../domain/entities/PayrollEntities";
import { PayslipRemoteDataSource } from '../datasources/PayslipRemoteDataSource';

export class PayslipRepositoryImpl implements PayslipRepository {
  constructor(private readonly remote: PayslipRemoteDataSource) {}
  
  async createPayslip(request: CreatePayslipRequest): Promise<CreatePayslipResponse> {
    return this.remote.createPayslip(request);
  }

  async getUserPayslips(employee_id?: string, status?: string): Promise<Payslip[]> {
    return this.remote.getUserPayslips(employee_id, status);
  }

  async createPayrollEntry(request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryResponse> {
    return this.remote.createPayrollEntry(request);
  }

  async createSinglePayrollEntry(request: CreateSinglePayrollEntryRequest): Promise<CreatePayrollEntryResponse> {
    return this.remote.createSinglePayrollEntry(request);
  }

  async processPayrollPayment(request: ProcessPayrollPaymentRequest): Promise<ProcessPayrollPaymentResponse> {
    return this.remote.processPayrollPayment(request);
  }

  async createRecurringPayment(request: CreateRecurringPaymentRequest): Promise<CreateRecurringPaymentResponse> {
    return this.remote.createRecurringPayment(request);
  }

  async getPaymentSchedule(request: GetPaymentScheduleRequest): Promise<GetPaymentScheduleResponse> {
    return this.remote.getPaymentSchedule(request);
  }

  async getEmployeePayrollDetails(request: GetEmployeePayrollDetailsRequest): Promise<GetEmployeePayrollDetailsResponse> {
    return this.remote.getEmployeePayrollDetails(request);
  }
}
