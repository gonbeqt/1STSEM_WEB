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

  async changePassword(request: { current_password: string; new_password: string; revoke_other_sessions?: boolean }): Promise<any> {
    const payload = {
      current_password: request.current_password,
      new_password: request.new_password,
      revoke_other_sessions: request.revoke_other_sessions !== false,
    };
    const primaryPath = `${this.API_URL}/auth/change-password/`;
    const fallbackPaths = [
      `${this.API_URL}/auth/change-password`,
      `${this.API_URL}/auth/change_password/`,
      `${this.API_URL}/auth/change_password`,
      `${this.API_URL}/auth/password/change/`,
      `${this.API_URL}/auth/password/change`
    ];

    try {
      console.debug('[UserRepository] changePassword POST', primaryPath, payload);
      const data = await apiService.post<any>(primaryPath, payload);
      return data;
    } catch (err: any) {
      const status = err?.response?.status;
      console.warn('[UserRepository] changePassword primary failed', primaryPath, status, err?.message || err);
      // If 404, try fallbacks
      if (status === 404) {
        for (const p of fallbackPaths) {
          try {
            console.debug('[UserRepository] trying fallback path', p);
            const data = await apiService.post<any>(p, payload);
            return data;
          } catch (innerErr: any) {
            console.warn('[UserRepository] fallback failed', p, innerErr?.response?.status || innerErr?.message);
            // continue to next
          }
        }
      }
      // If we get here, rethrow the original error
      throw err;
    }
  }

  async sendSupportMessage(request: { subject?: string; message: string; category?: string; priority?: string; attachments?: any }): Promise<any> {
    const subject = request.subject || 'User Support Message';
    const category = request.category || 'general';
    const priority = request.priority || 'medium';

    const form = new FormData();
    form.append('subject', subject);
    form.append('message', request.message);
    form.append('category', category);
    form.append('priority', priority);

    // Support attachments as File | Blob | string | FileList | Array of those
    const atts: any = request.attachments;
    const appendAttachment = (value: any) => {
      if (value == null) return;
      // Repeat the same field name to send multiple files
      form.append('attachments', value as any);
    };
    if (atts) {
      if (atts instanceof FileList) {
        Array.from(atts).forEach(appendAttachment);
      } else if (Array.isArray(atts)) {
        atts.forEach(appendAttachment);
      } else {
        appendAttachment(atts);
      }
    }

    const primaryPath = `${this.API_URL}/support/submit/`;
    const fallbackPaths = [
      `${this.API_URL}/support/submit`,
      `${this.API_URL}/support/`,
      `${this.API_URL}/support`,
    ];

    try {
      console.debug('[UserRepository] sendSupportMessage POST (multipart)', primaryPath);
      const data = await apiService.postForm<any>(primaryPath, form);
      return data;
    } catch (err: any) {
      const status = err?.response?.status;
      console.warn('[UserRepository] sendSupportMessage primary failed', primaryPath, status, err?.message || err);
      if (status === 404) {
        for (const p of fallbackPaths) {
          try {
            console.debug('[UserRepository] trying fallback path', p);
            const data = await apiService.postForm<any>(p, form);
            return data;
          } catch (innerErr: any) {
            console.warn('[UserRepository] fallback failed', p, innerErr?.response?.status || innerErr?.message);
          }
        }
      }
      throw err;
    }
  }
}