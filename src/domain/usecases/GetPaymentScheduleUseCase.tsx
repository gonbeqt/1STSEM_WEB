// src/domain/usecases/GetPaymentScheduleUseCase.tsx
import { PayslipRepository } from '../repositories/PayslipRepository';
import { GetPaymentScheduleRequest, GetPaymentScheduleResponse } from '../entities/PayrollEntities';

export class GetPaymentScheduleUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: GetPaymentScheduleRequest): Promise<GetPaymentScheduleResponse> {
    // Add any business logic or validation here before calling the repository
    return await this.payslipRepository.getPaymentSchedule(request);
  }
}
