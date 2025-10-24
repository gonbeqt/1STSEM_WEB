import { makeObservable, observable, action, runInAction } from 'mobx';
import { ListBalanceSheetUseCase } from '../usecases/BalanceSheetListUseCase';
import { ListBalanceSheetsParams } from '../entities/ReportEntities';

interface BalanceSheetSummary {
  balance_sheet_id?: string;
  as_of_date?: string;
  totals?: {
    total_assets: number;
    total_liabilities: number;
    total_equity: number;
  };
  [key: string]: any;
}

export class BalanceSheetListViewModel {
  items: BalanceSheetSummary[] = [];
  isLoading: boolean = false;
  lastError: string | null = null;

  constructor(private readonly useCase: ListBalanceSheetUseCase) {
    makeObservable(this, {
      items: observable,
      isLoading: observable,
      lastError: observable,
      fetchAll: action,
      clearError: action,
    });
  }

  async fetchAll(params?: ListBalanceSheetsParams): Promise<void> {
    this.isLoading = true;
    this.lastError = null;

    try {
      const response = await this.useCase.execute(params);
      runInAction(() => {
        this.items = response.balance_sheets || [];
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.lastError = error?.message || 'Failed to fetch balance sheets';
        this.isLoading = false;
      });
    }
  }

  clearError(): void {
    this.lastError = null;
  }
}
