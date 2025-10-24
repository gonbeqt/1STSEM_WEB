import { makeAutoObservable, runInAction } from 'mobx';
import {
  BalanceSheetData,
  GenerateBalanceSheetRequest,
  ListBalanceSheetsParams,
  ExportReportRequest,
  ExportReportResponse
} from '../entities/ReportEntities';
import {
  GenerateBalanceSheetUseCase,
  ListBalanceSheetsUseCase,
  ExportBalanceSheetExcelUseCase,
  ExportBalanceSheetPdfUseCase
} from '../usecases/ReportUseCases';

interface BalanceSheetState {
  current: BalanceSheetData | null;
  history: BalanceSheetData[];
  isGenerating: boolean;
  isHistoryLoading: boolean;
  isExportingExcel: boolean;
  isExportingPdf: boolean;
  error: string | null;
  historyError: string | null;
  filters: ListBalanceSheetsParams;
  lastGeneratedAt?: Date;
}

export class BalanceSheetViewModel {
  private state: BalanceSheetState = {
    current: null,
    history: [],
    isGenerating: false,
    isHistoryLoading: false,
    isExportingExcel: false,
    isExportingPdf: false,
    error: null,
    historyError: null,
    filters: {}
  };

  constructor(
    private readonly generateBalanceSheetUseCase: GenerateBalanceSheetUseCase,
    private readonly listBalanceSheetsUseCase: ListBalanceSheetsUseCase,
    private readonly exportBalanceSheetExcelUseCase: ExportBalanceSheetExcelUseCase,
    private readonly exportBalanceSheetPdfUseCase: ExportBalanceSheetPdfUseCase
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get balanceSheet(): BalanceSheetData | null {
    return this.state.current;
  }

  get history(): BalanceSheetData[] {
    return this.state.history;
  }

  get isGenerating(): boolean {
    return this.state.isGenerating;
  }

  get isHistoryLoading(): boolean {
    return this.state.isHistoryLoading;
  }

  get error(): string | null {
    return this.state.error;
  }

  get historyError(): string | null {
    return this.state.historyError;
  }

  get filters(): ListBalanceSheetsParams {
    return this.state.filters;
  }

  get lastGeneratedAt(): Date | undefined {
    return this.state.lastGeneratedAt;
  }

  get isExportingExcel(): boolean {
    return this.state.isExportingExcel;
  }

  get isExportingPdf(): boolean {
    return this.state.isExportingPdf;
  }

  async generate(request: GenerateBalanceSheetRequest): Promise<boolean> {
    this.state.isGenerating = true;
    this.state.error = null;

    try {
      const response = await this.generateBalanceSheetUseCase.execute(request);
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate balance sheet');
      }

      runInAction(() => {
        this.state.current = response.balance_sheet;
        this.state.lastGeneratedAt = new Date();
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate balance sheet';
      runInAction(() => {
        this.state.error = message;
        this.state.current = null;
      });
      return false;
    } finally {
      runInAction(() => {
        this.state.isGenerating = false;
      });
    }
  }

  async fetchHistory(params?: ListBalanceSheetsParams): Promise<boolean> {
    this.state.isHistoryLoading = true;
    this.state.historyError = null;

    const nextFilters: ListBalanceSheetsParams = {
      ...this.state.filters,
      ...(params ?? {})
    };

    try {
      const response = await this.listBalanceSheetsUseCase.execute(nextFilters);
      if (!response.success) {
        throw new Error(response.error || 'Failed to load balance sheet history');
      }

      runInAction(() => {
        this.state.history = response.balance_sheets ?? [];
        this.state.filters = nextFilters;
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load balance sheet history';
      runInAction(() => {
        this.state.historyError = message;
        this.state.filters = nextFilters;
      });
      return false;
    } finally {
      runInAction(() => {
        this.state.isHistoryLoading = false;
      });
    }
  }

  async exportToExcel(reportId?: string): Promise<ExportReportResponse | null> {
    this.state.isExportingExcel = true;
    this.state.error = null;

    const request: ExportReportRequest = reportId ? { report_id: reportId } : {};

    try {
      const response = await this.exportBalanceSheetExcelUseCase.execute(request);
      if (!response.success || !response.excel_data) {
        throw new Error(response.error || 'Failed to export balance sheet to Excel');
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export balance sheet to Excel';
      runInAction(() => {
        this.state.error = message;
      });
      return null;
    } finally {
      runInAction(() => {
        this.state.isExportingExcel = false;
      });
    }
  }

  async exportToPdf(reportId?: string): Promise<ExportReportResponse | null> {
    this.state.isExportingPdf = true;
    this.state.error = null;

    const request: ExportReportRequest = reportId ? { report_id: reportId } : {};

    try {
      const response = await this.exportBalanceSheetPdfUseCase.execute(request);
      if (!response.success || !response.pdf_data) {
        throw new Error(response.error || 'Failed to export balance sheet to PDF');
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export balance sheet to PDF';
      runInAction(() => {
        this.state.error = message;
      });
      return null;
    } finally {
      runInAction(() => {
        this.state.isExportingPdf = false;
      });
    }
  }

  clearError(): void {
    this.state.error = null;
  }

  clearHistoryError(): void {
    this.state.historyError = null;
  }

  reset(): void {
    runInAction(() => {
      this.state = {
        current: null,
        history: [],
        isGenerating: false,
        isHistoryLoading: false,
        isExportingExcel: false,
        isExportingPdf: false,
        error: null,
        historyError: null,
        filters: {},
        lastGeneratedAt: undefined
      };
    });
  }
}
