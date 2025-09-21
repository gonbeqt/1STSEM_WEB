import { ContractRepository } from '../../domain/repositories/ContractRepository';
import { Audit, AuditContractResponse, AuditDetailsResponse, AuditRequestData, AuditStatisticsResponse, UploadContractResponse } from '../../domain/entities/ContractEntities';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_BASE_URL;

export class ContractRepositoryImpl implements ContractRepository {
    async uploadContract(file: File): Promise<UploadContractResponse> {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('contract_file', file);

        const response = await axios.post<UploadContractResponse>(`${API_URL}/ai/upload-contract/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }

    async auditContract(auditData: AuditRequestData): Promise<AuditContractResponse> {
        const token = localStorage.getItem('token');
        const response = await axios.post<AuditContractResponse>(`${API_URL}/ai/audit-contract/`, auditData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }

    async listAudits(): Promise<Audit[]> {
        const token = localStorage.getItem('token');
        const response = await axios.get<Audit[]>(`${API_URL}/ai/audits/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }

    async getAuditDetails(auditId: string): Promise<AuditDetailsResponse> {
        const token = localStorage.getItem('token');
        const response = await axios.get<AuditDetailsResponse>(`${API_URL}/ai/audits/details/?audit_id=${auditId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }

    async getAuditStatistics(): Promise<AuditStatisticsResponse> {
        const token = localStorage.getItem('token');
        const response = await axios.get<AuditStatisticsResponse>(`${API_URL}/ai/audits/statistics/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }
}

