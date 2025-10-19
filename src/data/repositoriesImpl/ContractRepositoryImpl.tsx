import { ContractRepository } from '../../domain/repositories/ContractRepository';
import { Audit, AuditContractResponse, AuditDetailsResponse, AuditRequestData, AuditStatisticsResponse, UploadContractResponse } from '../../domain/entities/ContractEntities';
import { ContractRemoteDataSource } from '../datasources/ContractRemoteDataSource';

export class ContractRepositoryImpl implements ContractRepository {
    constructor(private readonly remote: ContractRemoteDataSource) {}

    async uploadContract(file: File): Promise<UploadContractResponse> {
        return this.remote.uploadContract(file);
    }

    async auditContract(auditData: AuditRequestData): Promise<AuditContractResponse> {
        return this.remote.auditContract(auditData);
    }

    async listAudits(): Promise<Audit[]> {
        return this.remote.listAudits();
    }

    async getAuditDetails(auditId: string): Promise<AuditDetailsResponse> {
        return this.remote.getAuditDetails(auditId);
    }

    async getAuditStatistics(): Promise<AuditStatisticsResponse> {
        return this.remote.getAuditStatistics();
    }
}

