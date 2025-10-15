import { Invoice } from "../../domain/entities/InvoiceEntities";
import { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import apiService from '../api';

export class InvoiceRepositoryImpl implements InvoiceRepository {
    private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

    async getUserInvoices(userId: string): Promise<Invoice[]> {
        try {
            const url = `${this.API_URL}/invoices/list`;
            const data = await apiService.get<{ invoices: Invoice[] }>(url);
            return data.invoices || [];
        } catch (error) {
            console.error("Error fetching user invoices:", error);
            throw error;
        }
    }
}
