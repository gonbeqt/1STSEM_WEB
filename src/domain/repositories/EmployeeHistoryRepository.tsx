import { EmployeeHistory, EmployeeHistoryDetails } from "../entities/EmployeeHistoryEntities";

export interface EmployeeHistoryRepository {
    getEmployeeHistory(): Promise<EmployeeHistory>;
    getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails>;
}
