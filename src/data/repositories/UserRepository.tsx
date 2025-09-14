import { RegisterRequest } from '../../domain/entities/RegisterRequest';
import { RegisterResponse } from '../../domain/entities/RegisterReponse';
import { LoginRequest } from '../../domain/entities/LoginRequest';
import { LoginResponse } from '../../domain/entities/LoginResponse';

export interface UserRepository {
  register(request: RegisterRequest): Promise<RegisterResponse>;
  login(request: LoginRequest): Promise<LoginResponse>;
}