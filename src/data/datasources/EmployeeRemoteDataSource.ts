import { ApiService } from '../api/ApiService';
import {
  AddEmployeeRequest,
  AddEmployeeResponse,
  GetEmployeesByManagerRequest,
  GetEmployeesByManagerResponse,
  RemoveEmployeeFromTeamRequest,
  RemoveEmployeeFromTeamResponse,
} from '../../domain/repositories/EmployeeRepository';

export class EmployeeRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL || '';

  constructor(private readonly api: ApiService) {}

  async addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    const data = await this.api.post<AddEmployeeResponse>(`${this.apiUrl}/auth/employees/add/`, request);
    return data as AddEmployeeResponse;
  }

  async getEmployeesByManager(request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse> {
    void request; // Request currently unused but kept for parity with repository signature.
    try {
      const data = await this.api.get<GetEmployeesByManagerResponse>(`${this.apiUrl}/auth/employees/list/`);
      return { ...data, success: true } as GetEmployeesByManagerResponse;
    } catch (error: any) {
      return {
        employees: [],
        total_count: 0,
        manager: '',
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch employees',
      };
    }
  }

  async removeEmployeeFromTeam(request: RemoveEmployeeFromTeamRequest): Promise<RemoveEmployeeFromTeamResponse> {
    try {
      const requestData = {
        email: request.username,
      };

      const data = await this.api.post<RemoveEmployeeFromTeamResponse>(
        `${this.apiUrl}/auth/employees/remove-from-team/`,
        requestData
      );

      return data as RemoveEmployeeFromTeamResponse;
    } catch (error: any) {
      console.error('API Error:', error);

      if (error.response) {
        return {
          success: false,
          message: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`,
          error: error.response.data?.error || 'API_ERROR',
        };
      }
      if (error.request) {
        return {
          success: false,
          message: 'Network error. Please check your internet connection.',
          error: 'NETWORK_ERROR',
        };
      }
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        error: 'UNKNOWN_ERROR',
      };
    }
  }
}
