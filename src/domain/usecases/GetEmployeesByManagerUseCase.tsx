import { EmployeeRepository, GetEmployeesByManagerRequest, GetEmployeesByManagerResponse } from "../repositories/EmployeeRepository";

export class GetEmployeesByManagerUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse> {
    return this.employeeRepository.getEmployeesByManager(request);
  }
}
