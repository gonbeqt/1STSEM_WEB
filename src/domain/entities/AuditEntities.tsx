
export interface UploadContractFileRequest {
  contract_file: File;
  contract_name?: string;
}

export interface UploadContractFileResponse {
  success: boolean;
  message?: string;
  file_info?: {
    filename: string;
    size: number;
    extension: string;
    lines_of_code: number;
  };
  contract_data?: {
    contract_code: string;
    suggested_name: string;
    upload_method: string;
    filename: string;
    file_size: number;
  };
  error?: string;
}

export interface AuditSmartContractRequest {
  contract_code: string;
  contract_address?: string;
  contract_name: string;
  upload_method: 'file' | 'text';
  filename?: string;
  file_size?: number;
}

export interface AuditSmartContractResponse {
  success: boolean;
  audit?: {
    audit_id: string;
    contract_name: string;
    status: string;
    risk_level: string;
    vulnerabilities_found: number;
    completed_at: string;
    ai_analysis: string;
    gas_optimization: string;
    recommendations: string;
  };
  vulnerabilities?: Array<{
    title: string;
    severity: string;
    description: string;
  }>;
  message?: string;
  error?: string;
}

export interface GetUserAuditsRequest {
}

export interface UserAudit {
  audit_id: string;
  contract_name: string;
  status: string;
  risk_level: string;
  vulnerabilities_found: number;
  created_at: string;
  completed_at?: string;
}

export interface GetUserAuditsResponse {
  success: boolean;
  audits?: UserAudit[];
  message?: string;
  error?: string;
}

export interface GetAuditDetailsRequest {
  audit_id: string;
}

export interface GetAuditDetailsResponse {
  success: boolean;
  audit?: {
    audit_id: string;
    contract_name: string;
    contract_code: string;
    status: string;
    risk_level: string;
    vulnerabilities_found: number;
    created_at: string;
    completed_at?: string;
    ai_analysis?: string;
    gas_optimization?: string;
    recommendations?: string;
  };
  vulnerabilities?: Array<{
    title: string;
    severity: string;
    description: string;
  }>;
  message?: string;
  error?: string;
}

export interface GetAuditStatisticsRequest {
}

export interface AuditStatistics {
  total_audits: number;
  completed_audits: number;
  pending_audits: number;
  failed_audits: number;
  critical_vulnerabilities: number;
  high_vulnerabilities: number;
  medium_vulnerabilities: number;
  low_vulnerabilities: number;
  average_risk_score: number;
}

export interface GetAuditStatisticsResponse {
  success: boolean;
  statistics?: AuditStatistics;
  message?: string;
  error?: string;
}
