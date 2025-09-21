import { ContractRepositoryImpl } from "../../data/repositoriesImpl/ContractRepositoryImpl";
import { AuditDetailsResponse } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";

export class GetAuditDetailsUseCase {
    private contractRepository: ContractRepository;

    constructor() {
        this.contractRepository = new ContractRepositoryImpl();
    }

    async execute(auditId: string): Promise<AuditDetailsResponse> {
        try {
            return await this.contractRepository.getAuditDetails(auditId);
        } catch (error: any) {
            console.error("Error getting audit details:", error);
            return { success: false, error: "Failed to fetch audit details." };
        }
    }
}
