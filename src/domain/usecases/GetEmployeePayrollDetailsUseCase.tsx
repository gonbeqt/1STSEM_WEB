// src/domain/usecases/GetEmployeePayrollDetailsUseCase.tsx
import { PayslipRepository } from '../repositories/PayslipRepository';
import { GetEmployeePayrollDetailsRequest, GetEmployeePayrollDetailsResponse } from '../entities/PayrollEntities';

export class GetEmployeePayrollDetailsUseCase {
  constructor(private payslipRepository: PayslipRepository) {}

  async execute(request: GetEmployeePayrollDetailsRequest): Promise<GetEmployeePayrollDetailsResponse> {
    // Add any business logic or validation here before calling the repository
    if (!request.employee_id) {
      return { 
        success: false, 
        message: 'Employee ID is required.', 
        error: 'VALIDATION_ERROR' 
      };
    }

    return await this.payslipRepository.getEmployeePayrollDetails(request);
  }
}

