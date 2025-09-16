import { ContractRepositoryImpl } from "../repositoriesImpl/ContractRepositoryImpl";
import { AuditContractResponse, AuditRequestData } from "../entities/ContractEntities";
import { ContractRepository } from "../../data/repositories/ContractRepository";

export class AuditContractUseCase {
    private contractRepository: ContractRepository;

    constructor() {
        this.contractRepository = new ContractRepositoryImpl();
    }

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
