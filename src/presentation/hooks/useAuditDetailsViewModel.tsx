import { useState, useEffect, useCallback } from "react";
import { Audit, Vulnerability } from "../../domain/entities/ContractEntities";
import { container } from "../../di/container";

export const useAuditDetailsViewModel = (auditId: string) => {
    const [audit, setAudit] = useState<Audit | null>(null);
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const getAuditDetailsUseCase = container.getAuditDetailsUseCase;

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
    }, [auditId, getAuditDetailsUseCase]);

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
