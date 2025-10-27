import { makeAutoObservable, runInAction } from 'mobx';
import {
  RiskAnalysisGenerateRequest,
  RiskAnalysisHistoryEntry,
  RiskAnalysisHistoryParams,
  RiskAnalysisOverview,
  RiskAnalysisPeriod,
  RiskAnalysisResponse
} from '../entities/ReportEntities';
import {
  GenerateDailyRiskAnalysisUseCase,
  GenerateMonthlyRiskAnalysisUseCase,
  GenerateQuarterlyRiskAnalysisUseCase,
  GenerateWeeklyRiskAnalysisUseCase,
  GenerateYearlyRiskAnalysisUseCase,
  GetLatestRiskAnalysisUseCase,
  GetRiskAnalysisHistoryUseCase
} from '../usecases/RiskAnalysisUseCases';

export class RiskAnalysisViewModel {
  private readonly riskAnalyses: Partial<Record<RiskAnalysisPeriod, RiskAnalysisOverview>> = {};
  private readonly loadingState: Partial<Record<RiskAnalysisPeriod, boolean>> = {};
  private readonly errorState: Partial<Record<RiskAnalysisPeriod, string | null>> = {};
  private readonly messageState: Partial<Record<RiskAnalysisPeriod, string | undefined>> = {};

  history: RiskAnalysisHistoryEntry[] = [];
  historyLoading = false;
  historyError: string | null = null;

  constructor(
    private readonly generateDailyRiskAnalysis: GenerateDailyRiskAnalysisUseCase,
    private readonly generateWeeklyRiskAnalysis: GenerateWeeklyRiskAnalysisUseCase,
    private readonly generateMonthlyRiskAnalysis: GenerateMonthlyRiskAnalysisUseCase,
    private readonly generateQuarterlyRiskAnalysis: GenerateQuarterlyRiskAnalysisUseCase,
    private readonly generateYearlyRiskAnalysis: GenerateYearlyRiskAnalysisUseCase,
    private readonly getRiskAnalysisHistory: GetRiskAnalysisHistoryUseCase,
    private readonly getLatestRiskAnalysis: GetLatestRiskAnalysisUseCase
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getAnalysis(period: RiskAnalysisPeriod): RiskAnalysisOverview | undefined {
    return this.riskAnalyses[period];
  }

  hasAnalysis(period: RiskAnalysisPeriod): boolean {
    return Boolean(this.riskAnalyses[period]);
  }

  getMessage(period: RiskAnalysisPeriod): string | undefined {
    return this.messageState[period];
  }

  getError(period: RiskAnalysisPeriod): string | null {
    return this.errorState[period] ?? null;
  }

  isLoading(period: RiskAnalysisPeriod): boolean {
    return Boolean(this.loadingState[period]);
  }

  async generate(period: RiskAnalysisPeriod, request: RiskAnalysisGenerateRequest = {}): Promise<boolean> {
    this.setLoading(period, true);
    this.setError(period, null);

    try {
      const response = await this.executeGenerate(period, request);
      runInAction(() => {
        this.riskAnalyses[period] = response.risk_analysis;
        this.messageState[period] = response.message;
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate risk analysis';
      this.setError(period, message);
      return false;
    } finally {
      this.setLoading(period, false);
    }
  }

  private async executeGenerate(
    period: RiskAnalysisPeriod,
    request: RiskAnalysisGenerateRequest
  ): Promise<RiskAnalysisResponse> {
    switch (period) {
      case 'DAILY':
        return this.generateDailyRiskAnalysis.execute(request);
      case 'WEEKLY':
        return this.generateWeeklyRiskAnalysis.execute(request);
      case 'MONTHLY':
        return this.generateMonthlyRiskAnalysis.execute(request);
      case 'QUARTERLY':
        return this.generateQuarterlyRiskAnalysis.execute(request);
      case 'YEARLY':
        return this.generateYearlyRiskAnalysis.execute(request);
      default:
        throw new Error(`Unsupported risk analysis period: ${period}`);
    }
  }

  async fetchLatest(period: RiskAnalysisPeriod): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.setError(period, 'User information is not available.');
      return false;
    }

    this.setLoading(period, true);
    this.setError(period, null);

    try {
      const response = await this.getLatestRiskAnalysis.execute({ userId, periodType: period });
      runInAction(() => {
        this.riskAnalyses[period] = response.risk_analysis;
        this.messageState[period] = response.message;
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load latest risk analysis';
      this.setError(period, message);
      return false;
    } finally {
      this.setLoading(period, false);
    }
  }

  async fetchHistory(params: RiskAnalysisHistoryParams = {}): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      runInAction(() => {
        this.historyError = 'User information is not available.';
      });
      return false;
    }

    this.historyLoading = true;
    this.historyError = null;

    try {
      const response = await this.getRiskAnalysisHistory.execute({ userId, ...params });
      runInAction(() => {
        this.history = response.risk_analyses;
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load risk analysis history';
      runInAction(() => {
        this.historyError = message;
      });
      return false;
    } finally {
      runInAction(() => {
        this.historyLoading = false;
      });
    }
  }

  clearPeriod(period: RiskAnalysisPeriod) {
    runInAction(() => {
      delete this.riskAnalyses[period];
      delete this.errorState[period];
      delete this.messageState[period];
    });
  }

  private setLoading(period: RiskAnalysisPeriod, isLoading: boolean) {
    runInAction(() => {
      this.loadingState[period] = isLoading;
    });
  }

  private setError(period: RiskAnalysisPeriod, message: string | null) {
    runInAction(() => {
      this.errorState[period] = message;
    });
  }

  private getCurrentUserId(): string | null {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored);
      return parsed?.id || parsed?._id || parsed?.user_id || null;
    } catch (error) {      return null;
    }
  }
}
