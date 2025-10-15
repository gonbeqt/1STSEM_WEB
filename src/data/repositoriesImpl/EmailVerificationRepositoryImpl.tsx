import { EmailVerificationRepository } from '../../domain/repositories/EmailVerificationRepository';
import { VerifyEmailRequest, VerifyEmailResponse, ResendVerificationRequest, ResendVerificationResponse } from '../../domain/entities/EmailVerificationEntities';
import apiService from '../api';

export class EmailVerificationRepositoryImpl implements EmailVerificationRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const data = await apiService.post<any>(`${this.API_URL}/auth/verify-email/`, request);
      return {
        success: data?.success ?? true,
        message: data?.message || 'Email verified successfully',
        errors: data?.errors,
      };
    } catch (error: any) {
      console.error('Email verification request failed:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Email verification failed',
        errors: error?.response?.data?.errors || [error?.message || 'Network error during email verification'],
      };
    }
  }

  async resendVerificationEmail(request: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    try {
      const data = await apiService.post<any>(`${this.API_URL}/auth/resend-verification/`, request);
      return {
        success: data?.success ?? true,
        message: data?.message || 'Verification email sent successfully',
        errors: data?.errors,
      };
    } catch (error: any) {
      console.error('Resend verification request failed:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Failed to resend verification email',
        errors: error?.response?.data?.errors || [error?.message || 'Network error during resend verification'],
      };
    }
  }
}

