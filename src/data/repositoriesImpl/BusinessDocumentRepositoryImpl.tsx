import { BusinessDocument } from "../../domain/entities/BusinessDocumentEntities";
import { BusinessDocumentRepository } from "../../domain/repositories/BusinessDocumentRepository";

export class BusinessDocumentRepositoryImpl implements BusinessDocumentRepository {
    
    async uploadBusinessDocuments(documents: BusinessDocument): Promise<any> {
        const token = localStorage.getItem('token');
        const API_URL = process.env.REACT_APP_API_BASE_URL;

        // Upload each document individually using the new compliance endpoint
        const uploadPromises = [];

        // Upload DTI Document
        if (documents.dti_document) {
            const dtiFormData = new FormData();
            dtiFormData.append('file', documents.dti_document);
            dtiFormData.append('document_type', 'business_registration');
            
            uploadPromises.push(
                fetch(`${API_URL}/documents/submit/`, {
                    method: 'POST',
                    body: dtiFormData,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            );
        }

        // Upload Form 2303
        if (documents.form_2303) {
            const form2303Data = new FormData();
            form2303Data.append('file', documents.form_2303);
            form2303Data.append('document_type', 'tax_id');
            
            uploadPromises.push(
                fetch(`${API_URL}/documents/submit/`, {
                    method: 'POST',
                    body: form2303Data,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            );
        }

        // Upload Manager ID
        if (documents.manager_id) {
            const managerIdData = new FormData();
            managerIdData.append('file', documents.manager_id);
            managerIdData.append('document_type', 'company_license');
            
            uploadPromises.push(
                fetch(`${API_URL}/documents/submit/`, {
                    method: 'POST',
                    body: managerIdData,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            );
        }

        try {
            const responses = await Promise.all(uploadPromises);
            const results = await Promise.all(responses.map(response => response.json()));

            // Check if all uploads were successful
            const failedUploads = responses.filter(response => !response.ok);
            if (failedUploads.length > 0) {
                throw new Error('Some documents failed to upload');
            }

            return {
                success: true,
                message: 'All business documents uploaded successfully',
                results: results
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to upload business documents');
        }
    }


    async getUserDocuments(): Promise<any> {
        const token = localStorage.getItem('token');
        const API_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await fetch(`${API_URL}/documents/my-documents/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to get user documents');
        }

        return responseData;
    }

    async submitDocumentsForApproval(): Promise<any> {
        const token = localStorage.getItem('token');
        const API_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await fetch(`${API_URL}/documents/submit/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to submit documents for approval');
        }

        return responseData;
    }
}