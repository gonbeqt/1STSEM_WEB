export interface ContractFile {
    name: string;
    size: number;
    extension: string;
    linesOfCode: number;
    code: string;
}

export interface UploadContractResponse {
    success: boolean;
    message?: string;
    error?: string;
    fileInfo?: {
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
}

export interface AuditRequestData {
    contract_code: string;
    contract_name: string;
    contract_address?: string;
    upload_method?: string;
    filename?: string;
    file_size?: number;
}

export interface Vulnerability {
    title: string;
    description: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
    line_number?: number;
    code_snippet?: string;
    recommendation?: string;
    cwe_id?: string;
}

export interface Audit {
    audit_id: string;
    user_id: string;
    contract_address?: string;
    contract_name: string;
    source_code: string;
    status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
    risk_level?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    vulnerabilities_found?: number;
    audit_report?: string;
    ai_analysis?: string;
    gas_optimization?: string;
    recommendations?: string;
    completed_at?: string;
}

export interface AuditContractResponse {
    success: boolean;
    audit?: Audit;
    vulnerabilities?: Vulnerability[];
    message?: string;
    error?: string;
}

export interface AuditDetailsResponse {
    success: boolean;
    audit?: Audit;
    vulnerabilities?: Vulnerability[];
    error?: string;
}

export interface AuditStatistics {
    total_audits: number;
    completed_audits: number;
    completion_rate: number;
    risk_distribution: {
        LOW: number;
        MEDIUM: number;
        HIGH: number;
        CRITICAL: number;
    };
}

export interface AuditStatisticsResponse {
    success: boolean;
    statistics?: AuditStatistics;
    error?: string;
}
