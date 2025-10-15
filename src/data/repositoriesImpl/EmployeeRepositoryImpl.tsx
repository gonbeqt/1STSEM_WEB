import { EmployeeRepository, AddEmployeeRequest, AddEmployeeResponse, GetEmployeesByManagerRequest, GetEmployeesByManagerResponse, RemoveEmployeeFromTeamRequest, RemoveEmployeeFromTeamResponse } from "../../domain/repositories/EmployeeRepository";
import apiService from '../api';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  private baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';
  // Auth handled by ApiService interceptors
  async addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
   

      const data = await apiService.post<AddEmployeeResponse>(
        `${this.baseUrl}/auth/employees/add/`,
        request
      );

      return data as AddEmployeeResponse;
  
   
    
  }

  async getEmployeesByManager(request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse> {
    try {
      
      const data = await apiService.get<GetEmployeesByManagerResponse>(
        `${this.baseUrl}/auth/employees/list/`
      );

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

      // Convert username to email format for the API
      const requestData = {
        email: request.username // The backend expects 'email' field
      };

      const data = await apiService.post<RemoveEmployeeFromTeamResponse>(
        `${this.baseUrl}/auth/employees/remove-from-team/`,
        requestData
      );

      return data as RemoveEmployeeFromTeamResponse;
    } catch (error: any) {
      console.error('API Error:', error);

      if (error.response) {
        // Server responded with error status
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);

        return {
          success: false,
          message: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`,
          error: error.response.data?.error || 'API_ERROR',
        };
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        return {
          success: false,
          message: 'Network error. Please check your internet connection.',
          error: 'NETWORK_ERROR'
        };
      } else {
        // Other error
        console.error('Unknown error:', error.message);
        return {
          success: false,
          message: error.message || 'An unexpected error occurred',
          error: 'UNKNOWN_ERROR'
        };
      }
    }
  }
}
