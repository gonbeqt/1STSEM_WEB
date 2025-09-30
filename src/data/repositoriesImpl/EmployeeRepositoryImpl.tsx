import { EmployeeRepository, AddEmployeeRequest, AddEmployeeResponse, GetEmployeesByManagerRequest, GetEmployeesByManagerResponse, RemoveEmployeeFromTeamRequest, RemoveEmployeeFromTeamResponse } from "../../domain/repositories/EmployeeRepository";
import axios from 'axios';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  private baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';
  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  async addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    try {
      console.log('Making API call to add employee:', request);

      const headers = this.getAuthHeaders();
      console.log('Using headers:', headers);

      const response = await axios.post(
        `${this.baseUrl}/auth/employees/add/`,
        request,
        { headers }
      );

      console.log('API Response:', response.data);
      return response.data as AddEmployeeResponse;
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
          details: error.response.data?.details || null,
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

  async getEmployeesByManager(request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse> {
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        return { employees: [], total_count: 0, manager: '', success: false, error: 'Authentication token not found.' };
      }

      const response = await axios.get(
        `${this.baseUrl}/auth/employees/list/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { ...response.data, success: true } as GetEmployeesByManagerResponse;
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
      console.log('Making API call to remove employee from team:', request);

      const headers = this.getAuthHeaders();
      console.log('Using headers:', headers);

      const response = await axios.post(
        `${this.baseUrl}/auth/employees/remove-from-team/`,
        request,
        { headers }
      );

      console.log('API Response:', response.data);
      return response.data as RemoveEmployeeFromTeamResponse;
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
