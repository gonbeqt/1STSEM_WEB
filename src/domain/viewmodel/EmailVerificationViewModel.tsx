import { makeAutoObservable } from 'mobx';
import { VerifyEmailUseCase } from '../usecases/VerifyEmailUseCase';
import { ResendVerificationUseCase } from '../usecases/ResendVerificationUseCase';

interface EmailVerificationState {
  email: string;
  code: string;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  resendCooldown: number;
}

export class EmailVerificationViewModel {
  private state: EmailVerificationState = {
    email: '',
    code: '',
    isLoading: false,
    isResending: false,
    error: null,
    success: false,
    message: null,
    resendCooldown: 0
  };

  constructor(
    private verifyEmailUseCase: VerifyEmailUseCase,
    private resendVerificationUseCase: ResendVerificationUseCase
  ) {
    makeAutoObservable(this);
  }

  setEmail = (email: string) => {
    this.state.email = email;
  };

  setCode = (code: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericCode = code.replace(/\D/g, '').slice(0, 6);
    this.state.code = numericCode;
  };

  clearError = () => {
    this.state.error = null;
  };

  clearSuccess = () => {
    this.state.success = false;
    this.state.message = null;
  };

  verifyEmail = async (): Promise<boolean> => {
    if (!this.state.email || !this.state.code) {
      this.state.error = 'Email and verification code are required';
      return false;
    }

    if (this.state.code.length !== 6) {
      this.state.error = 'Verification code must be 6 digits';
      return false;
    }

    try {
      this.state.isLoading = true;
      this.state.error = null;

      const result = await this.verifyEmailUseCase.execute({
        email: this.state.email,
        code: this.state.code
      });

      if (result.success) {
        this.state.success = true;
        this.state.message = result.message;
        return true;
      } else {
        this.state.error = result.errors?.[0] || result.message || 'Email verification failed';
        return false;
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Email verification failed';
      return false;
    } finally {
      this.state.isLoading = false;
    }
  };

  resendVerificationEmail = async (): Promise<boolean> => {
    if (!this.state.email) {
      this.state.error = 'Email is required';
      return false;
    }

    if (this.state.resendCooldown > 0) {
      this.state.error = `Please wait ${this.state.resendCooldown} seconds before resending`;
      return false;
    }

    try {
      this.state.isResending = true;
      this.state.error = null;

      const result = await this.resendVerificationUseCase.execute({
        email: this.state.email
      });

      if (result.success) {
        this.state.message = result.message;
        this.startResendCooldown();
        return true;
      } else {
        this.state.error = result.errors?.[0] || result.message || 'Failed to resend verification email';
        return false;
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Failed to resend verification email';
      return false;
    } finally {
      this.state.isResending = false;
    }
  };

  private startResendCooldown = () => {
    this.state.resendCooldown = 60; // 60 seconds cooldown
    const interval = setInterval(() => {
      this.state.resendCooldown--;
      if (this.state.resendCooldown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  get formData() {
    return this.state;
  }
}

