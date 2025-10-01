export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    role: string; // Make role required
  };
  session_token: string;
}