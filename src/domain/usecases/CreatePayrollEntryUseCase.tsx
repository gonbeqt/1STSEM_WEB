// src/domain/usecases/CreatePayrollEntryUseCase.tsx
import { PayslipRepository } from '../repositories/PayslipRepository';
import { CreatePayrollEntryRequest, CreatePayrollEntryResponse } from '../entities/PayrollEntities';

export class CreatePayrollEntryUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryResponse> {
    // Add any business logic or validation here before calling the repository
    if (!request.payroll_type || !request.pay_period_start || !request.pay_period_end || !request.pay_date) {
      return { success: false, message: 'Missing required payroll fields.', error: 'VALIDATION_ERROR' };
    }

    if (!request.employees || request.employees.length === 0) {
      return { success: false, message: 'At least one employee must be selected.', error: 'VALIDATION_ERROR' };
    }

    return await this.payslipRepository.createPayrollEntry(request);
  }
}
