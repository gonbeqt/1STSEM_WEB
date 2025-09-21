import { makeAutoObservable } from 'mobx';
import { RegisterUseCase } from '../usecases/RegisterUseCase';

interface RegisterState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  userType: 'manager' | 'employee';
  isLoading: boolean;
  error: string | null;
}

export class RegisterViewModel {
  private state: RegisterState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    userType: 'manager',
    isLoading: false,
    error: null
  };

  constructor(private registerUseCase: RegisterUseCase) {
    makeAutoObservable(this);
  }

  setUsername = (username: string) => {
    this.state.username = username;
  };

  setEmail = (email: string) => {
    this.state.email = email;
  };

  setPassword = (password: string) => {
    this.state.password = password;
  };

  setConfirmPassword = (confirmPassword: string) => {
    this.state.confirmPassword = confirmPassword;
  };

  setAgreeToTerms = (agree: boolean) => {
    this.state.agreeToTerms = agree;
  };

  setUserType = (type: 'manager' | 'employee') => {
    this.state.userType = type;
  };

  validateForm = (): boolean => {
    if (!this.state.username || !this.state.email || !this.state.password) {
      this.state.error = 'Please fill in all fields';
      return false;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.state.error = 'Passwords do not match';
      return false;
    }

    if (!this.state.agreeToTerms) {
      this.state.error = 'Please agree to the terms and conditions';
      return false;
    }

    return true;
  };

  register = async (): Promise<boolean> => {
    if (!this.validateForm()) return false;

    try {
      this.state.isLoading = true;
      this.state.error = null;

      await this.registerUseCase.execute({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        role: this.state.userType === 'manager' ? 'Manager' : 'Employee'
      });

      return true;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Registration failed';
      return false;
    } finally {
      this.state.isLoading = false;
    }
  };

  get formData() {
    return this.state;
  }
}