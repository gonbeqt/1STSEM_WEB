import { UploadContractUseCase } from "../usecases/UploadContractUseCase";
import { AuditContractUseCase } from "../usecases/AuditContractUseCase";
import { ListAuditsUseCase } from "../usecases/ListAuditsUseCase";
import { GetAuditDetailsUseCase } from "../usecases/GetAuditDetailsUseCase";
import { GetAuditStatisticsUseCase } from "../usecases/GetAuditStatisticsUseCase";
import { AuditContractResponse, AuditRequestData, UploadContractResponse, Audit, AuditDetailsResponse, AuditStatisticsResponse } from "../entities/ContractEntities";

export class AuditContractViewModel {
    private uploadContractUseCase: UploadContractUseCase;
    private auditContractUseCase: AuditContractUseCase;
    private listAuditsUseCase: ListAuditsUseCase;
    private getAuditDetailsUseCase: GetAuditDetailsUseCase;
    private getAuditStatisticsUseCase: GetAuditStatisticsUseCase;

    constructor(
        uploadContractUseCase: UploadContractUseCase,
        auditContractUseCase: AuditContractUseCase,
        listAuditsUseCase: ListAuditsUseCase,
        getAuditDetailsUseCase: GetAuditDetailsUseCase,
        getAuditStatisticsUseCase: GetAuditStatisticsUseCase
    ) {
        this.uploadContractUseCase = uploadContractUseCase;
        this.auditContractUseCase = auditContractUseCase;
        this.listAuditsUseCase = listAuditsUseCase;
        this.getAuditDetailsUseCase = getAuditDetailsUseCase;
        this.getAuditStatisticsUseCase = getAuditStatisticsUseCase;
    }

    async uploadFile(file: File): Promise<UploadContractResponse> {
        const result = await this.uploadContractUseCase.execute(file);
        return result;
    }

    async auditContract(auditData: AuditRequestData): Promise<AuditContractResponse> {
        const result = await this.auditContractUseCase.execute(auditData);
        return result;
    }

    async listAudits(): Promise<Audit[]> {
        const result = await this.listAuditsUseCase.execute();
        return result;
    }

    async getAuditDetails(auditId: string): Promise<AuditDetailsResponse> {
        const result = await this.getAuditDetailsUseCase.execute(auditId);
        return result;
    }

    async getAuditStatistics(): Promise<AuditStatisticsResponse> {
        const result = await this.getAuditStatisticsUseCase.execute();
        return result;
    }
}
