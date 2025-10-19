import { makeAutoObservable } from 'mobx';
import { RequestPasswordResetUseCase } from '../usecases/RequestPasswordResetUseCase';
import { PasswordResetRequestResponse } from '../entities/PasswordResetEntities';

interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

export class ForgotPasswordViewModel {
  private state: ForgotPasswordState = {
    email: '',
    isLoading: false,
    error: null,
    message: null
  };

  constructor(private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase) {
    makeAutoObservable(this);
  }

  setEmail = (email: string) => {
    this.state.email = email;
  };

  clearFeedback = () => {
    this.state.error = null;
    this.state.message = null;
  };

  get formData(): ForgotPasswordState {
    return this.state;
  }

  async requestPasswordReset(email?: string): Promise<PasswordResetRequestResponse> {
    const targetEmail = (email ?? this.state.email).trim();
    this.state.email = targetEmail;
    this.state.isLoading = true;
    this.clearFeedback();

    try {
      const response = await this.requestPasswordResetUseCase.execute({ email: targetEmail });

      if (response.success) {
        this.state.message = response.message;
      } else {
        const error = response.errors?.[0] ?? response.message ?? 'Unable to request password reset';
        this.state.error = error;
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to request password reset';
      this.state.error = message;
      return {
        success: false,
        message,
        errors: [message]
      };
    } finally {
      this.state.isLoading = false;
    }
  }
}
