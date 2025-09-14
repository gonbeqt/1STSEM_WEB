export interface LogoutRequest {
  // No additional data needed - uses token from headers
}

// src/domain/entities/LogoutResponse.tsx
export interface LogoutResponse {
  success: boolean;
  message: string;
}