// src/domain/repositoriesImpl/UserRepositoryImpl.tsx
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RegisterRequest } from '../../domain/entities/RegisterRequest';
import { RegisterResponse } from '../../domain/entities/RegisterReponse';
import { LoginRequest } from '../../domain/entities/LoginRequest';
import { LoginResponse } from '../../domain/entities/LoginResponse';
import { LogoutRequest, LogoutResponse } from '../../domain/entities/LogoutEntities';
import { UserRemoteDataSource } from '../datasources/UserRemoteDataSource';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly remote: UserRemoteDataSource) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return this.remote.register(request);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.remote.login(request);
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    return this.remote.logout(request);
  }

  async changePassword(request: { current_password: string; new_password: string; revoke_other_sessions?: boolean }): Promise<any> {
    return this.remote.changePassword(request);
  }

  async sendSupportMessage(request: { subject?: string; message: string; category?: string; priority?: string; attachments?: any }): Promise<any> {
    return this.remote.sendSupportMessage(request);
  }
}