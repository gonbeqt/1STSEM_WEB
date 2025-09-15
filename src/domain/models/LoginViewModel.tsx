// src/domain/models/LoginViewModel.tsx
import { makeAutoObservable } from 'mobx';
import { LoginUseCase } from '../usecases/LoginUseCase';
import { LogoutUseCase } from '../usecases/LogOutUseCase';
import { WalletViewModel } from './WalletViewModal';

interface LoginState {
  username: string;
  password: string;
  isLoading: boolean;
  isLoggingOut: boolean;
  error: string | null;
  logoutError: string | null;
  isLoggedIn: boolean;
}

export class LoginViewModel {
  private state: LoginState = {
    username: '',
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
    private walletViewModel: WalletViewModel
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

  setUsername = (username: string) => {
    this.state.username = username;
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

  login = async (): Promise<boolean> => {
    try {
      this.state.isLoading = true;
      this.state.error = null;

      const response = await this.loginUseCase.execute({
        username: this.state.username,
        password: this.state.password,
        device_name: window.navigator.userAgent,
        device_id: 'web'
      });

      const token = response.data.token;
      const tokenToStore = Array.isArray(token) ? token[0] : token;

      if (!tokenToStore) {
        throw new Error('No token received from login');
      }

      localStorage.setItem('token', tokenToStore);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      this.state.isLoggedIn = true;
      
      // Clear form after successful login
      this.state.username = '';
      this.state.password = '';

      return true;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Login failed';
      this.state.isLoggedIn = false;
      return false;
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
      this.walletViewModel.resetWalletState();
      
      // Clear any other application state if needed
      this.state.username = '';
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
      username: this.state.username,
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