import { BusinessDocument } from "../entities/BusinessDocumentEntities";

export interface BusinessDocumentRepository {
    uploadBusinessDocuments(documents: BusinessDocument): Promise<any>;
    getUserDocuments(): Promise<any>;
    submitDocumentsForApproval(): Promise<any>;
}