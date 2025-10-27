import { PayslipRepository } from '../repositories/PayslipRepository';
import { CreatePayslipRequest, CreatePayslipResponse } from '../entities/PayslipEntities';

export class CreatePayslipUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: CreatePayslipRequest): Promise<CreatePayslipResponse> {
    if (!request.employee_name || !request.employee_name.trim()) {
      return {
        success: false,
        error: 'Employee name is required'
      };
    }

    if (!request.employee_id || !request.employee_id.trim()) {
      return {
        success: false,
        error: 'Employee ID is required'
      };
    }

    if (!request.salary_amount || request.salary_amount <= 0) {
      return {
        success: false,
        error: 'Salary amount must be greater than 0'
      };
    }

    if (!request.pay_period_start || !request.pay_period_start.trim()) {
      return {
        success: false,
        error: 'Pay period start date is required'
      };
    }

    if (!request.pay_period_end || !request.pay_period_end.trim()) {
      return {
        success: false,
        error: 'Pay period end date is required'
      };
    }

    try {
      new Date(request.pay_period_start);
      new Date(request.pay_period_end);
    } catch (error) {
      return {
        success: false,
        error: 'Invalid date format. Expected YYYY-MM-DD'
      };
    }

    const startDate = new Date(request.pay_period_start);
    const endDate = new Date(request.pay_period_end);
    
    if (startDate >= endDate) {
      return {
        success: false,
        error: 'Pay period start date must be before end date'
      };
    }

    const cleanRequest: CreatePayslipRequest = {
      ...request,
      employee_name: request.employee_name.trim(),
      employee_id: request.employee_id.trim(),
      salary_currency: request.salary_currency || 'USD',
      cryptocurrency: request.cryptocurrency || 'ETH',
      pay_date: request.pay_date || new Date().toISOString().split('T')[0],
      tax_deduction: request.tax_deduction || 0,
      insurance_deduction: request.insurance_deduction || 0,
      retirement_deduction: request.retirement_deduction || 0,
      other_deductions: request.other_deductions || 0,
      overtime_pay: request.overtime_pay || 0,
      bonus: request.bonus || 0,
      allowances: request.allowances || 0,
      notes: request.notes || '',
      department: request.department || 'General',
      position: request.position || 'Employee'
    };

    try {
      return await this.payslipRepository.createPayslip(cleanRequest);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create payslip'
      };
    }
  }
}
