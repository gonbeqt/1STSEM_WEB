import { GetEmployeeHistoryUseCase } from "../../domain/usecases/GetEmployeeHistoryUseCase";
import { EmployeeHistory, EmployeeHistoryDetails } from "../../domain/entities/EmployeeHistoryEntities";

export class EmployeeHistoryViewModel {
    private getEmployeeHistoryUseCase: GetEmployeeHistoryUseCase;

    constructor(getEmployeeHistoryUseCase: GetEmployeeHistoryUseCase) {
        this.getEmployeeHistoryUseCase = getEmployeeHistoryUseCase;
    }

    async getEmployeeHistory(): Promise<EmployeeHistory> {
        return await this.getEmployeeHistoryUseCase.getEmployeeHistory();
    }

    async getEmployeeHistoryDetails(entryId: string): Promise<EmployeeHistoryDetails> {
        return await this.getEmployeeHistoryUseCase.getEmployeeHistoryDetails(entryId);
    }
}
