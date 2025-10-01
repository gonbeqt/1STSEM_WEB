export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  security_answer: string;
  role: 'Manager' | 'Employee';
}