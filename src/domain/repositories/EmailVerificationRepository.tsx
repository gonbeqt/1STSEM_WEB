import { VerifyEmailRequest, VerifyEmailResponse, ResendVerificationRequest, ResendVerificationResponse } from '../entities/EmailVerificationEntities';

export interface EmailVerificationRepository {
  verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse>;
  resendVerificationEmail(request: ResendVerificationRequest): Promise<ResendVerificationResponse>;
}

