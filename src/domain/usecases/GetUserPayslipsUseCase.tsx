import { PayslipRepository } from '../repositories/PayslipRepository';
import { Payslip } from '../entities/PayslipEntities';

export class GetUserPayslipsUseCase {
    constructor(private payslipRepository: PayslipRepository) {}

    async execute(employee_id?: string, status?: string): Promise<Payslip[]> {
        return this.payslipRepository.getUserPayslips(employee_id, status);
    }
}
