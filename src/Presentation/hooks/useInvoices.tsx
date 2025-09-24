import { useEffect, useState } from 'react';
import { container } from '../../di/container';
import { InvoiceViewModel } from '../../domain/viewmodel/InvoiceViewModel';
import { Invoice } from '../../domain/entities/InvoiceEntities';

export const useInvoices = (userId: string) => {
    const [invoiceViewModel] = useState<InvoiceViewModel>(() => container.invoiceViewModel());
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInvoices = async () => {
            setLoading(true);
            setError(null);
            try {
                await invoiceViewModel.loadUserInvoices(userId);
                setInvoices(invoiceViewModel.invoices);
            } catch (err: any) {
                setError(err.message || "Failed to load invoices");
            } finally {
                setLoading(false);
            }
        };

        loadInvoices();

        // Observe changes in the ViewModel
        const disposer = () => {
            setInvoices(invoiceViewModel.invoices);
            setLoading(invoiceViewModel.loading);
            setError(invoiceViewModel.error);
        };
        // This is a simplified observation. In a real MobX setup, you\'d use autorun or reaction.
        // For now, we rely on the useEffect re-running if dependencies change.
        return disposer;
    }, [userId, invoiceViewModel]);

    return { invoices, loading, error, reloadInvoices: () => invoiceViewModel.loadUserInvoices(userId) };
};
