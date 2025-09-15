// src/domain/models/LoginViewModel.tsx
import { makeAutoObservable } from 'mobx';
import { LoginUseCase } from '../usecases/LoginUseCase';
import { LogoutUseCase } from '../usecases/LogOutUseCase';

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
    private logoutUseCase: LogoutUseCase
  ) {
    makeAutoObservable(this);
    
    // Check if user is already logged in
    this.checkLoginStatus();
  }

  private checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    this.state.isLoggedIn = !!(token && user);
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

      const tokenToStore = Array.isArray(response.data.token) ? response.data.token[0] : response.data.token;
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