// src/domain/repositoriesImpl/UserRepositoryImpl.tsx
import { UserRepository } from '../../data/repositories/UserRepository';
import { RegisterRequest } from '../entities/RegisterRequest';
import { RegisterResponse } from '../entities/RegisterReponse';
import { LoginRequest } from '../entities/LoginRequest';
import { LoginResponse } from '../entities/LoginResponse';
import { LogoutRequest, LogoutResponse } from '../entities/LogoutEntities';


export class UserRepositoryImpl implements UserRepository {
  private readonly API_URL = 'http://localhost:8000/api';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
    console.log('Token:', localStorage.getItem('token'));
  }

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

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const response = await fetch(`${this.API_URL}/auth/logout/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }

    return data;
  }
}