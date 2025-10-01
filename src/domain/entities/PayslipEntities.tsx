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
}

export interface CreatePayslipResponse {
  success: boolean;
  payslip?: Payslip;
  message?: string;
  error?: string;
}