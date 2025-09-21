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
  TaxAnalysisResponse
} from '../../domain/entities/ReportEntities';

export class ReportRepositoryImpl implements ReportRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

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
      const response = await fetch(`${this.API_URL}/balance-sheet/generate/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate balance sheet');
      }

      return data;
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

      const response = await fetch(`${this.API_URL}/balance-sheet/export-excel/?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export balance sheet to Excel');
      }

      return data;
    } catch (error) {
      console.error('Balance sheet Excel export error:', error);
      throw error;
    }
  }

  async exportBalanceSheetPdf(request: ExportReportRequest): Promise<ExportReportResponse> {
    try {
      const response = await fetch(`${this.API_URL}/balance-sheet/export-pdf/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export balance sheet to PDF');
      }

      return data;
    } catch (error) {
      console.error('Balance sheet PDF export error:', error);
      throw error;
    }
  }

  async listBalanceSheets(): Promise<ListReportsResponse> {
    try {
      const response = await fetch(`${this.API_URL}/balance-sheet/list/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance sheets');
      }

      return data;
    } catch (error) {
      console.error('List balance sheets error:', error);
      throw error;
    }
  }

  // Cash Flow Operations
  async generateCashFlow(request: GenerateCashFlowRequest): Promise<GenerateCashFlowResponse> {
    try {
      const response = await fetch(`${this.API_URL}/cash-flow/generate/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cash flow statement');
      }

      return data;
    } catch (error) {
      console.error('Cash flow generation error:', error);
      throw error;
    }
  }

  async exportCashFlowExcel(request: ExportReportRequest): Promise<ExportReportResponse> {
    try {
      const response = await fetch(`${this.API_URL}/cash-flow/export-excel/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export cash flow to Excel');
      }

      return data;
    } catch (error) {
      console.error('Cash flow Excel export error:', error);
      throw error;
    }
  }

  async exportCashFlowPdf(request: ExportReportRequest): Promise<ExportReportResponse> {
    try {
      const response = await fetch(`${this.API_URL}/cash-flow/export-pdf/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export cash flow to PDF');
      }

      return data;
    } catch (error) {
      console.error('Cash flow PDF export error:', error);
      throw error;
    }
  }

  async listCashFlowStatements(): Promise<ListReportsResponse> {
    try {
      const response = await fetch(`${this.API_URL}/cash-flow/list/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cash flow statements');
      }

      return data;
    } catch (error) {
      console.error('List cash flow statements error:', error);
      throw error;
    }
  }

  // Tax Report Operations
  async generateTaxReport(request: GenerateTaxReportRequest): Promise<GenerateTaxReportResponse> {
    try {
      const response = await fetch(`${this.API_URL}/tax-reports/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tax report');
      }

      return data;
    } catch (error) {
      console.error('Tax report generation error:', error);
      throw error;
    }
  }

  async listTaxReports(): Promise<ListReportsResponse> {
    try {
      const response = await fetch(`${this.API_URL}/tax-reports/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tax reports');
      }

      return data;
    } catch (error) {
      console.error('List tax reports error:', error);
      throw error;
    }
  }

  // AI Tax Analysis Operations
  async generateTaxAnalysisDaily(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      const response = await fetch(`${this.API_URL}/ai/tax-analysis/daily/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate daily tax analysis');
      }

      return data;
    } catch (error) {
      console.error('Daily tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisWeekly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      const response = await fetch(`${this.API_URL}/ai/tax-analysis/weekly/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate weekly tax analysis');
      }

      return data;
    } catch (error) {
      console.error('Weekly tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisMonthly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      const response = await fetch(`${this.API_URL}/ai/tax-analysis/monthly/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate monthly tax analysis');
      }

      return data;
    } catch (error) {
      console.error('Monthly tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisYearly(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      const response = await fetch(`${this.API_URL}/ai/tax-analysis/yearly/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate yearly tax analysis');
      }

      return data;
    } catch (error) {
      console.error('Yearly tax analysis error:', error);
      throw error;
    }
  }

  async generateTaxAnalysisCustom(request: TaxAnalysisRequest): Promise<TaxAnalysisResponse> {
    try {
      const response = await fetch(`${this.API_URL}/ai/tax-analysis/custom/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate custom tax analysis');
      }

      return data;
    } catch (error) {
      console.error('Custom tax analysis error:', error);
      throw error;
    }
  }
}