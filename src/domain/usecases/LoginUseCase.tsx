import { UserRepository } from '../../data/repositories/UserRepository';
import { LoginRequest } from '../entities/LoginRequest';
import { LoginResponse } from '../entities/LoginResponse';

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    return await this.userRepository.login(request);
  }
}