import { useEffect, useState } from 'react';
import { Payslip } from '../../domain/entities/PayslipEntities';
import { container } from '../../di/container';
import { GetUserPayslipsParams } from '../../domain/usecases/GetUserPayslipsUseCase';

interface UsePayslipsConfig {
    refreshTrigger?: number;
    enabled?: boolean;
}

export const usePayslips = (
    params: GetUserPayslipsParams = {},
    config: UsePayslipsConfig = {}
) => {
    const { refreshTrigger, enabled = true } = config;
    const { userId, employeeId, status, isManager, email } = params;

    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [loading, setLoading] = useState<boolean>(enabled);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        const fetchPayslips = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedPayslips = await container.getUserPayslipsUseCase.execute({
                    userId,
                    employeeId,
                    status,
                    isManager,
                    email,
                });
                setPayslips(fetchedPayslips);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPayslips();
    }, [enabled, userId, employeeId, status, isManager, email, refreshTrigger]);

    const refreshPayslips = async () => {
        if (!enabled) return;

        try {
            setLoading(true);
            setError(null);
            const fetchedPayslips = await container.getUserPayslipsUseCase.execute({
                userId,
                employeeId,
                status,
                isManager,
                email,
            });
            setPayslips(fetchedPayslips);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { payslips, loading, error, refreshPayslips };
};
