import { ApiService } from '../api/ApiService';
import { InvestmentReportRequest, InvestmentReportResponse } from '../../domain/entities/InvestmentEntities';

export class InvestmentRemoteDataSource {
  // Keep a local apiUrl for callers that need to resolve full URLs here.
  // Falls back to relative paths when not configured in env.
  private readonly apiUrl: string = process.env.REACT_APP_API_BASE_URL ?? '';

  constructor(private readonly api: ApiService) {}

  private buildUrl(path: string): string {
    // If a full URL is provided, use it directly.
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    // If apiUrl is configured use it to build an absolute endpoint, otherwise return a relative path.
    const sanitizedBase = (this.apiUrl || '').replace(/\/+$/, '');
    const sanitizedPath = path.replace(/^\/+/, '');
    if (!sanitizedBase) {
      return `/${sanitizedPath}`;
    }
    return `${sanitizedBase}/${sanitizedPath}`;
  }

  async getInvestmentStatistics(request?: InvestmentReportRequest): Promise<InvestmentReportResponse> {
    const params = new URLSearchParams();

    if (request?.start_date) {
      params.append('start_date', request.start_date);
    }

    if (request?.end_date) {
      params.append('end_date', request.end_date);
    }

  const query = params.toString();
  // Use a relative endpoint; ApiService already has baseURL configured in the DI container.
  const basePath = this.buildUrl('/financial/investment-report/statistics/');
      const pathWithQuery = query ? `${basePath}${basePath.includes('?') ? '&' : '?'}${query}` : basePath;

      try {
        const response = await this.api.get<InvestmentReportResponse>(pathWithQuery);
        if (response.success === undefined) {
          return {
            success: true,
            investments: response.investments ?? [],
            count: response.count ?? response.investments?.length ?? 0
          };
        }
        return response;
      } catch (error: any) {
        console.error('[InvestmentRemoteDataSource] Failed to fetch investment statistics', {
          error,
          path: pathWithQuery
        });
        return {
          success: false,
          investments: [],
          error:
            error instanceof Error
              ? error.message
              : 'Unable to fetch investment statistics'
        };
      }
  }
}
