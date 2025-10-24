import { ApiService } from '../api/ApiService';
import { RegisterRequest } from '../../domain/entities/RegisterRequest';
import { RegisterResponse } from '../../domain/entities/RegisterReponse';
import { LoginRequest } from '../../domain/entities/LoginRequest';
import { LoginResponse } from '../../domain/entities/LoginResponse';
import { LogoutRequest, LogoutResponse } from '../../domain/entities/LogoutEntities';
import { ChangePasswordRequest } from '../../domain/usecases/ChangePasswordUseCase';

export class UserRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const data = await this.api.post<RegisterResponse>(`${this.apiUrl}/auth/register/`, request);
    return data;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const data: any = await this.api.post<any>(`${this.apiUrl}/auth/login/`, request);
    if (data?.data && !data?.user) {
      const transformed: LoginResponse = {
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
      return transformed;
    }
    return data as LoginResponse;
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const data = await this.api.post<LogoutResponse>(`${this.apiUrl}/auth/logout/`, request);
    return data;
  }

  async changePassword(request: ChangePasswordRequest): Promise<any> {
    const payload = {
      current_password: request.current_password,
      new_password: request.new_password,
      revoke_other_sessions: request.revoke_other_sessions !== false,
    };

    const endpoints = [
      `${this.apiUrl}/auth/change-password/`,
      `${this.apiUrl}/auth/change-password`,
      `${this.apiUrl}/auth/change_password/`,
      `${this.apiUrl}/auth/change_password`,
      `${this.apiUrl}/auth/password/change/`,
      `${this.apiUrl}/auth/password/change`,
    ];

    let lastError: unknown;
    for (const path of endpoints) {
      try {
        return await this.api.post<any>(path, payload);
      } catch (error: any) {
        lastError = error;
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  }

  async sendSupportMessage(request: { subject?: string; message: string; category?: string; priority?: string; attachments?: File | Blob | string | FileList | Array<File | Blob | string> }): Promise<any> {
    const subject = request.subject || 'User Support Message';
    const category = request.category || 'general';
    const priority = request.priority || 'medium';

    const form = new FormData();
    form.append('subject', subject);
    form.append('message', request.message);
    form.append('category', category);
    form.append('priority', priority);

    const attachments = request.attachments;
    const appendAttachment = (value: File | Blob | string) => {
      if (value == null) {
        return;
      }
      form.append('attachments', value as any);
    };

    if (attachments) {
      if (attachments instanceof FileList) {
        Array.from(attachments).forEach(appendAttachment);
      } else if (Array.isArray(attachments)) {
        attachments.forEach(appendAttachment);
      } else {
        appendAttachment(attachments as File | Blob | string);
      }
    }

    const endpoints = [
      `/support/submit/`,
      `/support/submit`,
      `/support/`,
      `/support`,
    ];

    let lastError: unknown;
    for (const path of endpoints) {
      try {
        return await this.api.postForm<any>(path, form);
      } catch (error: any) {
        lastError = error;
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  }
}
