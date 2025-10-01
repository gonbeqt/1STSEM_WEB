import { Payslip } from '../../domain/entities/PayslipEntities';
import { PayslipRepository } from '../../domain/repositories/PayslipRepository';

export class PayslipRepositoryImpl implements PayslipRepository {
    private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        console.log('Auth token for payslips:', token ? `Token: ${token.substring(0, 10)}...` : 'No token');
        console.log('Full token length:', token ? token.length : 0);
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    async getUserPayslips(employee_id?: string): Promise<Payslip[]> {
        const queryParams = new URLSearchParams();
        if (employee_id) queryParams.append('employee_id', employee_id);

        const url = `${this.API_URL}/payslips/list/?${queryParams.toString()}`;
        
        console.log('API Base URL:', this.API_URL);
        console.log('Employee ID:', employee_id);
        console.log('Fetching payslips from URL:', url);

        const headers = this.getAuthHeaders();
        console.log('Request headers:', headers);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        console.log('Response status:', response.status);
        console.log('Response URL:', response.url);

        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            console.error('Payslips fetch failed:', {
                status: response.status,
                statusText: response.statusText,
                data: data
            });
            throw new Error(data.error || `Failed to fetch payslips: ${response.status} ${response.statusText}`);
        }

        return data.payslips || [];
    }
}
