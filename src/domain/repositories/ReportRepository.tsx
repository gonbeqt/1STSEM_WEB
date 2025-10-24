// Report Repository Interface for Smart Accounting System
import {
  BalanceSheetData,
  CashFlowStatement,
  TaxReport,
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
} from '../entities/ReportEntities';

export interface ReportRepository {
  // Balance Sheet Operations
  generateBalanceSheet(request: GenerateBalanceSheetRequest): Promise<GenerateBalanceSheetResponse>;
  exportBalanceSheetExcel(request: ExportReportRequest): Promise<ExportReportResponse>;
  exportBalanceSheetPdf(request: ExportReportRequest): Promise<ExportReportResponse>;
  listBalanceSheets(params?: ListBalanceSheetsParams): Promise<ListReportsResponse>;

  // Cash Flow Operations
  generateCashFlow(request: GenerateCashFlowRequest): Promise<GenerateCashFlowResponse>;
  exportCashFlowExcel(request: ExportReportRequest): Promise<ExportReportResponse>;
  exportCashFlowPdf(request: ExportReportRequest): Promise<ExportReportResponse>;
  listCashFlowStatements(): Promise<ListReportsResponse>;

  // Income Statement Operations
  listIncomeStatements(): Promise<ListReportsResponse>;

  // Tax Report Operations
  generateTaxReport(request: GenerateTaxReportRequest): Promise<GenerateTaxReportResponse>;
  listTaxReports(): Promise<ListReportsResponse>;

  // AI Tax Analysis Operations
  generateTaxAnalysisDaily(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisWeekly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisMonthly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisYearly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisCustom(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;

  // AI Risk Analysis Operations
  generateRiskAnalysisDaily(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse>;
  generateRiskAnalysisWeekly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse>;
  generateRiskAnalysisMonthly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse>;
  generateRiskAnalysisQuarterly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse>;
  generateRiskAnalysisYearly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse>;
  getRiskAnalysisHistory(userId: string, params?: RiskAnalysisHistoryParams): Promise<RiskAnalysisHistoryResponse>;
  getLatestRiskAnalysis(userId: string, periodType?: RiskAnalysisPeriod): Promise<RiskAnalysisResponse>;
}