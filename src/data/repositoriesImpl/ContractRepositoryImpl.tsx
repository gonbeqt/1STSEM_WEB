import { ContractRepository } from '../../domain/repositories/ContractRepository';
import { Audit, AuditContractResponse, AuditDetailsResponse, AuditRequestData, AuditStatisticsResponse, UploadContractResponse } from '../../domain/entities/ContractEntities';
import apiService from '../api';
const API_URL = process.env.REACT_APP_API_BASE_URL;

export class ContractRepositoryImpl implements ContractRepository {
    async uploadContract(file: File): Promise<UploadContractResponse> {
        const formData = new FormData();
        formData.append('contract_file', file);

        try {
            const response = await apiService.postForm<UploadContractResponse>(`${API_URL}/ai/upload-contract/`, formData);
            return response;
        } catch (error: any) {
            console.error('Upload contract error:', error);
            
            if (error.response?.status === 404) {
                // Fallback: Return mock data for development
                return {
                    success: true,
                    message: "Contract file uploaded and validated successfully (Mock Response)",
                    fileInfo: {
                        filename: file.name,
                        size: file.size,
                        extension: '.' + file.name.split('.').pop()?.toLowerCase(),
                        lines_of_code: Math.floor(Math.random() * 100) + 50
                    },
                    contract_data: {
                        contract_code: `// Mock contract code for ${file.name}\npragma solidity ^0.8.0;\n\ncontract MockContract {\n    // Contract implementation\n}`,
                        suggested_name: file.name.split('.')[0],
                        upload_method: "file",
                        filename: file.name,
                        file_size: file.size
                    }
                };
            }
            
            // Handle other errors
            if (error.response?.data?.error) {
                return { success: false, error: error.response.data.error };
            }
            
            return { 
                success: false, 
                error: error.message || 'Failed to upload contract file' 
            };
        }
    }

    async auditContract(auditData: AuditRequestData): Promise<AuditContractResponse> {
        
        try {
            const response = await apiService.post<AuditContractResponse>(`${API_URL}/admin/audit-contract/`, auditData);
            return response;
        } catch (error: any) {
            console.error('Audit contract error:', error);
            
            if (error.response?.status === 404) {
                // Fallback: Return mock audit data for development
                return {
                    success: true,
                    audit: {
                        audit_id: `audit_${Date.now()}`,
                        user_id: 'current-user',
                        contract_name: auditData.contract_name,
                        source_code: auditData.contract_code,
                        status: "COMPLETED" as const,
                        risk_level: "MEDIUM" as const,
                        vulnerabilities_found: 3,
                        completed_at: new Date().toISOString(),
                        ai_analysis: "This is a mock AI analysis of the smart contract. The contract appears to have moderate security risks that should be addressed.",
                        gas_optimization: "Mock gas optimization suggestions: Consider using uint256 instead of uint8 for better gas efficiency.",
                        recommendations: "Mock recommendations:\n1. Add input validation\n2. Implement access controls\n3. Use SafeMath for arithmetic operations"
                    },
                    vulnerabilities: [
                        {
                            title: "Reentrancy Vulnerability",
                            description: "Mock vulnerability description",
                            severity: "HIGH"
                        },
                        {
                            title: "Integer Overflow",
                            description: "Mock vulnerability description",
                            severity: "MEDIUM"
                        },
                        {
                            title: "Unchecked External Call",
                            description: "Mock vulnerability description",
                            severity: "LOW"
                        }
                    ]
                };
            }
            
            // Handle other errors
            if (error.response?.data?.error) {
                return { success: false, error: error.response.data.error };
            }
            
            return { 
                success: false, 
                error: error.message || 'Failed to audit contract' 
            };
        }
    }

    async listAudits(): Promise<Audit[]> {
        
        try {
            const response = await apiService.get<{success: boolean, audits: Audit[]}>(`${API_URL}/admin/audits/list/`);
            return response.audits || [];
        } catch (error: any) {
            console.error('List audits error:', error);
            
            if (error.response?.status === 404) {
                // Fallback: Return mock audit list for development
                return [
                    {
                        audit_id: `audit_${Date.now()}`,
                        user_id: 'current-user',
                        contract_name: 'MockContract1',
                        source_code: 'pragma solidity ^0.8.0;\n\ncontract MockContract1 {\n    // Mock contract implementation\n}',
                        status: 'COMPLETED' as const,
                        risk_level: 'MEDIUM' as const,
                        vulnerabilities_found: 2,
                        completed_at: new Date().toISOString()
                    }
                ];
            }
            
            return [];
        }
    }

    async getAuditDetails(auditId: string): Promise<AuditDetailsResponse> {
        
        try {
            const response = await apiService.get<AuditDetailsResponse>(`${API_URL}/admin/audits/details/?audit_id=${auditId}`);
            return response;
        } catch (error: any) {
            console.error('Get audit details error:', error);
            
            if (error.response?.status === 404) {
                // Fallback: Return mock audit details for development
                return {
                    success: true,
                    audit: {
                        audit_id: auditId,
                        user_id: 'current-user',
                        contract_name: 'MockContract',
                        source_code: 'pragma solidity ^0.8.0;\n\ncontract MockContract {\n    // Mock contract implementation\n}',
                        status: 'COMPLETED' as const,
                        risk_level: 'MEDIUM' as const,
                        vulnerabilities_found: 2,
                        completed_at: new Date().toISOString()
                    },
                    vulnerabilities: [
                        {
                            title: 'Mock Vulnerability 1',
                            description: 'Mock description',
                            severity: 'HIGH'
                        }
                    ]
                };
            }
            
            return { success: false, error: 'Failed to fetch audit details' };
        }
    }

    async getAuditStatistics(): Promise<AuditStatisticsResponse> {
        
        try {
            const response = await apiService.get<AuditStatisticsResponse>(`${API_URL}/admin/audits/statistics/`);
            return response;
        } catch (error: any) {
            console.error('Get audit statistics error:', error);
            
            if (error.response?.status === 404) {
                // Fallback: Return mock statistics for development
                return {
                    success: true,
                    statistics: {
                        total_audits: 5,
                        completed_audits: 4,
                        completion_rate: 80,
                        risk_distribution: {
                            LOW: 1,
                            MEDIUM: 2,
                            HIGH: 1,
                            CRITICAL: 0
                        }
                    }
                };
            }
            
            return { success: false, error: 'Failed to fetch audit statistics' };
        }
    }
}

