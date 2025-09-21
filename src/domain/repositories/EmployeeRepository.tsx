export interface AddEmployeeRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  department?: string;
  position?: string;
  phone?: string;
}

export interface AddEmployeeResponse {
  success: boolean;
  message: string;
  employee?: {
    user_id: string;
    username: string;
    email: string;
    full_name: string;
    department: string;
    position: string;
    phone: string;
    role: string;
    created_by: string;
    created_at: string;
    is_active: boolean;
    employee_id: string;
  };
  error?: string;
  details?: any;
}

export interface GetEmployeesByManagerRequest {
  // No specific request parameters for now, as manager is identified by token
}

export interface Employee {
  employee_id: string;
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  department: string;
  position: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  onboarding_status: string;
  hired_date: string | null;
  access_granted: boolean;
}

export interface GetEmployeesByManagerResponse {
  employees: Employee[];
  total_count: number;
  manager: string;
  success?: boolean;
  error?: string;
}

export interface EmployeeRepository {
  addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse>;
  getEmployeesByManager(request: GetEmployeesByManagerRequest): Promise<GetEmployeesByManagerResponse>;
}
