// Update the import path if the file exists elsewhere, for example:
import axios from 'axios';
import { EmployeeHistory, EmployeeHistoryDetails } from "../../domain/entities/EmployeeHistoryEntities";
import { EmployeeHistoryRepository } from "../../domain/repositories/EmployeeHistoryRepository";

export class EmployeeHistoryRepositoryImpl implements EmployeeHistoryRepository {
    private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        };
    }

    async getEmployeeHistory(): Promise<EmployeeHistory> {
        const response = await axios.get<EmployeeHistory>(
            `${this.API_URL}/employee/payroll/details/`,
            this.getAuthHeaders()
        );
        return response.data;
    }

    async getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails> {
        const response = await axios.get<EmployeeHistoryDetails>(
            `${this.API_URL}/employee/payroll/entry-details/?entry_id=${entryId}`,
            this.getAuthHeaders()
        );
        return response.data;
    }
}

