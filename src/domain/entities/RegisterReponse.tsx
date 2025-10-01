export interface RegisterResponse {
  user_id: string;
  username: string;
  email: string;
  role: string;
  message: string;
  email_verification_required: boolean;
  employee_id?: string;
}