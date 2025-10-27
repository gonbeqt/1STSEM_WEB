import { EmployeeRepository, RemoveEmployeeFromTeamRequest, RemoveEmployeeFromTeamResponse } from "../repositories/EmployeeRepository";

export class RemoveEmployeeFromTeamUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(request: RemoveEmployeeFromTeamRequest): Promise<RemoveEmployeeFromTeamResponse> {
    if (!request.username || !request.username.trim()) {
      return {
        success: false,
        message: 'Please provide employee username to remove from team',
        error: 'VALIDATION_ERROR'
      };
    }

    const cleanRequest: RemoveEmployeeFromTeamRequest = {
      username: request.username.trim()
    };

    try {
      return await this.employeeRepository.removeEmployeeFromTeam(cleanRequest);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to remove employee from team',
        error: 'NETWORK_ERROR'
      };
    }
  }
}
