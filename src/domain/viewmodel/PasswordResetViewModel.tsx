import { makeAutoObservable } from 'mobx';
import { RequestPasswordResetUseCase } from '../usecases/RequestPasswordResetUseCase';
import { ResetPasswordUseCase } from '../usecases/ResetPasswordUseCase';

interface PasswordResetState {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

export class PasswordResetViewModel {
  private state: PasswordResetState = {
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    error: null,
    success: false,
    message: null
  };

  constructor(
    private requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase
  ) {
    makeAutoObservable(this);
  }

  setEmail = (email: string) => {
    this.state.email = email;
  };

  setToken = (token: string) => {
    this.state.token = token;
  };

  setNewPassword = (password: string) => {
    this.state.newPassword = password;
  };

  setConfirmPassword = (password: string) => {
    this.state.confirmPassword = password;
  };

  clearError = () => {
    this.state.error = null;
  };

  clearSuccess = () => {
    this.state.success = false;
    this.state.message = null;
  };

  requestPasswordReset = async (): Promise<boolean> => {
    if (!this.state.email) {
      this.state.error = 'Email is required';
      return false;
    }

    try {
      this.state.isLoading = true;
      this.state.error = null;

      const result = await this.requestPasswordResetUseCase.execute({
        email: this.state.email
      });

      if (result.success) {
        this.state.success = true;
        this.state.message = result.message;
        return true;
      } else {
        this.state.error = result.errors?.[0] || result.message || 'Password reset request failed';
        return false;
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Password reset request failed';
      return false;
    } finally {
      this.state.isLoading = false;
    }
  };

  resetPassword = async (): Promise<boolean> => {
    if (!this.state.token) {
      this.state.error = 'Reset token is required';
      return false;
    }

    if (!this.state.newPassword) {
      this.state.error = 'New password is required';
      return false;
    }

    if (this.state.newPassword !== this.state.confirmPassword) {
      this.state.error = 'Passwords do not match';
      return false;
    }

    try {
      this.state.isLoading = true;
      this.state.error = null;

      const result = await this.resetPasswordUseCase.execute({
        token: this.state.token,
        new_password: this.state.newPassword
      });

      if (result.success) {
        this.state.success = true;
        this.state.message = result.message;
        return true;
      } else {
        this.state.error = result.errors?.[0] || result.message || 'Password reset failed';
        return false;
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Password reset failed';
      return false;
    } finally {
      this.state.isLoading = false;
    }
  };

  get formData() {
    return this.state;
  }
}
