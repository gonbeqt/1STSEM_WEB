import { EmailVerificationRepository } from '../repositories/EmailVerificationRepository';
import { VerifyEmailRequest, VerifyEmailResponse } from '../entities/EmailVerificationEntities';

export class VerifyEmailUseCase {
  constructor(private emailVerificationRepository: EmailVerificationRepository) {}

  async execute(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    if (!request.email || !request.code) {
      return {
        success: false,
        message: 'Email and verification code are required',
        errors: ['Email and verification code are required']
      };
    }

    if (request.code.length !== 6 || !/^\d{6}$/.test(request.code)) {
      return {
        success: false,
        message: 'Verification code must be 6 digits',
        errors: ['Verification code must be 6 digits']
      };
    }

    return await this.emailVerificationRepository.verifyEmail(request);
  }
}

