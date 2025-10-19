import { Invoice } from "../../domain/entities/InvoiceEntities";
import { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { InvoiceRemoteDataSource } from '../datasources/InvoiceRemoteDataSource';

export class InvoiceRepositoryImpl implements InvoiceRepository {
    constructor(private readonly remote: InvoiceRemoteDataSource) {}

    async getUserInvoices(userId: string): Promise<Invoice[]> {
        return this.remote.getUserInvoices(userId);
    }
}
