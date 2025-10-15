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
  RiskAnalysisGenerateRequest,
  RiskAnalysisHistoryParams,
  RiskAnalysisHistoryResponse,
  RiskAnalysisResponse,
  RiskAnalysisPeriod
} from '../../domain/entities/ReportEntities';
import apiService from '../api';

export class ReportRepositoryImpl implements ReportRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL ?? '';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Balance Sheet Operations
  async generateBalanceSheet(request: GenerateBalanceSheetRequest): Promise<GenerateBalanceSheetResponse> {
    try {
      return await apiService.post(`${this.API_URL}/balance-sheet/generate/`, request);
    } catch (error) {
      console.error('Balance sheet generation error:', error);
      throw error;
    }
  }

  async exportBalanceSheetExcel(request: ExportReportRequest): Promise<ExportReportResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (request.report_id) {
        queryParams.append('balance_sheet_id', request.report_id);
      }

      return await apiService.get(`${this.API_URL}/balance-sheet/export-excel/?${queryParams}`);
    } catch (error) {
      console.error('Balance sheet Excel export error:', error);
      throw error;
    }
  }

  async exportBalanceSheetPdf(request: ExportReportRequest): Promise<ExportReportResponse> {
    try {
      return await apiService.post(`${this.API_URL}/balance-sheet/export-pdf/`, request);
    } catch (error) {
      console.error('Balance sheet PDF export error:', error);
      throw error;
    }
  }

  async listBalanceSheets(): Promise<ListReportsResponse> {
    try {
      return await apiService.get(`${this.API_URL}/balance-sheet/list/`);
    } catch (error) {
      console.error('List balance sheets error:', error);
      throw error;
    }
  }

  // Cash Flow Operations
  async generateCashFlow(request: GenerateCashFlowRequest): Promise<GenerateCashFlowResponse> {
    try {
      return await apiService.post(`${this.API_URL}/cash-flow/generate/`, request);
    } catch (error) {
      console.error('Cash flow generation error:', error);
      throw error;
    }
  }

  async exportCashFlowExcel(request: ExportReportRequest): Promise<ExportReportResponse> {
    try {
      return await apiService.post(`${this.API_URL}/cash-flow/export-excel/`, request);
    } catch (error) {
      console.error('Cash flow Excel export error:', error);
      throw error;
    }
  }

  async exportCashFlowPdf(request: ExportReportRequest): Promise<ExportReportResponse> {
    try {
      return await apiService.post(`${this.API_URL}/cash-flow/export-pdf/`, request);
    } catch (error) {
      console.error('Cash flow PDF export error:', error);
      throw error;
    }
  }

  async listCashFlowStatements(): Promise<ListReportsResponse> {
    try {
      return await apiService.get(`${this.API_URL}/cash-flow/list/`);
    } catch (error) {
      console.error('List cash flow statements error:', error);
      throw error;
    }
  }

  // Tax Report Operations
  async generateTaxReport(request: GenerateTaxReportRequest): Promise<GenerateTaxReportResponse> {
    try {
      return await apiService.post(`${this.API_URL}/tax-reports/`, request);
    } catch (error) {
      console.error('Tax report generation error:', error);
      throw error;
    }
  }

  async listTaxReports(): Promise<ListReportsResponse> {
    try {
      return await apiService.get(`${this.API_URL}/tax-reports/`);
    } catch (error) {
      console.error('List tax reports error:', error);
      throw error;
    }
  }

  // AI Tax Analysis Operations
  async generateTaxAnalysisDaily(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      return await apiService.post(`${this.API_URL}/ai/tax-analysis/daily/`, request);
    } catch (error) {
      console.error('Daily tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisWeekly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      return await apiService.post(`${this.API_URL}/ai/tax-analysis/weekly/`, request);
    } catch (error) {
      console.error('Weekly tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisMonthly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      return await apiService.post(`${this.API_URL}/ai/tax-analysis/monthly/`, request);
    } catch (error) {
      console.error('Monthly tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisYearly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      return await apiService.post(`${this.API_URL}/ai/tax-analysis/yearly/`, request);
    } catch (error) {
      console.error('Yearly tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisCustom(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      return await apiService.post(`${this.API_URL}/ai/tax-analysis/custom/`, request);
    } catch (error) {
      console.error('Custom tax analysis error:', error);
      throw error;
    }
  }

  private async postRiskAnalysis(
    endpoint: string,
    payload: RiskAnalysisGenerateRequest,
    defaultError: string
  ): Promise<RiskAnalysisResponse> {
    try {
      const data = await apiService.post(`${this.API_URL}${endpoint}`, payload ?? {});
      if ((data as any)?.success === false) {
        throw new Error((data as any)?.error || (data as any)?.message || defaultError);
      }
      return data as any;
    } catch (error) {
      console.error(`${defaultError}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(defaultError);
    }
  }

  async generateRiskAnalysisDaily(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.postRiskAnalysis('/admin/ai/risk-analysis/daily/', request, 'Failed to generate daily risk analysis');
  }

  async generateRiskAnalysisWeekly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.postRiskAnalysis('/admin/ai/risk-analysis/weekly/', request, 'Failed to generate weekly risk analysis');
  }

  async generateRiskAnalysisMonthly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.postRiskAnalysis('/admin/ai/risk-analysis/monthly/', request, 'Failed to generate monthly risk analysis');
  }

  async generateRiskAnalysisQuarterly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.postRiskAnalysis('/admin/ai/risk-analysis/quarterly/', request, 'Failed to generate quarterly risk analysis');
  }

  async generateRiskAnalysisYearly(request: RiskAnalysisGenerateRequest): Promise<RiskAnalysisResponse> {
    return this.postRiskAnalysis('/admin/ai/risk-analysis/yearly/', request, 'Failed to generate yearly risk analysis');
  }

  async getRiskAnalysisHistory(userId: string, params: RiskAnalysisHistoryParams = {}): Promise<RiskAnalysisHistoryResponse> {
    try {
      const query = new URLSearchParams();

      if (params.period_type) {
        query.append('period_type', params.period_type);
      }
      if (typeof params.limit === 'number') {
        query.append('limit', params.limit.toString());
      }
      if (params.date) {
        query.append('date', params.date);
      }
      if (params.start_date) {
        query.append('start_date', params.start_date);
      }
      if (typeof params.year === 'number') {
        query.append('year', params.year.toString());
      }
      if (typeof params.month === 'number') {
        query.append('month', params.month.toString());
      }
      if (typeof params.quarter === 'number') {
        query.append('quarter', params.quarter.toString());
      }

      const queryString = query.toString();
      const url = `${this.API_URL}/admin/ai/risk-analysis/history/${userId}/${queryString ? `?${queryString}` : ''}`;

      const data = await apiService.get(url);
      if ((data as any)?.success === false) {
        throw new Error((data as any)?.error || 'Failed to fetch risk analysis history');
      }
      return data as any;
    } catch (error) {
      console.error('Risk analysis history error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch risk analysis history');
    }
  }

  async getLatestRiskAnalysis(userId: string, periodType?: RiskAnalysisPeriod): Promise<RiskAnalysisResponse> {
    try {
      const query = new URLSearchParams();
      if (periodType) {
        query.append('period_type', periodType);
      }

      const queryString = query.toString();
      const url = `${this.API_URL}/admin/ai/risk-analysis/latest/${userId}/${queryString ? `?${queryString}` : ''}`;

      const data = await apiService.get(url);
      if ((data as any)?.success === false) {
        throw new Error((data as any)?.error || 'Failed to fetch latest risk analysis');
      }
      return data as any;
    } catch (error) {
      console.error('Latest risk analysis error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch latest risk analysis');
    }
  }
}