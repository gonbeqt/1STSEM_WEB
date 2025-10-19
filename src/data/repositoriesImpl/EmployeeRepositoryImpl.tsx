import { EmployeeRepository, AddEmployeeRequest, AddEmployeeResponse, GetEmployeesByManagerRequest, GetEmployeesByManagerResponse, RemoveEmployeeFromTeamRequest, RemoveEmployeeFromTeamResponse } from "../../domain/repositories/EmployeeRepository";
import { EmployeeRemoteDataSource } from '../datasources/EmployeeRemoteDataSource';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(private readonly remote: EmployeeRemoteDataSource) {}

  async addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    return this.remote.addEmployee(request);
  }

  async getEmployeesByManager(request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse> {
    return this.remote.getEmployeesByManager(request);
  }

  async removeEmployeeFromTeam(request: RemoveEmployeeFromTeamRequest): Promise<RemoveEmployeeFromTeamResponse> {
    return this.remote.removeEmployeeFromTeam(request);
  }
}
