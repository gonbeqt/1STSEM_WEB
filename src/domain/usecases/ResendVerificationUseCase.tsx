import { EmailVerificationRepository } from '../repositories/EmailVerificationRepository';
import { ResendVerificationRequest, ResendVerificationResponse } from '../entities/EmailVerificationEntities';

export class ResendVerificationUseCase {
  constructor(private emailVerificationRepository: EmailVerificationRepository) {}

  async execute(request: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    if (!request.email) {
      return {
        success: false,
        message: 'Email is required',
        errors: ['Email is required']
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        errors: ['Please enter a valid email address']
      };
    }

    return await this.emailVerificationRepository.resendVerificationEmail(request);
  }
}

