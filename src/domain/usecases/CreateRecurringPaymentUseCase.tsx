// src/domain/usecases/CreateRecurringPaymentUseCase.tsx
import { PayslipRepository } from '../repositories/PayslipRepository';
import { CreateRecurringPaymentRequest, CreateRecurringPaymentResponse } from '../entities/PayrollEntities';

export class CreateRecurringPaymentUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: CreateRecurringPaymentRequest): Promise<CreateRecurringPaymentResponse> {
    // Add any business logic or validation here before calling the repository
    if (!request.payroll_type || !request.frequency || !request.start_date) {
      return { success: false, message: 'Missing required recurring payment fields.', error: 'VALIDATION_ERROR' };
    }

    if (!request.employees || request.employees.length === 0) {
      return { success: false, message: 'At least one employee must be selected.', error: 'VALIDATION_ERROR' };
    }

    return await this.payslipRepository.createRecurringPayment(request);
  }
}
