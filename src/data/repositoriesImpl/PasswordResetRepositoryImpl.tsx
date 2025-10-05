import { PasswordResetRepository } from '../../domain/repositories/PasswordResetRepository';
import { 
  PasswordResetRequest, 
  PasswordResetRequestResponse, 
  PasswordReset, 
  PasswordResetResponse 
} from '../../domain/entities/PasswordResetEntities';

export class PasswordResetRepositoryImpl implements PasswordResetRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  async requestPasswordReset(request: PasswordResetRequest): Promise<PasswordResetRequestResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/password-reset-request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Password reset request failed',
          errors: data.errors || [data.message || 'Password reset request failed']
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset email sent successfully'
      };
    } catch (error) {
      console.error('Password reset request failed:', error);
      return {
        success: false,
        message: 'Network error during password reset request',
        errors: ['Network error during password reset request']
      };
    }
  }

  async resetPassword(request: PasswordReset): Promise<PasswordResetResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Password reset failed',
          errors: data.errors || [data.message || 'Password reset failed']
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset successfully'
      };
    } catch (error) {
      console.error('Password reset failed:', error);
      return {
        success: false,
        message: 'Network error during password reset',
        errors: ['Network error during password reset']
      };
    }
  }
}
