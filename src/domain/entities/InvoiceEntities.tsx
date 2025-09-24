export interface InvoiceItem {
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface Invoice {
    _id: string;
    userId: string;
    status: string;
    total_amount: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    invoice_id:string;
    invoice_number:string;
    client_name?: string;
    description?: string;
    client_email?: string;
    client_address?: string;
    tax_rate?: number;
    items?: InvoiceItem[];
    notes?: string;
}
