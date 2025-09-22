import { EmployeeRepository, AddEmployeeRequest, AddEmployeeResponse } from "../repositories/EmployeeRepository";

export class AddEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    // Validate required fields
    if (!request.email || !request.email.trim()) {
      return {
        success: false,
        message: 'Please provide employee email to add to your team',
        error: 'VALIDATION_ERROR'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        error: 'VALIDATION_ERROR'
      };
    }

    // Trim optional fields
    const cleanRequest: AddEmployeeRequest = {
      email: request.email.trim(),
      position: request.position?.trim() || '',
      department: request.department?.trim() || '',
      full_name: request.full_name?.trim() || '',
      phone: request.phone?.trim() || ''
    };

    try {
      return await this.employeeRepository.addEmployee(cleanRequest);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to add employee to team',
        error: 'NETWORK_ERROR'
      };
    }
  }
}