import { BusinessDocument } from "../../domain/entities/BusinessDocumentEntities";
import { BusinessDocumentRepository } from "../../domain/repositories/BusinessDocumentRepository";

export class BusinessDocumentRepositoryImpl implements BusinessDocumentRepository {
    
    async uploadBusinessDocuments(documents: BusinessDocument): Promise<any> {
        const formData = new FormData();
        formData.append('business_name', documents.business_name);
        formData.append('business_type', documents.business_type);
        formData.append('business_registration_number', documents.business_registration_number);
        if (documents.business_address) {
            formData.append('business_address', documents.business_address);
        }
        if (documents.business_phone) {
            formData.append('business_phone', documents.business_phone);
        }
        if (documents.business_email) {
            formData.append('business_email', documents.business_email);
        }
        formData.append('dti_document', documents.dti_document);
        formData.append('form_2303', documents.form_2303);
        formData.append('manager_id', documents.manager_id);

        const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await fetch(`${API_URL}/wallets/upload_business_documents/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to upload business documents');
        }

        return responseData;
    }
}