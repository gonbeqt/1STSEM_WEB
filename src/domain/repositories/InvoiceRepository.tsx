import { Invoice } from "../entities/InvoiceEntities";

export interface InvoiceRepository {
    getUserInvoices(userId: string, statusFilter?: string): Promise<Invoice[]>;
}
