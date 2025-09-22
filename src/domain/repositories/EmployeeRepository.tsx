export interface AddEmployeeRequest {
  email: string;
  position?: string;
  department?: string;
  full_name?: string;
  phone?: string;
}

export interface AddEmployeeResponse {
  success: boolean;
  message: string;
  employee?: {
    user_id: string;
    employee_id: string;
    username: string;
    email: string;
    full_name: string;
    department: string;
    position: string;
    phone: string;
    role: string;
    managed_by: string;
    original_registration_date: string;
    added_to_team_date: string;
    is_active: boolean;
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
  profileImage?: string;
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