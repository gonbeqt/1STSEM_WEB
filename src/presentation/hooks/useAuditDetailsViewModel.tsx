import { useState, useEffect, useCallback } from "react";
import { GetAuditDetailsUseCase } from "./../../domain/usecases/GetAuditDetailsUseCase";
import { Audit, Vulnerability } from "./../../domain/entities/ContractEntities";

export const useAuditDetailsViewModel = (auditId: string) => {
    const [audit, setAudit] = useState<Audit | null>(null);
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const getAuditDetailsUseCase = new GetAuditDetailsUseCase();

    const fetchAuditDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await getAuditDetailsUseCase.execute(auditId);
        if (result.success && result.audit) {
            setAudit(result.audit);
            setVulnerabilities(result.vulnerabilities || []);
        } else {
            setError(result.error || "Failed to fetch audit details.");
        }
        setIsLoading(false);
    }, [auditId]);

    useEffect(() => {
        if(auditId) {
            fetchAuditDetails();
        }
    }, [fetchAuditDetails, auditId]);

    return {
        audit,
        vulnerabilities,
        isLoading,
        error,
    };
};
