export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    username: string;
    email: string;
    role: string;
    token: string | string[];
    session_id: string;
    approved: boolean;
    is_active: boolean;
    token_created_at: string;
  };
}