import { useState, useEffect, useCallback } from "react";
import { ListAuditsUseCase } from "./../../domain/usecases/ListAuditsUseCase";
import { GetAuditStatisticsUseCase } from "./../../domain/usecases/GetAuditStatisticsUseCase";
import { Audit, AuditStatistics } from "./../../domain/entities/ContractEntities";

export const useAuditsViewModel = () => {
    const [audits, setAudits] = useState<Audit[]>([]);
    const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const listAuditsUseCase = new ListAuditsUseCase();
    const getAuditStatisticsUseCase = new GetAuditStatisticsUseCase();

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
    }, []);

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
