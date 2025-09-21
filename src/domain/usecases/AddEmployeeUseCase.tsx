import { EmployeeRepository, AddEmployeeRequest, AddEmployeeResponse } from "../repositories/EmployeeRepository";

export class AddEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    return this.employeeRepository.addEmployee(request);
  }
}
