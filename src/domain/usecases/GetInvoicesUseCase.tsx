import { Invoice } from "../entities/InvoiceEntities";
import { InvoiceRepository } from "../repositories/InvoiceRepository";

export class GetInvoicesUseCase {
    constructor(private readonly invoiceRepository: InvoiceRepository) {}

    async execute(userId: string): Promise<Invoice[]> {
        return this.invoiceRepository.getUserInvoices(userId);
    }
}
