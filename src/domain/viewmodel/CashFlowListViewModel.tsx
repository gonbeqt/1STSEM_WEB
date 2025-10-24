import { makeObservable, observable, action, runInAction } from 'mobx';
import { ListCashFlowStatementsUseCase } from '../usecases/ListCashFlowStatementsUseCase';

export interface CashFlowSummary {
  _id?: string;
  generated_at?: string;
  operating_activities?: {
    net_cash_flow: number;
  };
  investing_activities?: {
    net_cash_flow: number;
  };
  financing_activities?: {
    net_cash_flow: number;
  };
  cash_summary?: {
    beginning_cash: number;
    ending_cash: number;
    net_change_in_cash: number;
  };
}

export class CashFlowListViewModel {
  items: CashFlowSummary[] = [];
  isLoading = false;
  lastError: string | null = null;

  constructor(private useCase: ListCashFlowStatementsUseCase) {
    makeObservable(this, {
      items: observable,
      isLoading: observable,
      lastError: observable,
      fetchAll: action,
      clearError: action
    });
  }

  async fetchAll() {
    this.isLoading = true;
    this.lastError = null;
    
    try {
      const response = await this.useCase.execute();
      runInAction(() => {
        this.items = (response?.cash_flow_statements as CashFlowSummary[]) || [];
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.lastError = error?.message || 'Failed to fetch cash flow statements';
        this.isLoading = false;
      });
    }
  }

  clearError() {
    this.lastError = null;
  }
}
