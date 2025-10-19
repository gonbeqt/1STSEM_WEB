import { PayslipRepository } from '../repositories/PayslipRepository';
import { CreateSinglePayrollEntryRequest, CreatePayrollEntryResponse } from '../entities/PayrollEntities';

export interface CreateSinglePayrollEntryUseCaseResponse {
  success: boolean;
  payrollEntry?: CreatePayrollEntryResponse;
  message?: string;
  error?: string;
}

export class CreateSinglePayrollEntryUseCase {
  constructor(private readonly repository: PayslipRepository) {}

  async execute(request: CreateSinglePayrollEntryRequest): Promise<CreateSinglePayrollEntryUseCaseResponse> {
    if (!request.employee_id) {
      return {
        success: false,
        error: 'Employee identifier is required to create a payroll entry',
        message: 'Employee identifier is required'
      };
    }

    if (typeof request.salary_amount !== 'number' || Number.isNaN(request.salary_amount)) {
      return {
        success: false,
        error: 'Salary amount must be a valid number',
        message: 'Salary amount must be a valid number'
      };
    }

    try {
      const payrollEntry = await this.repository.createSinglePayrollEntry(request);
      return {
        success: true,
        payrollEntry,
        message: 'Payroll entry created successfully'
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create payroll entry';
      return {
        success: false,
        error: message,
        message
      };
    }
  }
}
