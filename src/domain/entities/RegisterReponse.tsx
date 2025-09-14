export interface RegisterResponse {
  user_id: string;
  username: string;
  email: string;
  role: string;
  message: string;
  employee_id?: string;
}