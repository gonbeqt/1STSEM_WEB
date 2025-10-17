import { PayslipRepository } from '../repositories/PayslipRepository';
import { Payslip } from '../entities/PayslipEntities';

export interface GetUserPayslipsParams {
    userId?: string;
    employeeId?: string;
    status?: string;
    isManager?: boolean;
    email?: string;
}

export class GetUserPayslipsUseCase {
    constructor(private payslipRepository: PayslipRepository) {}

    async execute(params?: GetUserPayslipsParams): Promise<Payslip[]> {
        return this.payslipRepository.getUserPayslips(params);
    }
}
