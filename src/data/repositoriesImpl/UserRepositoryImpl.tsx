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
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    // Debug: log outgoing register request
    console.debug('register request body:', request);

    const response = await fetch(`${this.API_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    // Debug: log response status and body for troubleshooting
    console.debug('register response status:', response.status, 'body:', data);

    if (!response.ok) {
      // Provide more context in the thrown error
      const errMsg = data?.message || data?.errors?.[0] || 'Registration failed';
      throw new Error(errMsg);
    }

    return data;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    
    try {
      const response = await fetch(`${this.API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      // Debug the entire API response structure
      
      // Debug user object specifically
      if (data.user) {
      } else if (data.data) {
      } else {
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
    
    const response = await fetch(`${this.API_URL}/auth/logout/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Logout failed with status:', response.status);
      console.error('Error data:', data);
      throw new Error(data.error || data.message || 'Logout failed');
    }

    return data;
  }
}