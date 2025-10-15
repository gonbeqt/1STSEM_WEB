import { PasswordResetRepository } from '../../domain/repositories/PasswordResetRepository';
import { 
  PasswordResetRequest, 
  PasswordResetRequestResponse, 
  PasswordReset, 
  PasswordResetResponse 
} from '../../domain/entities/PasswordResetEntities';
import apiService from '../api';

export class PasswordResetRepositoryImpl implements PasswordResetRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  async requestPasswordReset(request: PasswordResetRequest): Promise<PasswordResetRequestResponse> {
    try {
      const data = await apiService.post<any>(`${this.API_URL}/auth/password-reset-request/`, request);
      return {
        success: data?.success ?? true,
        message: data?.message || 'Password reset email sent successfully',
        errors: data?.errors,
      };
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Password reset request failed',
        errors: error?.response?.data?.errors || [error?.message || 'Network error during password reset request'],
      };
    }
  }

  async resetPassword(request: PasswordReset): Promise<PasswordResetResponse> {
    try {
      const data = await apiService.post<any>(`${this.API_URL}/auth/password-reset/`, request);
      return {
        success: data?.success ?? true,
        message: data?.message || 'Password reset successfully',
        errors: data?.errors,
      };
    } catch (error: any) {
      console.error('Password reset failed:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Password reset failed',
        errors: error?.response?.data?.errors || [error?.message || 'Network error during password reset'],
      };
    }
  }
}
