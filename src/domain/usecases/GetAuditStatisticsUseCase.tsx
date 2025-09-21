import { ContractRepositoryImpl } from "../../data/repositoriesImpl/ContractRepositoryImpl";
import { AuditStatisticsResponse } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";

export class GetAuditStatisticsUseCase {
    private contractRepository: ContractRepository;

    constructor() {
        this.contractRepository = new ContractRepositoryImpl();
    }

    async execute(): Promise<AuditStatisticsResponse> {
        try {
            return await this.contractRepository.getAuditStatistics();
        } catch (error: any) {
            console.error("Error getting audit statistics:", error);
            return { success: false, error: "Failed to fetch audit statistics." };
        }
    }
}
