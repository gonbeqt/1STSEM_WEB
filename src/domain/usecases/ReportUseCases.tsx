// Use Cases for Report Operations
import { ReportRepository } from '../repositories/ReportRepository';
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
  ListBalanceSheetsParams,
  TaxAnalysisRequest,
  TaxAnalysisResponse
} from '../entities/ReportEntities';

export class GenerateBalanceSheetUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: GenerateBalanceSheetRequest): Promise<GenerateBalanceSheetResponse> {
    return this.reportRepository.generateBalanceSheet(request);
  }
}

export class ExportBalanceSheetExcelUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.reportRepository.exportBalanceSheetExcel(request);
  }
}

export class ExportBalanceSheetPdfUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.reportRepository.exportBalanceSheetPdf(request);
  }
}

export class ListBalanceSheetsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(params?: ListBalanceSheetsParams): Promise<ListReportsResponse> {
    return this.reportRepository.listBalanceSheets(params);
  }
}

export class GenerateCashFlowUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: GenerateCashFlowRequest): Promise<GenerateCashFlowResponse> {
    return this.reportRepository.generateCashFlow(request);
  }
}

export class ExportCashFlowExcelUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.reportRepository.exportCashFlowExcel(request);
  }
}

export class ExportCashFlowPdfUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: ExportReportRequest): Promise<ExportReportResponse> {
    return this.reportRepository.exportCashFlowPdf(request);
  }
}

export class ListCashFlowStatementsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(): Promise<ListReportsResponse> {
    return this.reportRepository.listCashFlowStatements();
  }
}

export class ListIncomeStatementsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(): Promise<ListReportsResponse> {
    return this.reportRepository.listIncomeStatements();
  }
}

export class GenerateTaxReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: GenerateTaxReportRequest): Promise<GenerateTaxReportResponse> {
    return this.reportRepository.generateTaxReport(request);
  }
}

export class ListTaxReportsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(): Promise<ListReportsResponse> {
    return this.reportRepository.listTaxReports();
  }
}

export class GenerateTaxAnalysisDailyUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.reportRepository.generateTaxAnalysisDaily(request);
  }
}

export class GenerateTaxAnalysisWeeklyUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.reportRepository.generateTaxAnalysisWeekly(request);
  }
}

export class GenerateTaxAnalysisMonthlyUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.reportRepository.generateTaxAnalysisMonthly(request);
  }
}

export class GenerateTaxAnalysisYearlyUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.reportRepository.generateTaxAnalysisYearly(request);
  }
}

export class GenerateTaxAnalysisCustomUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    return this.reportRepository.generateTaxAnalysisCustom(request);
  }
}