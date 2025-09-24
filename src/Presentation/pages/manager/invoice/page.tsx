import React, { useEffect } from 'react';
import { useInvoices } from '../../../hooks/useInvoices';
import { Invoice } from '../../../../domain/entities/InvoiceEntities';

const ManagerInvoicePage: React.FC = () => {
    // Replace with actual user ID from authentication context
    const dummyUserId = "manager123"; 
    const { invoices, loading, error, reloadInvoices } = useInvoices(dummyUserId);

    useEffect(() => {
        // You might want to reload invoices when the component mounts or on certain events
        reloadInvoices();
    }, [reloadInvoices]);

    if (loading) {
        return <div>Loading invoices...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="manager-invoice-page">
            <h1>Manager Invoices</h1>
            {invoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <div className="invoice-list">
                    {invoices.map((invoice: Invoice) => (
                        <div key={invoice.id} className="invoice-card">
                            <h2>Invoice ID: {invoice.id}</h2>
                            <p>User ID: {invoice.userId}</p>
                            <p>Status: {invoice.status}</p>
                            <p>Amount: {invoice.amount} {invoice.currency}</p>
                            <p>Created At: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManagerInvoicePage;
