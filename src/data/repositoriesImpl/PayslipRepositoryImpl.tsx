import { Payslip } from '../../domain/entities/PayslipEntities';
import { PayslipRepository } from '../../domain/repositories/PayslipRepository';

export class PayslipRepositoryImpl implements PayslipRepository {
    private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    async getUserPayslips(employee_id?: string, status?: string): Promise<Payslip[]> {
        const queryParams = new URLSearchParams();
        if (employee_id) queryParams.append('employee_id', employee_id);
        if (status) queryParams.append('status', status);

        const url = `${this.API_URL}/payslips/list/?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch payslips');
        }

        return data.payslips;
    }
}
