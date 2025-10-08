export interface CreatePayslipRequest {
  employee_name: string;
  employee_id: string;
  employee_email?: string;
  employee_wallet?: string;
  department?: string;
  position?: string;
  salary_amount: number;
  salary_currency?: string;
  cryptocurrency?: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date?: string;
  tax_deduction?: number;
  insurance_deduction?: number;
  retirement_deduction?: number;
  other_deductions?: number;
  overtime_pay?: number;
  bonus?: number;
  allowances?: number;
  notes?: string;
}

export interface Payslip {
  payslip_id: string;
  payslip_number: string;
  user_id: string;
  employee_id: string;
  employee_name: string;
  employee_email?: string;
  employee_wallet?: string;
  department: string;
  position: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  base_salary: number;
  salary_currency: string;
  overtime_pay: number;
  bonus: number;
  allowances: number;
  total_earnings: number;
  tax_deduction: number;
  insurance_deduction: number;
  retirement_deduction: number;
  other_deductions: number;
  total_deductions: number;
  final_net_pay: number;
  cryptocurrency: string;
  crypto_amount: number;
  usd_equivalent: number;
  status: string;
  notes: string;
  created_at: string;
  issued_at: string;
  payment_processed: boolean;
  pdf_generated: boolean;
  gross_amount?: number;
  net_amount?: number;
  tax_breakdown?: Record<string, number>;
  tax_deductions?: Record<string, number>;
  total_tax_deducted?: number;
  tax_rates_applied?: Record<string, number>;
  tax_config_source?: string;
  pdf_generated_at?: string;
  sent_at?: string;
}

export interface CreatePayslipResponse {
  success: boolean;
  payslip?: Payslip;
  message?: string;
  error?: string;
}