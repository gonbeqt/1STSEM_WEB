import { EmployeeHistory, EmployeeHistoryDetails } from "../../domain/entities/EmployeeHistoryEntities";
import { EmployeeHistoryRepository } from "../../domain/repositories/EmployeeHistoryRepository";
import { EmployeeHistoryRemoteDataSource } from '../datasources/EmployeeHistoryRemoteDataSource';

export class EmployeeHistoryRepositoryImpl implements EmployeeHistoryRepository {
    constructor(private readonly remote: EmployeeHistoryRemoteDataSource) {}

    async getEmployeeHistory(): Promise<EmployeeHistory> {
        return this.remote.getEmployeeHistory();
    }

    async getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails> {
        return this.remote.getEmployeeHistoryDetails(entryId);
    }
}

