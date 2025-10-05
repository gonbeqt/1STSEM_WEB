import { EmployeeHistory, EmployeeHistoryDetails } from "../entities/EmployeeHistoryEntities";
import { EmployeeHistoryRepository } from "../repositories/EmployeeHistoryRepository";

export interface GetEmployeeHistoryUseCase {
    getEmployeeHistory(): Promise<EmployeeHistory>;
    getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails>;
}

export class GetEmployeeHistoryUseCaseImpl implements GetEmployeeHistoryUseCase {
    constructor(private employeeHistoryRepository: EmployeeHistoryRepository) {}

    getEmployeeHistory(): Promise<EmployeeHistory> {
        return this.employeeHistoryRepository.getEmployeeHistory();
    }

    getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails> {
        return this.employeeHistoryRepository.getEmployeeHistoryDetails(entryId);
    }
}
