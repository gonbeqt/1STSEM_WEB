import { makeAutoObservable, runInAction } from 'mobx';
import { ListIncomeStatementsUseCase } from '../usecases/ReportUseCases';
import { ListReportsResponse } from '../entities/ReportEntities';

export class IncomeViewModel {
  private incomeStatements: any[] = [];
  private loading = false;
  private error: string | null = null;

  constructor(private readonly listIncomeStatementsUseCase: ListIncomeStatementsUseCase) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get items(): any[] {
    return this.incomeStatements;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  get lastError(): string | null {
    return this.error;
  }

  async fetchAll(): Promise<boolean> {
    this.loading = true;
    this.error = null;
    try {
      const response: ListReportsResponse = await this.listIncomeStatementsUseCase.execute();
      if (!response.success) {
        throw new Error(response.error || 'Failed to load income statements');
      }
      runInAction(() => {
        this.incomeStatements = response.income_statements ?? [];
      });
      return true;
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      runInAction(() => {
        this.error = msg;
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  clearError(): void {
    this.error = null;
  }

  reset(): void {
    runInAction(() => {
      this.incomeStatements = [];
      this.loading = false;
      this.error = null;
    });
  }
}
