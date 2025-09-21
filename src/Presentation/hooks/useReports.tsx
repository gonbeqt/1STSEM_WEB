// Custom hooks for Reports functionality
import { useState, useCallback } from 'react';
import { container } from '../../di/container';
import {
  BalanceSheetData,
  CashFlowStatement,
  TaxReport,
  GenerateBalanceSheetRequest,
  GenerateCashFlowRequest,
  GenerateTaxReportRequest,
  ExportReportRequest,
  TaxAnalysisRequest,
  TaxAnalysisResponse
} from '../../domain/entities/ReportEntities';

interface UseBalanceSheetReturn {
  balanceSheet: BalanceSheetData | null;
  balanceSheets: BalanceSheetData[];
  loading: boolean;
  error: string | null;
  generateBalanceSheet: (request: GenerateBalanceSheetRequest) => Promise<void>;
  exportToExcel: (reportId?: string) => Promise<void>;
  exportToPdf: (reportId?: string) => Promise<void>;
  listBalanceSheets: () => Promise<void>;
  clearError: () => void;
}

export const useBalanceSheet = (): UseBalanceSheetReturn => {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);
  const [balanceSheets, setBalanceSheets] = useState<BalanceSheetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBalanceSheet = useCallback(async (request: GenerateBalanceSheetRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await container.generateBalanceSheetUseCase.execute(request);
      if (response.success) {
        setBalanceSheet(response.balance_sheet);
      } else {
        setError(response.error || 'Failed to generate balance sheet');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating balance sheet');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToExcel = useCallback(async (reportId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const request: ExportReportRequest = reportId ? { report_id: reportId } : {};
      const response = await container.exportBalanceSheetExcelUseCase.execute(request);
      if (response.success && response.excel_data) {
        // Create and download the Excel file
        const blob = new Blob([atob(response.excel_data)], {
          type: response.content_type
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(response.error || 'Failed to export balance sheet to Excel');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while exporting to Excel');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToPdf = useCallback(async (reportId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const request: ExportReportRequest = reportId ? { report_id: reportId } : {};
      const response = await container.exportBalanceSheetPdfUseCase.execute(request);
      if (response.success && response.pdf_data) {
        // Create and download the PDF file
        const blob = new Blob([atob(response.pdf_data)], {
          type: response.content_type
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(response.error || 'Failed to export balance sheet to PDF');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while exporting to PDF');
    } finally {
      setLoading(false);
    }
  }, []);

  const listBalanceSheets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await container.listBalanceSheetsUseCase.execute();
      if (response.success && response.balance_sheets) {
        setBalanceSheets(response.balance_sheets);
      } else {
        setError(response.error || 'Failed to fetch balance sheets');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching balance sheets');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    balanceSheet,
    balanceSheets,
    loading,
    error,
    generateBalanceSheet,
    exportToExcel,
    exportToPdf,
    listBalanceSheets,
    clearError
  };
};

interface UseCashFlowReturn {
  cashFlow: CashFlowStatement | null;
  cashFlowStatements: CashFlowStatement[];
  loading: boolean;
  error: string | null;
  generateCashFlow: (request: GenerateCashFlowRequest) => Promise<void>;
  exportToExcel: (reportId?: string) => Promise<void>;
  exportToPdf: (reportId?: string) => Promise<void>;
  listCashFlowStatements: () => Promise<void>;
  clearError: () => void;
}

export const useCashFlow = (): UseCashFlowReturn => {
  const [cashFlow, setCashFlow] = useState<CashFlowStatement | null>(null);
  const [cashFlowStatements, setCashFlowStatements] = useState<CashFlowStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCashFlow = useCallback(async (request: GenerateCashFlowRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await container.generateCashFlowUseCase.execute(request);
      if (response.success) {
        setCashFlow(response.cash_flow_statement);
      } else {
        setError(response.error || 'Failed to generate cash flow statement');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating cash flow statement');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToExcel = useCallback(async (reportId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const request: ExportReportRequest = reportId ? { report_id: reportId } : {};
      const response = await container.exportCashFlowExcelUseCase.execute(request);
      if (response.success && response.excel_data) {
        const blob = new Blob([atob(response.excel_data)], {
          type: response.content_type
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(response.error || 'Failed to export cash flow to Excel');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while exporting to Excel');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToPdf = useCallback(async (reportId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const request: ExportReportRequest = reportId ? { report_id: reportId } : {};
      const response = await container.exportCashFlowPdfUseCase.execute(request);
      if (response.success && response.pdf_data) {
        const blob = new Blob([atob(response.pdf_data)], {
          type: response.content_type
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(response.error || 'Failed to export cash flow to PDF');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while exporting to PDF');
    } finally {
      setLoading(false);
    }
  }, []);

  const listCashFlowStatements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await container.listCashFlowStatementsUseCase.execute();
      if (response.success && response.cash_flow_statements) {
        setCashFlowStatements(response.cash_flow_statements);
      } else {
        setError(response.error || 'Failed to fetch cash flow statements');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching cash flow statements');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    cashFlow,
    cashFlowStatements,
    loading,
    error,
    generateCashFlow,
    exportToExcel,
    exportToPdf,
    listCashFlowStatements,
    clearError
  };
};

interface UseTaxReportReturn {
  taxReport: TaxReport | null;
  taxReports: TaxReport[];
  taxAnalysis: TaxAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  generateTaxReport: (request: GenerateTaxReportRequest) => Promise<void>;
  generateTaxAnalysis: (request: TaxAnalysisRequest) => Promise<void>;
  listTaxReports: () => Promise<void>;
  clearError: () => void;
}

export const useTaxReport = (): UseTaxReportReturn => {
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null);
  const [taxReports, setTaxReports] = useState<TaxReport[]>([]);
  const [taxAnalysis, setTaxAnalysis] = useState<TaxAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTaxReport = useCallback(async (request: GenerateTaxReportRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await container.generateTaxReportUseCase.execute(request);
      if (response.success) {
        setTaxReport(response.report);
      } else {
        setError(response.error || 'Failed to generate tax report');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating tax report');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTaxAnalysis = useCallback(async (request: TaxAnalysisRequest) => {
    try {
      setLoading(true);
      setError(null);
      let response;
      
      switch (request.period_type) {
        case 'DAILY':
          response = await container.generateTaxAnalysisDailyUseCase.execute(request);
          break;
        case 'WEEKLY':
          response = await container.generateTaxAnalysisWeeklyUseCase.execute(request);
          break;
        case 'MONTHLY':
          response = await container.generateTaxAnalysisMonthlyUseCase.execute(request);
          break;
        case 'YEARLY':
          response = await container.generateTaxAnalysisYearlyUseCase.execute(request);
          break;
        case 'CUSTOM':
          response = await container.generateTaxAnalysisCustomUseCase.execute(request);
          break;
        default:
          throw new Error('Invalid period type');
      }
      
      if (response.success) {
        setTaxAnalysis(response);
      } else {
        setError(response.error || 'Failed to generate tax analysis');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating tax analysis');
    } finally {
      setLoading(false);
    }
  }, []);

  const listTaxReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await container.listTaxReportsUseCase.execute();
      if (response.success && response.tax_reports) {
        setTaxReports(response.tax_reports);
      } else {
        setError(response.error || 'Failed to fetch tax reports');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching tax reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    taxReport,
    taxReports,
    taxAnalysis,
    loading,
    error,
    generateTaxReport,
    generateTaxAnalysis,
    listTaxReports,
    clearError
  };
};