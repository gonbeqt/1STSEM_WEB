import { makeAutoObservable, runInAction } from 'mobx';
import { GetInvestmentReportUseCase } from '../usecases/GetInvestmentReportUseCase';
import { InvestmentRecord, InvestmentReportRequest } from '../entities/InvestmentEntities';

export type InvestmentFilter = 'all' | 'received' | 'sent';

interface InvestmentReportState {
  investments: InvestmentRecord[];
  isLoading: boolean;
  error: string | null;
  filter: InvestmentFilter;
  startDate?: string;
  endDate?: string;
  lastUpdatedAt?: Date;
}

export class InvestmentReportViewModel {
  private state: InvestmentReportState = {
    investments: [],
    isLoading: false,
    error: null,
    filter: 'all'
  };

  constructor(private readonly getInvestmentReportUseCase: GetInvestmentReportUseCase) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadInvestmentReport(request?: InvestmentReportRequest): Promise<void> {
    runInAction(() => {
      this.state.isLoading = true;
      this.state.error = null;
    });

    try {
      const response = await this.getInvestmentReportUseCase.execute(request ?? {
        start_date: this.state.startDate,
        end_date: this.state.endDate
      });

      if (!response.success) {
        throw new Error(response.error || 'Unable to load investment statistics');
      }

      runInAction(() => {
        this.state.investments = (response.investments || []).map(this.normalizeInvestmentRecord);
        this.state.lastUpdatedAt = new Date();
        if (request?.start_date !== undefined) {
          this.state.startDate = request.start_date;
        }
        if (request?.end_date !== undefined) {
          this.state.endDate = request.end_date;
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load investment statistics';
      runInAction(() => {
        this.state.error = message;
        this.state.investments = [];
      });
    } finally {
      runInAction(() => {
        this.state.isLoading = false;
      });
    }
  }

  setFilter(filter: InvestmentFilter) {
    this.state.filter = filter;
  }

  setDateRange(startDate?: string, endDate?: string) {
    this.state.startDate = startDate;
    this.state.endDate = endDate;
  }

  clearError() {
    this.state.error = null;
  }

  get investments(): InvestmentRecord[] {
    return this.state.investments;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get error(): string | null {
    return this.state.error;
  }

  get filter(): InvestmentFilter {
    return this.state.filter;
  }

  get startDate(): string | undefined {
    return this.state.startDate;
  }

  get endDate(): string | undefined {
    return this.state.endDate;
  }

  get lastUpdatedAt(): Date | undefined {
    return this.state.lastUpdatedAt;
  }

  get filteredInvestments(): InvestmentRecord[] {
    if (this.state.filter === 'all') {
      return this.state.investments;
    }

    return this.state.investments.filter((item) => item.direction.toLowerCase() === this.state.filter);
  }

  get totals() {
    const summary = this.state.investments.reduce(
      (acc, item) => {
        if (item.direction === 'RECEIVED') {
          acc.received += item.amount;
        } else if (item.direction === 'SENT') {
          acc.sent += item.amount;
        }
        return acc;
      },
      { received: 0, sent: 0 }
    );

    return {
      totalReceived: summary.received,
      totalSent: summary.sent,
      transactionCount: this.state.investments.length
    };
  }

  private normalizeInvestmentRecord(record: InvestmentRecord): InvestmentRecord {
    return {
      ...record,
      direction: record.direction === 'SENT' ? 'SENT' : 'RECEIVED',
      amount: typeof record.amount === 'number' ? record.amount : Number(record.amount || 0)
    };
  }
}
