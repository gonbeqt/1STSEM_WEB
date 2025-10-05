import { useState, useEffect, useCallback } from 'react';
import { container } from '../../di/container';
import { EmployeeHistoryViewModel } from '../../domain/viewmodel/EmployeeHistoryViewModel';
import { EmployeeHistory, EmployeeHistoryDetails } from '../../domain/entities/EmployeeHistoryEntities';

const useEmployeeHistory = (token: string | null) => {
    const [viewModel, setViewModel] = useState<EmployeeHistoryViewModel | null>(null);
    const [history, setHistory] = useState<EmployeeHistory | null>(null);
    const [details, setDetails] = useState<EmployeeHistoryDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const employeeHistoryViewModel = container.employeeHistoryViewModel();
        setViewModel(employeeHistoryViewModel);
    }, []);

    const getHistory = useCallback(async () => {
        if (!viewModel || !token) return;
        setLoading(true);
        try {
            const response = await viewModel.getEmployeeHistory();
            setHistory(response || null);
        } catch (e: any) {
            setError(e.message || 'Failed to fetch employee history');
        }
        setLoading(false);
    }, [viewModel, token]);

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    const getDetails = async (entryId: string) => {
        if (!viewModel || !token) return;
        setLoading(true);
        try {
            const response = await viewModel.getEmployeeHistoryDetails(entryId);
            setDetails(response || null);
        } catch (e: any) {
            setError(e.message || `Failed to fetch details for entry ${entryId}`);
        }
        setLoading(false);
    };

    return { history, details, loading, error, getHistory, getDetails };
};

export default useEmployeeHistory;
