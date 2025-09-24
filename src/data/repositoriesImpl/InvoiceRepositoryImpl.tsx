import { Invoice } from "../../domain/entities/InvoiceEntities";
import { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { ApiService } from "../api/ApiService"; // Corrected import path

export class InvoiceRepositoryImpl implements InvoiceRepository {
    constructor(private readonly apiService: ApiService) {}

    async getUserInvoices(userId: string, statusFilter?: string): Promise<Invoice[]> {
        try {
            const response = await this.apiService.get<{ success: boolean; invoices: Invoice[] }>(
                `/invoices/list/?userId=${userId}${statusFilter ? `&status=${statusFilter}` : ''}`
            );
            return response.invoices;
        } catch (error) {
            console.error("Error fetching user invoices:", error);
            throw error;
        }
    }
}
