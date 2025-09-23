import { Payslip } from '../entities/PayslipEntities';

export interface PayslipRepository {
    getUserPayslips(employee_id?: string, status?: string): Promise<Payslip[]>;
}
