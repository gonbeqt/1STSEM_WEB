import { BusinessDocument } from "../../domain/entities/BusinessDocumentEntities";
import { BusinessDocumentRepository } from "../../domain/repositories/BusinessDocumentRepository";
import apiService from '../api';

export class BusinessDocumentRepositoryImpl implements BusinessDocumentRepository {
    private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

    private getAuthHeader(): HeadersInit {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    
    async uploadBusinessDocuments(documents: BusinessDocument): Promise<any> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated. Please log in to upload documents.');
        }

        // Upload each document individually using the new compliance endpoint
        const uploadPromises = [];

        // Upload DTI Document
        if (documents.dti_document) {
            const dtiFormData = new FormData();
            dtiFormData.append('file', documents.dti_document);
            dtiFormData.append('document_type', 'business_registration');
            
            uploadPromises.push(apiService.postForm(`${this.API_URL}/documents/submit/`, dtiFormData));
        }

        // Upload Form 2303
        if (documents.form_2303) {
            const form2303Data = new FormData();
            form2303Data.append('file', documents.form_2303);
            form2303Data.append('document_type', 'tax_id');
            
            uploadPromises.push(apiService.postForm(`${this.API_URL}/documents/submit/`, form2303Data));
        }

        // Upload Manager ID
        if (documents.manager_id) {
            const managerIdData = new FormData();
            managerIdData.append('file', documents.manager_id);
            managerIdData.append('document_type', 'company_license');
            
            uploadPromises.push(apiService.postForm(`${this.API_URL}/documents/submit/`, managerIdData));
        }

        try {
            const results = await Promise.all(uploadPromises);
            return { success: true, message: 'All business documents uploaded successfully', results };
        } catch (error: any) {
            throw new Error(error?.message || 'Failed to upload business documents');
        }
    }


    async getUserDocuments(): Promise<any> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated. Please log in to view your documents.');
        }

        return await apiService.get(`${this.API_URL}/documents/my-documents/`);
    }

    async submitDocumentsForApproval(): Promise<any> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated. Please log in to submit documents for approval.');
        }

        return await apiService.post(`${this.API_URL}/documents/submit/`, {});
    }
}