import { UserRepository } from '../../data/repositories/UserRepository';
import { RegisterRequest } from '../entities/RegisterRequest';
import { RegisterResponse } from '../entities/RegisterReponse';
import { LoginRequest } from '../entities/LoginRequest';
import { LoginResponse } from '../entities/LoginResponse';

export class UserRepositoryImpl implements UserRepository {
    private readonly API_URL = 'http://localhost:8000/api';

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${this.API_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  }
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.API_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  }
}