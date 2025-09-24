import { makeAutoObservable } from "mobx";
import { Invoice } from "../entities/InvoiceEntities";
import { GetInvoicesUseCase } from "../usecases/GetInvoicesUseCase";

export class InvoiceViewModel {
    invoices: Invoice[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor(private readonly getInvoicesUseCase: GetInvoicesUseCase) {
        makeAutoObservable(this);
    }

    async loadUserInvoices(userId: string, statusFilter?: string) {
        this.loading = true;
        this.error = null;
        try {
            this.invoices = await this.getInvoicesUseCase.execute(userId, statusFilter);
        } catch (error: any) {
            this.error = error.message || "Failed to fetch invoices";
        } finally {
            this.loading = false;
        }
    }
}
