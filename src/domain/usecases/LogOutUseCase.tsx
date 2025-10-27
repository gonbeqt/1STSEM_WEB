import { UserRepository } from "../repositories/UserRepository";
import { LogoutRequest, LogoutResponse } from "../entities/LogoutEntities";

export class LogoutUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LogoutRequest): Promise<LogoutResponse> {
    try {
      const response = await this.userRepository.logout(request);
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }
}