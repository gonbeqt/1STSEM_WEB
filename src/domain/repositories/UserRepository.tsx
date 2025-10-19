import { RegisterRequest } from '../entities/RegisterRequest';
import { RegisterResponse } from '../entities/RegisterReponse';
import { LoginRequest } from '../entities/LoginRequest';
import { LoginResponse } from '../entities/LoginResponse';
import { LogoutRequest, LogoutResponse } from '../entities/LogoutEntities';

export interface UserRepository {
  register(request: RegisterRequest): Promise<RegisterResponse>;
  login(request: LoginRequest): Promise<LoginResponse>;
    logout(request: LogoutRequest): Promise<LogoutResponse>;
    changePassword(request: { current_password: string; new_password: string; revoke_other_sessions?: boolean }): Promise<any>;
    sendSupportMessage(request: { subject?: string; message: string; category?: string; priority?: string; attachments?: File | Blob | string | FileList | Array<File | Blob | string> }): Promise<any>;

}