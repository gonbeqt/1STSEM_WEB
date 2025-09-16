import { ContractRepositoryImpl } from "../repositoriesImpl/ContractRepositoryImpl";
import { Audit } from "../entities/ContractEntities";
import { ContractRepository } from "../../data/repositories/ContractRepository";

export class ListAuditsUseCase {
    private contractRepository: ContractRepository;

    constructor() {
        this.contractRepository = new ContractRepositoryImpl();
    }

    async execute(): Promise<Audit[]> {
        try {
            return await this.contractRepository.listAudits();
        } catch (error) {
            console.error("Error listing audits:", error);
            return [];
        }
    }
}
