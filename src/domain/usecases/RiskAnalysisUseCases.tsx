import { ReportRepository } from '../repositories/ReportRepository';
import {
  RiskAnalysisGenerateRequest,
  RiskAnalysisHistoryParams,
  RiskAnalysisHistoryResponse,
  RiskAnalysisPeriod,
  RiskAnalysisResponse
} from '../entities/ReportEntities';

export class GenerateDailyRiskAnalysisUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(request: RiskAnalysisGenerateRequest = {}): Promise<RiskAnalysisResponse> {
    return this.reportRepository.generateRiskAnalysisDaily(request);
  }
}

export class GenerateWeeklyRiskAnalysisUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(request: RiskAnalysisGenerateRequest = {}): Promise<RiskAnalysisResponse> {
    return this.reportRepository.generateRiskAnalysisWeekly(request);
  }
}

export class GenerateMonthlyRiskAnalysisUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(request: RiskAnalysisGenerateRequest = {}): Promise<RiskAnalysisResponse> {
    return this.reportRepository.generateRiskAnalysisMonthly(request);
  }
}

export class GenerateQuarterlyRiskAnalysisUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(request: RiskAnalysisGenerateRequest = {}): Promise<RiskAnalysisResponse> {
    return this.reportRepository.generateRiskAnalysisQuarterly(request);
  }
}

export class GenerateYearlyRiskAnalysisUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(request: RiskAnalysisGenerateRequest = {}): Promise<RiskAnalysisResponse> {
    return this.reportRepository.generateRiskAnalysisYearly(request);
  }
}

export interface GetRiskAnalysisHistoryInput extends RiskAnalysisHistoryParams {
  userId: string;
}

export class GetRiskAnalysisHistoryUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute({ userId, ...params }: GetRiskAnalysisHistoryInput): Promise<RiskAnalysisHistoryResponse> {
    return this.reportRepository.getRiskAnalysisHistory(userId, params);
  }
}

export interface GetLatestRiskAnalysisInput {
  userId: string;
  periodType?: RiskAnalysisPeriod;
}

export class GetLatestRiskAnalysisUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute({ userId, periodType }: GetLatestRiskAnalysisInput): Promise<RiskAnalysisResponse> {
    return this.reportRepository.getLatestRiskAnalysis(userId, periodType);
  }
}
