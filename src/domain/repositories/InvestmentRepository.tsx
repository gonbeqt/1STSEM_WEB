import { InvestmentReportRequest, InvestmentReportResponse } from '../entities/InvestmentEntities';

export interface InvestmentRepository {
  getInvestmentStatistics(request?: InvestmentReportRequest): Promise<InvestmentReportResponse>;
}
