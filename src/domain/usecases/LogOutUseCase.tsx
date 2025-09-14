import { UserRepository } from "../../data/repositories/UserRepository";
import { LogoutRequest, LogoutResponse } from "../entities/LogoutEntities";

export class LogoutUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LogoutRequest): Promise<LogoutResponse> {
    try {
      const response = await this.userRepository.logout(request);
      
      // Clear local storage on successful logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return response;
    } catch (error) {
      // Even if the API call fails, clear local storage for security
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }
}