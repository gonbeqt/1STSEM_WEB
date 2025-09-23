import { useEffect, useState } from 'react';
import { Payslip } from '../../domain/entities/PayslipEntities';
import { container } from '../../di/container';

export const usePayslips = (employee_id?: string) => {
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayslips = async () => {
            try {
                setLoading(true);
                const fetchedPayslips = await container.getUserPayslipsUseCase.execute(employee_id);
                setPayslips(fetchedPayslips);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPayslips();
    }, [employee_id]);

    return { payslips, loading, error };
};
