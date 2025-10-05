import { PasswordResetRepository } from '../repositories/PasswordResetRepository';
import { PasswordResetRequest, PasswordResetRequestResponse } from '../entities/PasswordResetEntities';

export class RequestPasswordResetUseCase {
  constructor(private passwordResetRepository: PasswordResetRepository) {}

  async execute(request: PasswordResetRequest): Promise<PasswordResetRequestResponse> {
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

    return await this.passwordResetRepository.requestPasswordReset(request);
  }
}
