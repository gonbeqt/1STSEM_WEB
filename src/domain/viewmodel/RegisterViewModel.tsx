import { makeAutoObservable } from 'mobx';
import { RegisterUseCase } from '../usecases/RegisterUseCase';

interface RegisterState {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  security_answer: string;
  agreeToTerms: boolean;
  userType: 'manager' | 'employee';
  isLoading: boolean;
  error: string | null;
  email_verification_required: boolean;
}

export class RegisterViewModel {
  private state: RegisterState = {
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    security_answer: '',
    agreeToTerms: false,
    userType: 'manager',
    isLoading: false,
    error: null,
    email_verification_required: false
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

  setPasswordConfirm = (password_confirm: string) => {
    this.state.password_confirm = password_confirm;
  };

  setFirstName = (first_name: string) => {
    this.state.first_name = first_name;
  };

  setLastName = (last_name: string) => {
    this.state.last_name = last_name;
  };

  setSecurityAnswer = (security_answer: string) => {
    this.state.security_answer = security_answer;
  };

  // Alternative method name in case of hot reload issues
  setSecurityQuestionAnswer = (security_answer: string) => {
    this.state.security_answer = security_answer;
  };

  setAgreeToTerms = (agree: boolean) => {
    this.state.agreeToTerms = agree;
  };

  setUserType = (type: 'manager' | 'employee') => {
    this.state.userType = type;
  };

  validateForm = (): boolean => {
    if (!this.state.username || !this.state.email || !this.state.password || 
        !this.state.first_name || !this.state.last_name || !this.state.security_answer) {
      this.state.error = 'Please fill in all fields';
      return false;
    }

    if (this.state.password !== this.state.password_confirm) {
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

      const response = await this.registerUseCase.execute({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        password_confirm: this.state.password_confirm,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        security_answer: this.state.security_answer,
        role: this.state.userType === 'manager' ? 'Manager' : 'Employee'
      });


      // Set email verification flag from response
      this.state.email_verification_required = response.email_verification_required || false;
      
      

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