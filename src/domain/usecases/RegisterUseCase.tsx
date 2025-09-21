import { UserRepository } from '../repositories/UserRepository';
import { RegisterRequest } from '../entities/RegisterRequest';
import { RegisterResponse } from '../entities/RegisterReponse';

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    return await this.userRepository.register(request);
  }
}