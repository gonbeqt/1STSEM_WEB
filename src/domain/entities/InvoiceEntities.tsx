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
    created_at: string;
    updated_at: string;
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
