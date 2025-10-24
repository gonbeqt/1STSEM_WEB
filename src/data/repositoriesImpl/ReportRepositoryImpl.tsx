// Report Repository Implementation for Smart Accounting System
import { ReportRepository } from '../../domain/repositories/ReportRepository';
import {
  GenerateBalanceSheetRequest,
  GenerateBalanceSheetResponse,
  GenerateCashFlowRequest,
  GenerateCashFlowResponse,
  GenerateTaxReportRequest,
  GenerateTaxReportResponse,
  ExportReportRequest,
  ExportReportResponse,
  ListReportsResponse,
  TaxAnalysisRequest,
  TaxAnalysisResponse,
  ListBalanceSheetsParams,
  RiskAnalysisGenerateRequest,
  RiskAnalysisHistoryParams,
  RiskAnalysisHistoryResponse,
  RiskAnalysisResponse,
  RiskAnalysisPeriod
} from '../../domain/entities/ReportEntities';
import { ReportRemoteDataSource } from '../datasources/ReportRemoteDataSource';

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private readonly remote: ReportRemoteDataSource) {}

  async generateBalanceSheet(request: GenerateBalanceSheetRequest): Promise<GenerateBalanceSheetResponse> {
    return this.remote.generateBalanceSheet(request);
  }

  async exportBalanceSheetExcel(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.remote.exportBalanceSheetExcel(request);
  }

  async exportBalanceSheetPdf(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.remote.exportBalanceSheetPdf(request);
  }

  async listBalanceSheets(params?: ListBalanceSheetsParams): Promise<ListReportsResponse> {
    return this.remote.listBalanceSheets(params);
  }

  async generateCashFlow(request: GenerateCashFlowRequest): Promise<GenerateCashFlowResponse> {
    return this.remote.generateCashFlow(request);
  }

  async exportCashFlowExcel(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.remote.exportCashFlowExcel(request);
  }

  async exportCashFlowPdf(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.remote.exportCashFlowPdf(request);
  }

  async listCashFlowStatements(): Promise<ListReportsResponse> {
    return this.remote.listCashFlowStatements();
  }

  async listIncomeStatements(): Promise<ListReportsResponse> {
    return this.remote.listIncomeStatements();
  }

  async generateTaxReport(request: GenerateTaxReportRequest): Promise<GenerateTaxReportResponse> {
    return this.remote.generateTaxReport(request);
  }

  async listTaxReports(): Promise<ListReportsResponse> {
    return this.remote.listTaxReports();
  }

  async generateTaxAnalysisDaily(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.remote.generateTaxAnalysisDaily(request);
  }

  async generateTaxAnalysisWeekly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.remote.generateTaxAnalysisWeekly(request);
  }

  async generateTaxAnalysisMonthly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.remote.generateTaxAnalysisMonthly(request);
  }

  async generateTaxAnalysisYearly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.remote.generateTaxAnalysisYearly(request);
  }

  async generateTaxAnalysisCustom(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.remote.generateTaxAnalysisCustom(request);
  }

  async generateRiskAnalysisDaily(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.remote.generateRiskAnalysisDaily(request);
  }

  async generateRiskAnalysisWeekly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.remote.generateRiskAnalysisWeekly(request);
  }

  async generateRiskAnalysisMonthly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.remote.generateRiskAnalysisMonthly(request);
  }

  async generateRiskAnalysisQuarterly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.remote.generateRiskAnalysisQuarterly(request);
  }

  async generateRiskAnalysisYearly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.remote.generateRiskAnalysisYearly(request);
  }

  async getRiskAnalysisHistory(userId: string, params: RiskAnalysisHistoryParams = {}): Promise<RiskAnalysisHistoryResponse> {
    return this.remote.getRiskAnalysisHistory(userId, params);
  }

  async getLatestRiskAnalysis(userId: string, periodType?: RiskAnalysisPeriod): Promise<RiskAnalysisResponse> {
    return this.remote.getLatestRiskAnalysis(userId, periodType);
  }
}