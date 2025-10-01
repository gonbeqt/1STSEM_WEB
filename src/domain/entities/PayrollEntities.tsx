// src/domain/entities/PayrollEntities.tsx

export interface CreatePayrollEntryRequest {
  payroll_type: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  employees: PayrollEmployee[];
  notes?: string;
}

export interface PayrollEmployee {
  employee_id: string;
  employee_name: string;
  employee_email: string;
  department: string;
  position: string;
  salary_amount: number;
  salary_currency: string;
  overtime_pay?: number;
  bonus?: number;
  allowances?: number;
  tax_deduction?: number;
  insurance_deduction?: number;
  retirement_deduction?: number;
  other_deductions?: number;
}

export interface CreatePayrollEntryResponse {
  success: boolean;
  payroll_entry_id?: string;
  message?: string;
  error?: string;
}

export interface ProcessPayrollPaymentRequest {
  entry_id: string;
}

export interface ProcessPayrollPaymentResponse {
  success: boolean;
  transaction_id?: string;
  message?: string;
  error?: string;
}

export interface CreateRecurringPaymentRequest {
  payroll_type: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  start_date: string;
  end_date?: string;
  employees: PayrollEmployee[];
  notes?: string;
}

export interface CreateRecurringPaymentResponse {
  success: boolean;
  recurring_payment_id?: string;
  message?: string;
  error?: string;
}

export interface GetPaymentScheduleRequest {
  days?: number;
}

export interface PaymentScheduleItem {
  payment_id: string;
  payroll_type: string;
  pay_date: string;
  pay_period_start: string;
  pay_period_end: string;
  total_amount: number;
  currency: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  employee_count: number;
}

export interface GetPaymentScheduleResponse {
  success: boolean;
  schedule?: PaymentScheduleItem[];
  message?: string;
  error?: string;
}
