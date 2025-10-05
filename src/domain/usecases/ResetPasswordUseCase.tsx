import { PasswordResetRepository } from '../repositories/PasswordResetRepository';
import { PasswordReset, PasswordResetResponse } from '../entities/PasswordResetEntities';

export class ResetPasswordUseCase {
  constructor(private passwordResetRepository: PasswordResetRepository) {}

  async execute(request: PasswordReset): Promise<PasswordResetResponse> {
    if (!request.token) {
      return {
        success: false,
        message: 'Reset token is required',
        errors: ['Reset token is required']
      };
    }

    if (!request.new_password) {
      return {
        success: false,
        message: 'New password is required',
        errors: ['New password is required']
      };
    }

    if (request.new_password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long',
        errors: ['Password must be at least 8 characters long']
      };
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(request.new_password)) {
      return {
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        errors: ['Password must contain at least one uppercase letter, one lowercase letter, and one number']
      };
    }

    return await this.passwordResetRepository.resetPassword(request);
  }
}
