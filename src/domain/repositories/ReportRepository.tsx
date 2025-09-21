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
  TaxAnalysisResponse
} from '../entities/ReportEntities';

export interface ReportRepository {
  // Balance Sheet Operations
  generateBalanceSheet(request: GenerateBalanceSheetRequest): Promise<GenerateBalanceSheetResponse>;
  exportBalanceSheetExcel(request: ExportReportRequest): Promise<ExportReportResponse>;
  exportBalanceSheetPdf(request: ExportReportRequest): Promise<ExportReportResponse>;
  listBalanceSheets(): Promise<ListReportsResponse>;

  // Cash Flow Operations
  generateCashFlow(request: GenerateCashFlowRequest): Promise<GenerateCashFlowResponse>;
  exportCashFlowExcel(request: ExportReportRequest): Promise<ExportReportResponse>;
  exportCashFlowPdf(request: ExportReportRequest): Promise<ExportReportResponse>;
  listCashFlowStatements(): Promise<ListReportsResponse>;

  // Tax Report Operations
  generateTaxReport(request: GenerateTaxReportRequest): Promise<GenerateTaxReportResponse>;
  listTaxReports(): Promise<ListReportsResponse>;

  // AI Tax Analysis Operations
  generateTaxAnalysisDaily(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisWeekly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisMonthly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisYearly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
  generateTaxAnalysisCustom(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse>;
}