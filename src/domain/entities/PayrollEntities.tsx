
export interface CreatePayrollEntryRequest {
  payroll_type: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date?: string;
  start_date?: string;
  payment_date?: string;
  employees: PayrollEmployee[];
  notes?: string;
}

export interface CreateSinglePayrollEntryRequest {
  employee_id: string; // Backend expects employee_id as the primary identifier
  employee_user_id?: string; // Employee's user_id for backend processing
  payroll_type?: string;
  pay_period_start?: string;
  pay_period_end?: string;
  pay_date?: string;
  start_date?: string;
  payment_date?: string;
  employee_name?: string;
  employee_wallet?: string;
  salary_amount: number;
  salary_currency?: string;
  payment_frequency?: string;
  amount?: number;
  cryptocurrency?: string;
  notes?: string;
}

export interface PayrollEmployee {
  employee_id: string;
  user_id: string; // Employee's user_id for backend processing
  employee_name: string;
  employee_email: string;
  employee_wallet?: string;
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

export interface PayrollEntryData {
  _id: string;
  entry_id: string;
  user_id: string;
  employee_name: string;
  employee_wallet: string;
  salary_amount: number;
  salary_currency: string;
  payment_frequency: string;
  amount: number;
  cryptocurrency: string;
  usd_equivalent: number;
  payment_date: string;
  start_date: string;
  is_active: boolean;
  status: string;
  notes: string;
  created_at: string;
  processed_at?: string;
  transaction_hash?: string;
  gas_fee?: number;
}

export interface CreatePayrollEntryResponse extends PayrollEntryData {
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

export interface GetEmployeePayrollDetailsRequest {
  employee_id: string;
}

export interface EmployeePayrollDetails {
  employee_id: string;
  employee_name: string;
  employee_email: string;
  department: string;
  position: string;
  total_payslips: number;
  total_earnings: number;
  total_deductions: number;
  net_pay: number;
  currency: string;
  last_payment_date?: string;
  next_payment_date?: string;
  payroll_entries: PayrollEntry[];
  recent_payslips: PayslipSummary[];
}

export interface PayrollEntry {
  _id: string;
  entry_id: string;
  user_id: string;
  employee_name?: string;
  employee_wallet?: string;
  salary_amount: number;
  salary_currency: string;
  payment_frequency: string;
  amount: number;
  cryptocurrency: string;
  usd_equivalent: number;
  payment_date: string;
  start_date: string;
  is_active: boolean;
  status: string;
  notes?: string;
  created_at: string;
  processed_at?: string;
  transaction_hash?: string;
  gas_fee?: number;
  payroll_type?: string;
  period?: string;
  pay_period_start?: string;
  pay_period_end?: string;
  gross_pay?: number;
  net_pay?: number;
}

export interface PayslipSummary {
  payslip_id: string;
  payslip_number: string;
  period: string; // Combined pay period display
  pay_period_start: string;
  pay_period_end: string;
  amount: number; // Main amount to display
  total_earnings: number;
  total_deductions: number;
  net_pay: number;
  status: string;
  date: string; // Display date
  created_at: string;
}

export interface GetEmployeePayrollDetailsResponse {
  success: boolean;
  employee_payroll?: EmployeePayrollDetails;
  employee_details?: {
    employee_id: string;
    username: string;
    email: string;
    full_name: string;
  };
  payroll_entries?: PayrollEntry[];
  payslips?: PayslipSummary[];
  message?: string;
  error?: string;
}
