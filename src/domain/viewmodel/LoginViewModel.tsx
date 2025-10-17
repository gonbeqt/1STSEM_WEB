// src/domain/models/LoginViewModel.tsx
import { makeAutoObservable, runInAction } from 'mobx';
import { LoginUseCase } from '../usecases/LoginUseCase';
import { LogoutUseCase } from '../usecases/LogOutUseCase';
import { ChangePasswordUseCase } from '../usecases/ChangePasswordUseCase';
import { SendSupportMessageUseCase } from '../usecases/SendSupportMessageUseCase';
import { WalletViewModel } from './WalletViewModal';
import { LoginResponse } from '../entities/LoginResponse'; // Added this import
 

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  isLoggingOut: boolean;
  error: string | null;
  logoutError: string | null;
  isLoggedIn: boolean;
}

export class LoginViewModel {
  private state: LoginState = {
    email: '',
    password: '',
    isLoading: false,
    isLoggingOut: false,
    error: null,
    logoutError: null,
    isLoggedIn: false
  };

  constructor(
    private loginUseCase: LoginUseCase,
    private logoutUseCase: LogoutUseCase,
    private getWalletViewModel: () => WalletViewModel,
    private changePasswordUseCase?: ChangePasswordUseCase,
    private sendSupportMessageUseCase?: SendSupportMessageUseCase
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    // Initialize login status based on existing tokens
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    runInAction(() => {
      this.state.isLoggedIn = !!(token && user);
    });
  }

  // Change password via use case
  changePassword = async (payload: { current_password?: string; newPassword?: string; confirmPassword?: string; revoke_other_sessions?: boolean }) => {
    // Normalize fields
    const current_password = payload.current_password || '';
    const new_password = payload.newPassword || payload.newPassword || '';

    if (!new_password) {
      throw new Error('New password is required');
    }

    if (!this.changePasswordUseCase) {
      throw new Error('ChangePassword use case not available');
    }

    // Call use case
    const result = await this.changePasswordUseCase.execute({
      current_password,
      new_password,
      revoke_other_sessions: payload.revoke_other_sessions
    });

    return result;
  }

  // Send support message via use case
  sendSupportMessage = async (payload: { subject?: string; message: string; category?: string; priority?: string; attachments?: File | Blob | string | FileList | Array<File | Blob | string> }) => {
    if (!this.sendSupportMessageUseCase) {
      throw new Error('SendSupportMessage use case not available');
    }

    const result = await this.sendSupportMessageUseCase.execute({
      subject: payload.subject || 'User Support Message',
      message: payload.message,
      category: payload.category || 'general',
      priority: payload.priority || 'medium',
      attachments: payload.attachments || []
    });

    return result;
  }

  private checkLoginStatus = () => {
    // This method is no longer needed as login status is initialized in the constructor
    // and updated by login/logout actions.
  };

  setEmail = (email: string) => {
    this.state.email = email;
    this.clearErrors();
  };

  setPassword = (password: string) => {
    this.state.password = password;
    this.clearErrors();
  };

  clearErrors = () => {
    this.state.error = null;
    this.state.logoutError = null;
  };

  login = async (): Promise<LoginResponse | null> => {
    runInAction(() => {
      this.state.isLoading = true;
      this.state.error = null;
    });

    try {

      const response = await this.loginUseCase.execute({
        email: this.state.email,
        password: this.state.password,
        device_name: window.navigator.userAgent,
        device_id: 'web'
      });

      

      // Check if response exists and is not null/undefined
      if (!response || response === null || response === undefined) {
        console.error('No data in response');
        throw new Error('No data received from login response');
      }

      // Check if login was successful
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      // Check if user and session_token exist
      if (!response.user) {
        console.error('No user data in response:', response);
        throw new Error('No user data received from login response');
      }

      // Log the full user object to debug role issue

  
      // Log role information for debugging

      if (!response.session_token) {
        console.error('No session_token in response:', response);
        throw new Error('No session token received from login');
      }

      localStorage.setItem('token', response.session_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      runInAction(() => {
        this.state.isLoggedIn = true;
        this.state.email = '';
        this.state.password = '';
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : 'Login failed';
        this.state.isLoggedIn = false;
      });
      return null;
    } finally {
      runInAction(() => {
        this.state.isLoading = false;
      });
    }
  };

  logout = async (): Promise<boolean> => {
    try {
      runInAction(() => {
        this.state.isLoggingOut = true;
        this.state.logoutError = null;
      });
      await this.logoutUseCase.execute({});
      runInAction(() => {
        this.state.isLoggedIn = false;
        this.state.email = '';
        this.state.password = '';
        this.clearErrors();
      });
      this.getWalletViewModel().resetWalletState();

      return true;
    } catch (error) {
      runInAction(() => {
        this.state.logoutError = error instanceof Error ? error.message : 'Logout failed';
        this.state.isLoggedIn = false;
      });
      return false;
    } finally {
      runInAction(() => {
        this.state.isLoggingOut = false;
      });
    }
  };

  // Getters
  get formData() {
    return {
      email: this.state.email,
      password: this.state.password,
      isLoading: this.state.isLoading,
      error: this.state.error
    };
  }

  get isLoggedIn() {
    return this.state.isLoggedIn;
  }

  get isLoggingOut() {
    return this.state.isLoggingOut;
  }

  get logoutError() {
    return this.state.logoutError;
  }

  get currentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}