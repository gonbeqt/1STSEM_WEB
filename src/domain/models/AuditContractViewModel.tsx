import { useState } from "react";
import { UploadContractUseCase } from "../usecases/UploadContractUseCase";
import { AuditContractUseCase } from "../usecases/AuditContractUseCase";
import { AuditContractResponse, AuditRequestData, UploadContractResponse } from "../entities/ContractEntities";

export const useAuditContractViewModel = () => {
    const [uploadResponse, setUploadResponse] = useState<UploadContractResponse | null>(null);
    const [auditResponse, setAuditResponse] = useState<AuditContractResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const uploadContractUseCase = new UploadContractUseCase();
    const auditContractUseCase = new AuditContractUseCase();

    const uploadFile = async (file: File): Promise<UploadContractResponse> => {
        setIsLoading(true);
        const result = await uploadContractUseCase.execute(file);
        setUploadResponse(result);
        setIsLoading(false);
        return result;
    };

    const auditContract = async (auditData: AuditRequestData): Promise<AuditContractResponse> => {
        setIsLoading(true);
        const result = await auditContractUseCase.execute(auditData);
        setAuditResponse(result);
        setIsLoading(false);
        return result;
    }

    return {
        uploadResponse,
        auditResponse,
        isLoading,
        uploadFile,
        auditContract,
        setUploadResponse,
        setAuditResponse
    };
};
