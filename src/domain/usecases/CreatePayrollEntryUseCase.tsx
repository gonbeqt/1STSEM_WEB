// src/domain/usecases/CreatePayrollEntryUseCase.tsx
import { PayslipRepository } from '../repositories/PayslipRepository';
import { CreatePayrollEntryRequest, CreatePayrollEntryResponse } from '../entities/PayrollEntities';

export interface CreatePayrollEntryUseCaseResponse {
  success: boolean;
  payroll_entry?: CreatePayrollEntryResponse;
  message?: string;
  error?: string;
}

export class CreatePayrollEntryUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryUseCaseResponse> {
    try {
      // Add any business logic or validation here before calling the repository
      if (!request.payroll_type || !request.pay_period_start || !request.pay_period_end || !request.pay_date) {
        return { 
          success: false, 
          message: 'Missing required payroll fields.', 
          error: 'VALIDATION_ERROR' 
        };
      }

      if (!request.employees || request.employees.length === 0) {
        return { 
          success: false, 
          message: 'At least one employee must be selected.', 
          error: 'VALIDATION_ERROR' 
        };
      }

      const payrollEntry = await this.payslipRepository.createPayrollEntry(request);
      
      return {
        success: true,
        payroll_entry: payrollEntry,
        message: 'Payroll entry created successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}
