export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface PasswordReset {
  token: string;
  new_password: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  errors?: string[];
}
