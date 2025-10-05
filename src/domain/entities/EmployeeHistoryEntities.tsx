export interface PayrollEntry {
    _id: string;
    entry_id: string;
    user_id: string;
    company_id: string;
    amount: number;
    cryptocurrency: string;
    usd_equivalent: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'SCHEDULED';
    payment_method: string;
    transaction_hash?: string;
    gas_fee?: number;
    processed_at?: string; 
    created_at: string;
    notes?: string;
}

export interface Payslip {
    _id: string;
    payslip_id: string;
    employee_id: string;
    payment_entry_id: string;
    generated_at: string;
    file_url: string; 
}

export interface PayrollStatistics {
    total_entries: number;
    completed_payments: number;
    scheduled_payments: number;
    failed_payments: number;
    total_paid_usd: number;
    total_pending_usd: number;
    crypto_breakdown: Record<string, number>;
}

export interface EmployeeHistory {
    success: boolean;
    payroll_statistics: PayrollStatistics;
    payroll_entries: PayrollEntry[];
    payslips: Payslip[];
}

export interface TransactionDetails {
    hash?: string;
    gas_fee?: number;
    status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'SCHEDULED';
}

export interface EmployeeInfo {
    employee_id: string;
    username: string;
    email: string;
    full_name: string;
}

export interface EmployeeHistoryDetails {
    success: boolean;
    payroll_entry: PayrollEntry;
    payslip?: Payslip;
    transaction_details?: TransactionDetails;
    employee_info: EmployeeInfo;
}
