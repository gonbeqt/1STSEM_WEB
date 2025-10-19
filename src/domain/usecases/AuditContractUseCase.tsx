import { AuditContractResponse, AuditRequestData } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";

export class AuditContractUseCase {
    constructor(private readonly contractRepository: ContractRepository) {}

    async execute(auditData: AuditRequestData): Promise<AuditContractResponse> {
        try {
            return await this.contractRepository.auditContract(auditData);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                return { success: false, error: error.response.data.error };
            }
            return { success: false, error: "An unexpected error occurred during the audit." };
        }
    }
}
