import { makeObservable, observable, action, runInAction } from 'mobx';
import { ListTaxReportsUseCase } from './../usecases/ListTaxReportsUseCase';
import { TaxReport as BaseTaxReport } from '../entities/ReportEntities';

// Extended TaxReport type that includes MongoDB _id from API response
export type TaxReport = BaseTaxReport & {
  _id?: string;
  tax_deduction_summary?: any;
  llm_analysis?: string;
};

export class TaxSummaryViewModel {
  items: TaxReport[] = [];
  selectedReport: TaxReport | null = null;
  isLoading: boolean = false;
  lastError: string | null = null;

  constructor(private readonly listTaxReportsUseCase: ListTaxReportsUseCase) {
    makeObservable(this, {
      items: observable,
      selectedReport: observable,
      isLoading: observable,
      lastError: observable,
      fetchAll: action,
      selectReport: action,
      clearError: action,
    });
  }

  async fetchAll(): Promise<void> {
    this.isLoading = true;
    this.lastError = null;

    try {
      const response = await this.listTaxReportsUseCase.execute();
      
      runInAction(() => {
        if (response.success && response.tax_reports) {
          this.items = response.tax_reports as TaxReport[];
          // Auto-select the most recent report
          if (this.items.length > 0) {
            this.selectedReport = this.items[0];
          }
        } else {
          this.lastError = 'Failed to fetch tax reports';
        }
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.lastError = error.message || 'An error occurred while fetching tax reports';
        this.isLoading = false;
      });
    }
  }

  selectReport(report: TaxReport): void {
    this.selectedReport = report;
  }

  clearError(): void {
    this.lastError = null;
  }
}
