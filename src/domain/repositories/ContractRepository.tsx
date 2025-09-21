import { Audit, AuditContractResponse, AuditDetailsResponse, AuditRequestData, AuditStatisticsResponse, UploadContractResponse } from "../entities/ContractEntities";

export interface ContractRepository {
    uploadContract(file: File): Promise<UploadContractResponse>;
    auditContract(auditData: AuditRequestData): Promise<AuditContractResponse>;
    listAudits(): Promise<Audit[]>;
    getAuditDetails(auditId: string): Promise<AuditDetailsResponse>;
    getAuditStatistics(): Promise<AuditStatisticsResponse>;
}
