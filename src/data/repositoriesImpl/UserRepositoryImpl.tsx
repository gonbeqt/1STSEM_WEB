// src/domain/repositoriesImpl/UserRepositoryImpl.tsx
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RegisterRequest } from '../../domain/entities/RegisterRequest';
import { RegisterResponse } from '../../domain/entities/RegisterReponse';
import { LoginRequest } from '../../domain/entities/LoginRequest';
import { LoginResponse } from '../../domain/entities/LoginResponse';
import { LogoutRequest, LogoutResponse } from '../../domain/entities/LogoutEntities';


export class UserRepositoryImpl implements UserRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage for auth headers:', token);
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
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
    console.log('Login request data:', request);
    console.log('API_URL:', this.API_URL);
    console.log('Full Login URL:', `${this.API_URL}/auth/login/`);
    
    try {
      const response = await fetch(`${this.API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      console.log('Login response:', data);
      console.log('Response status:', response.status);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      
      // Debug the entire API response structure
      console.log('Full API response structure:', data);
      console.log('Response keys:', Object.keys(data));
      
      // Debug user object specifically
      if (data.user) {
        console.log('User object from API:', data.user);
        console.log('User object keys:', Object.keys(data.user));
        console.log('User role from API:', data.user.role);
      } else if (data.data) {
        console.log('Data object from API:', data.data);
        console.log('Data object keys:', Object.keys(data.data));
        console.log('Role from data.role:', data.data.role);
      } else {
        console.log('No user or data object found in response');
        console.log('Available fields:', Object.keys(data));
      }

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        console.error('Error data:', data);
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Validate response structure
      if (!data) {
        console.error('No data in response');
        throw new Error('No data received from server');
      }

      // Transform the response to match expected frontend structure
      if (data.data && !data.user) {
        console.log('Transforming API response structure...');
        const transformedData = {
          success: data.success,
          message: data.message,
          user: {
            id: data.data.user_id,
            username: data.data.username,
            email: data.data.email,
            first_name: data.data.first_name || '',
            last_name: data.data.last_name || '',
            is_verified: data.data.is_verified || false,
            role: data.data.role
          },
          session_token: data.data.token
        };
        console.log('Transformed response:', transformedData);
        return transformedData;
      }

      return data;
    } catch (error) {
      console.error('Login request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error during login');
    }
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const headers = this.getAuthHeaders();
    console.log('Logout request headers:', headers);
    console.log('Logout request body:', request);
    console.log('Logout URL:', `${this.API_URL}/auth/logout/`);
    
    const response = await fetch(`${this.API_URL}/auth/logout/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
    console.log('Logout response:', data);
    console.log('Logout response status:', response.status);

    if (!response.ok) {
      console.error('Logout failed with status:', response.status);
      console.error('Error data:', data);
      throw new Error(data.error || data.message || 'Logout failed');
    }

    return data;
  }
}