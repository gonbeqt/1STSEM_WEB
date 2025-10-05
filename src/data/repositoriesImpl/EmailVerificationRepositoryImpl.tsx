import { EmailVerificationRepository } from '../../domain/repositories/EmailVerificationRepository';
import { VerifyEmailRequest, VerifyEmailResponse, ResendVerificationRequest, ResendVerificationResponse } from '../../domain/entities/EmailVerificationEntities';

export class EmailVerificationRepositoryImpl implements EmailVerificationRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/verify-email/`, {
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
          message: data.message || 'Email verification failed',
          errors: data.errors || [data.message || 'Email verification failed']
        };
      }

      return {
        success: true,
        message: data.message || 'Email verified successfully'
      };
    } catch (error) {
      console.error('Email verification request failed:', error);
      return {
        success: false,
        message: 'Network error during email verification',
        errors: ['Network error during email verification']
      };
    }
  }

  async resendVerificationEmail(request: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/resend-verification/`, {
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
          message: data.message || 'Failed to resend verification email',
          errors: data.errors || [data.message || 'Failed to resend verification email']
        };
      }

      return {
        success: true,
        message: data.message || 'Verification email sent successfully'
      };
    } catch (error) {
      console.error('Resend verification request failed:', error);
      return {
        success: false,
        message: 'Network error during resend verification',
        errors: ['Network error during resend verification']
      };
    }
  }
}

