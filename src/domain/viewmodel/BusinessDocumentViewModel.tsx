import { BusinessDocument } from "../entities/BusinessDocumentEntities";
import { UploadBusinessDocumentsUseCase } from "../usecases/UploadBusinessDocumentsUseCase";

export class BusinessDocumentViewModel {
    constructor(private readonly uploadBusinessDocumentsUseCase: UploadBusinessDocumentsUseCase) { }

    async uploadBusinessDocuments(documents: BusinessDocument): Promise<any> {
        return this.uploadBusinessDocumentsUseCase.execute(documents);
    }
}