import { useState, useEffect, useCallback } from "react";
import { Audit, AuditStatistics } from "../../domain/entities/ContractEntities";
import { container } from "../../di/container";

export const useAuditsViewModel = () => {
    const [audits, setAudits] = useState<Audit[]>([]);
    const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const listAuditsUseCase = container.listAuditsUseCase;
    const getAuditStatisticsUseCase = container.getAuditStatisticsUseCase;

    const fetchAudits = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const auditsResult = await listAuditsUseCase.execute();
            setAudits(auditsResult);
            const statsResult = await getAuditStatisticsUseCase.execute();
            if(statsResult.success) {
                setStatistics(statsResult.statistics || null);
            }
        } catch (e: any) {
            setError("Failed to fetch audit data.");
        }
        setIsLoading(false);
    }, [getAuditStatisticsUseCase, listAuditsUseCase]);

    useEffect(() => {
        fetchAudits();
    }, [fetchAudits]);

    return {
        audits,
        statistics,
        isLoading,
        error,
        fetchAudits
    };
};
