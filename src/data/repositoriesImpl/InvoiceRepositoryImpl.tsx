import { Invoice } from "../../domain/entities/InvoiceEntities";
import { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";

export class InvoiceRepositoryImpl implements InvoiceRepository {
    constructor() {}
    private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

    async getUserInvoices(userId: string): Promise<Invoice[]> {
        try {
            const url = `${this.API_URL}/invoices/list`;
            const token = localStorage.getItem('token'); 
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Assuming JSON content type
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.invoices;
        } catch (error) {
            console.error("Error fetching user invoices:", error);
            throw error;
        }
    }
}
