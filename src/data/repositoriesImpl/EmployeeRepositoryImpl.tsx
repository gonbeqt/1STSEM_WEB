import { EmployeeRepository, AddEmployeeRequest, AddEmployeeResponse, GetEmployeesByManagerRequest, GetEmployeesByManagerResponse } from "../../domain/repositories/EmployeeRepository";
import axios from 'axios';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  private baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';

  async addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Authentication token not found.' };
      }

      const response = await axios.post(
        `${this.baseUrl}/auth/employees/add/`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data as AddEmployeeResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || error.message || 'Failed to add employee',
        details: error.response?.data?.details || null,
      };
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
}
