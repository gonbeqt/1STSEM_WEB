import { InvestmentRepository } from '../../domain/repositories/InvestmentRepository';
import { InvestmentRemoteDataSource } from '../datasources/InvestmentRemoteDataSource';
import { InvestmentReportRequest, InvestmentReportResponse } from '../../domain/entities/InvestmentEntities';

export class InvestmentRepositoryImpl implements InvestmentRepository {
  constructor(private readonly remote: InvestmentRemoteDataSource) {}

  async getInvestmentStatistics(request?: InvestmentReportRequest): Promise<InvestmentReportResponse> {
    return this.remote.getInvestmentStatistics(request);
  }
}
