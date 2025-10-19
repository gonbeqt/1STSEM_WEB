import { BusinessDocument } from "../../domain/entities/BusinessDocumentEntities";
import { BusinessDocumentRepository } from "../../domain/repositories/BusinessDocumentRepository";
import { BusinessDocumentRemoteDataSource } from '../datasources/BusinessDocumentRemoteDataSource';

export class BusinessDocumentRepositoryImpl implements BusinessDocumentRepository {
    constructor(private readonly remote: BusinessDocumentRemoteDataSource) {}
    
    async uploadBusinessDocuments(documents: BusinessDocument): Promise<any> {
        return this.remote.uploadBusinessDocuments(documents);
    }

    async getUserDocuments(): Promise<any> {
        return this.remote.getUserDocuments();
    }

    async submitDocumentsForApproval(): Promise<any> {
        return this.remote.submitDocumentsForApproval();
    }
}