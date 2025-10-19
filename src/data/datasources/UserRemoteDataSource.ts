import { ApiService } from '../api/ApiService';
import { RegisterRequest } from '../../domain/entities/RegisterRequest';
import { RegisterResponse } from '../../domain/entities/RegisterReponse';
import { LoginRequest } from '../../domain/entities/LoginRequest';
import { LoginResponse } from '../../domain/entities/LoginResponse';
import { LogoutRequest, LogoutResponse } from '../../domain/entities/LogoutEntities';

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
}
