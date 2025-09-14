export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'Manager' | 'Employee';
}