import { Employee as ApiEmployee } from '../../../../domain/repositories/EmployeeRepository';

export interface DetailedEmployee {
  id: string;
  fullName: string;
  position: string;
  employeeId: string;
  emailAddress: string;
  phoneNumber: string;
  department: string;
  baseSalary: number;
  paymentSchedule: string;
  employmentType: string;
  startDate: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  nationality?: string;
  status: 'Active' | 'Inactive';
  profileImage?: string;
}

export const getEmployeeDisplayName = (employee: ApiEmployee): string =>
  employee.full_name || employee.username || '';

export const getEmployeeInitial = (employee: ApiEmployee): string =>
  getEmployeeDisplayName(employee).charAt(0).toUpperCase();

export const getStatusBadgeClass = (isActive: boolean): string =>
  isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

export const mapApiEmployeeToDetailed = (employee: ApiEmployee): DetailedEmployee => ({
  id: employee.user_id,
  fullName: employee.full_name || employee.username,
  employeeId: employee.employee_id || employee.user_id,
  emailAddress: employee.email,
  phoneNumber: employee.phone || 'N/A',
  position: employee.position || 'N/A',
  department: employee.department || 'N/A',
  baseSalary: 0,
  paymentSchedule: 'Weekly',
  employmentType: 'Full-time',
  startDate: employee.hired_date || employee.created_at,
  dateOfBirth: 'N/A',
  address: 'N/A',
  gender: 'N/A',
  nationality: 'N/A',
  status: employee.is_active ? 'Active' : 'Inactive',
  profileImage: employee.profileImage || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=User',
});

export const filterEmployeesList = (employees: ApiEmployee[], searchTerm: string): ApiEmployee[] => {
  const term = (searchTerm || '').toLowerCase().trim();
  if (!term) return employees;
  return employees.filter((employee) => {
    const username = employee.username?.toLowerCase() || '';
    const email = employee.email?.toLowerCase() || '';
    const position = employee.position?.toLowerCase() || '';
    const fullName = employee.full_name?.toLowerCase() || '';
    return (
      username.includes(term) ||
      email.includes(term) ||
      position.includes(term) ||
      fullName.includes(term)
    );
  });
};
