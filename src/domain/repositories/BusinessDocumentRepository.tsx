import { BusinessDocument } from "../entities/BusinessDocumentEntities";

export interface BusinessDocumentRepository {
    uploadBusinessDocuments(documents: BusinessDocument): Promise<any>;
}