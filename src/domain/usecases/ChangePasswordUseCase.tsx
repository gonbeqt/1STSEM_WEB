import { UserRepository } from '../repositories/UserRepository';

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
  revoke_other_sessions?: boolean;
};

export class ChangePasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: ChangePasswordRequest) {
    return this.userRepository.changePassword(request);
  }
}

export default ChangePasswordUseCase;
