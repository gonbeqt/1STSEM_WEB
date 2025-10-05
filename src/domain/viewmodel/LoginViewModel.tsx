// src/domain/models/LoginViewModel.tsx
import { makeAutoObservable } from 'mobx';
import { LoginUseCase } from '../usecases/LoginUseCase';
import { LogoutUseCase } from '../usecases/LogOutUseCase';
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
    private getWalletViewModel: () => WalletViewModel
  ) {
    makeAutoObservable(this);
    
    // Initialize login status based on existing tokens
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    this.state.isLoggedIn = !!(token && user);
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
    try {
      this.state.isLoading = true;
      this.state.error = null;

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
      
      this.state.isLoggedIn = true;
      
      // Clear form after successful login
      this.state.email = '';
      this.state.password = '';

      return response;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Login failed';
      this.state.isLoggedIn = false;
      return null;
    } finally {
      this.state.isLoading = false;
    }
  };

  logout = async (): Promise<boolean> => {
    try {
      this.state.isLoggingOut = true;
      this.state.logoutError = null;
      await this.logoutUseCase.execute({});
      
      this.state.isLoggedIn = false;
      this.getWalletViewModel().resetWalletState();
      
      // Clear any other application state if needed
      this.state.email = '';
      this.state.password = '';
      this.clearErrors();

      return true;
    } catch (error) {
      this.state.logoutError = error instanceof Error ? error.message : 'Logout failed';
      // Even if logout fails, update local state since localStorage was cleared in use case
      this.state.isLoggedIn = false;
      return false;
    } finally {
      this.state.isLoggingOut = false;
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