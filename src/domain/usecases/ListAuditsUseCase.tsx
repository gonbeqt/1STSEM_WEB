import { Audit } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";

export class ListAuditsUseCase {
    constructor(private readonly contractRepository: ContractRepository) {}

    async execute(): Promise<Audit[]> {
        try {
            return await this.contractRepository.listAudits();
        } catch (error) {            return [];
        }
    }
}
