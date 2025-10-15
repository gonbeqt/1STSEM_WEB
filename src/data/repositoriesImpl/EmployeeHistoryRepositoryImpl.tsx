import { EmployeeHistory, EmployeeHistoryDetails } from "../../domain/entities/EmployeeHistoryEntities";
import { EmployeeHistoryRepository } from "../../domain/repositories/EmployeeHistoryRepository";
import apiService from '../api';

export class EmployeeHistoryRepositoryImpl implements EmployeeHistoryRepository {
    private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

    // Auth headers handled by ApiService interceptors

    async getEmployeeHistory(): Promise<EmployeeHistory> {
        const data = await apiService.get<EmployeeHistory>(
            `${this.API_URL}/employee/payroll/details/`
        );
        return data;
    }

    async getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails> {
        const data = await apiService.get<EmployeeHistoryDetails>(
            `${this.API_URL}/employee/payroll/entry-details/?entry_id=${entryId}`
        );
        return data;
    }
}

