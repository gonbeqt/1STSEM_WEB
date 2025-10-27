import { PayslipRepository } from '../repositories/PayslipRepository';
import { ProcessPayrollPaymentRequest, ProcessPayrollPaymentResponse } from '../entities/PayrollEntities';

export class ProcessPayrollPaymentUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: ProcessPayrollPaymentRequest): Promise<ProcessPayrollPaymentResponse> {
    if (!request.entry_id) {
      return { success: false, message: 'Entry ID is required.', error: 'VALIDATION_ERROR' };
    }

    return await this.payslipRepository.processPayrollPayment(request);
  }
}
