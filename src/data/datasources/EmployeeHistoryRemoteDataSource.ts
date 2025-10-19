import { ApiService } from '../api/ApiService';
import { EmployeeHistory, EmployeeHistoryDetails } from '../../domain/entities/EmployeeHistoryEntities';

export class EmployeeHistoryRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async getEmployeeHistory(): Promise<EmployeeHistory> {
    const data = await this.api.get<EmployeeHistory>(`${this.apiUrl}/employee/payroll/details/`);
    return data;
  }

  async getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails> {
    const data = await this.api.get<EmployeeHistoryDetails>(
      `${this.apiUrl}/employee/payroll/entry-details/?entry_id=${entryId}`
    );
    return data;
  }
}
