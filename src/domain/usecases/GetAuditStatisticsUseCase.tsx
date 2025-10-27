import { AuditStatisticsResponse } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";

export class GetAuditStatisticsUseCase {
    constructor(private readonly contractRepository: ContractRepository) {}

    async execute(): Promise<AuditStatisticsResponse> {
        try {
            return await this.contractRepository.getAuditStatistics();
        } catch (error: any) {            return { success: false, error: "Failed to fetch audit statistics." };
        }
    }
}
