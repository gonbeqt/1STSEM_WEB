import { BusinessDocument } from "../entities/BusinessDocumentEntities";
import { BusinessDocumentRepository } from "../repositories/BusinessDocumentRepository";

export class UploadBusinessDocumentsUseCase {
    constructor(private readonly businessDocumentRepository: BusinessDocumentRepository) { }

    async execute(documents: BusinessDocument): Promise<any> {
        return this.businessDocumentRepository.uploadBusinessDocuments(documents);
    }
}