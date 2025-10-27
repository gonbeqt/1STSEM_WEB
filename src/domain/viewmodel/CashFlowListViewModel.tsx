import { makeObservable, observable, action, runInAction } from 'mobx';
import { ListCashFlowStatementsUseCase } from '../usecases/ListCashFlowStatementsUseCase';

export interface CashFlowSummary {
  _id?: string;
  cash_flow_id?: string;
  user_id?: string;
  generated_at?: string;
  period_start?: string;
  period_end?: string;
  period?: string;
  report_type?: 'CUMULATIVE' | 'TRANSACTION' | 'PERIODIC';
  currency?: string;
  
  cash_flows?: {
    operating_activities?: {
      net_cash_from_operations?: number;
      previous_value?: number;
      transaction_impact?: number;
    };
    investing_activities?: {
      net_cash_from_investing?: number;
      previous_value?: number;
      transaction_impact?: number;
    };
    financing_activities?: {
      net_cash_from_financing?: number;
      previous_value?: number;
      transaction_impact?: number;
    };
  };
  
  operating_activities?: {
    cash_receipts?: Record<string, number>;
    cash_payments?: Record<string, number>;
    net_cash_flow?: number;
  };
  investing_activities?: {
    cash_receipts?: Record<string, number>;
    cash_payments?: Record<string, number>;
    net_cash_flow?: number;
  };
  financing_activities?: {
    cash_receipts?: Record<string, number>;
    cash_payments?: Record<string, number>;
    net_cash_flow?: number;
  };
  
  cash_summary?: {
    net_cash_from_operations?: number;
    net_cash_from_investing?: number;
    net_cash_from_financing?: number;
    net_change_in_cash?: number;
    cash_at_beginning?: number;
    cash_at_end?: number;
    beginning_cash?: number;
    ending_cash?: number;
  };
  
  transaction_details?: {
    transaction_type?: string;
    amount_usd?: number;
    description?: string;
    currency?: string;
  };
  analysis?: Record<string, any>;
  metadata?: Record<string, any>;
  
  [key: string]: any;
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
