import { PayslipRepository } from '../repositories/PayslipRepository';
import { GetPaymentScheduleRequest, GetPaymentScheduleResponse } from '../entities/PayrollEntities';

export class GetPaymentScheduleUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: GetPaymentScheduleRequest): Promise<GetPaymentScheduleResponse> {
    return await this.payslipRepository.getPaymentSchedule(request);
  }
}
