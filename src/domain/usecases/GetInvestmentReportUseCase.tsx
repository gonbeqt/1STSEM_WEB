import { InvestmentRepository } from '../repositories/InvestmentRepository';
import { InvestmentReportRequest, InvestmentReportResponse } from '../entities/InvestmentEntities';

export class GetInvestmentReportUseCase {
  constructor(private readonly repository: InvestmentRepository) {}

  async execute(request?: InvestmentReportRequest): Promise<InvestmentReportResponse> {
    return this.repository.getInvestmentStatistics(request);
  }
}
