import { ContractRepositoryImpl } from "../../data/repositoriesImpl/ContractRepositoryImpl";
import { Audit } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";

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
