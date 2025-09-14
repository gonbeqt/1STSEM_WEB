import { makeAutoObservable } from 'mobx';
import { LoginUseCase } from '../usecases/LoginUseCase';

interface LoginState {
  username: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export class LoginViewModel {
  private state: LoginState = {
    username: '',
    password: '',
    isLoading: false,
    error: null
  };

  constructor(private loginUseCase: LoginUseCase) {
    makeAutoObservable(this);
  }

  setUsername = (username: string) => {
    this.state.username = username;
  };

  setPassword = (password: string) => {
    this.state.password = password;
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

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      return true;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Login failed';
      return false;
    } finally {
      this.state.isLoading = false;
    }
  };

  get formData() {
    return this.state;
  }
}