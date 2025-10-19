import { ApiService } from '../api/ApiService';
import { BusinessDocument } from '../../domain/entities/BusinessDocumentEntities';

export class BusinessDocumentRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async uploadBusinessDocuments(documents: BusinessDocument): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated. Please log in to upload documents.');
    }

    const uploadPromises: Promise<any>[] = [];

    if (documents.dti_document) {
      const dtiFormData = new FormData();
      dtiFormData.append('file', documents.dti_document);
      dtiFormData.append('document_type', 'business_registration');
      uploadPromises.push(this.api.postForm(`${this.apiUrl}/documents/submit/`, dtiFormData));
    }

    if (documents.form_2303) {
      const form2303Data = new FormData();
      form2303Data.append('file', documents.form_2303);
      form2303Data.append('document_type', 'tax_id');
      uploadPromises.push(this.api.postForm(`${this.apiUrl}/documents/submit/`, form2303Data));
    }

    if (documents.manager_id) {
      const managerIdData = new FormData();
      managerIdData.append('file', documents.manager_id);
      managerIdData.append('document_type', 'company_license');
      uploadPromises.push(this.api.postForm(`${this.apiUrl}/documents/submit/`, managerIdData));
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

    return await this.api.get(`${this.apiUrl}/documents/my-documents/`);
  }

  async submitDocumentsForApproval(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated. Please log in to submit documents for approval.');
    }

    return await this.api.post(`${this.apiUrl}/documents/submit/`, {});
  }
}
