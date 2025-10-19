import { AuditDetailsResponse } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";

export class GetAuditDetailsUseCase {
    constructor(private readonly contractRepository: ContractRepository) {}

    async execute(auditId: string): Promise<AuditDetailsResponse> {
        try {
            return await this.contractRepository.getAuditDetails(auditId);
        } catch (error: any) {
            console.error("Error getting audit details:", error);
            return { success: false, error: "Failed to fetch audit details." };
        }
    }
}
