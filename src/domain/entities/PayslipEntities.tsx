export interface Payslip {
    id: string;
    employee_id: string;
    pay_period_start: string;
    pay_period_end: string;
    gross_salary: number;
    deductions: number;
    net_salary: number;
    status: 'paid' | 'pending' | 'failed';
    created_at: string;
}

export interface GetUserPayslipsRequest {
    employee_id?: string;
    status?: string;
}
