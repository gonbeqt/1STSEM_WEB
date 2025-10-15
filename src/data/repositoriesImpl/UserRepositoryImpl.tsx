// src/domain/repositoriesImpl/UserRepositoryImpl.tsx
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RegisterRequest } from '../../domain/entities/RegisterRequest';
import { RegisterResponse } from '../../domain/entities/RegisterReponse';
import { LoginRequest } from '../../domain/entities/LoginRequest';
import { LoginResponse } from '../../domain/entities/LoginResponse';
import { LogoutRequest, LogoutResponse } from '../../domain/entities/LogoutEntities';
import apiService from '../api';


export class UserRepositoryImpl implements UserRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const data = await apiService.post<RegisterResponse>(`${this.API_URL}/auth/register/`, request);
    return data;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const data: any = await apiService.post<any>(`${this.API_URL}/auth/login/`, request);
    if (data?.data && !data?.user) {
      const transformedData: LoginResponse = {
        success: data.success,
        message: data.message,
        user: {
          id: data.data.user_id,
          username: data.data.username,
          email: data.data.email,
          first_name: data.data.first_name || '',
          last_name: data.data.last_name || '',
          is_verified: data.data.is_verified || false,
          role: data.data.role,
        },
        session_token: data.data.token,
      } as any;
      return transformedData;
    }
    return data as LoginResponse;
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const data = await apiService.post<LogoutResponse>(`${this.API_URL}/auth/logout/`, request);
    return data;
  }
}