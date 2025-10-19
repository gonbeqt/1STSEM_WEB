import { PasswordResetRepository } from '../../domain/repositories/PasswordResetRepository';
import { 
  PasswordResetRequest, 
  PasswordResetRequestResponse, 
  PasswordReset, 
  PasswordResetResponse 
} from '../../domain/entities/PasswordResetEntities';
import { PasswordResetRemoteDataSource } from '../datasources/PasswordResetRemoteDataSource';

export class PasswordResetRepositoryImpl implements PasswordResetRepository {
  constructor(private readonly remote: PasswordResetRemoteDataSource) {}

  async requestPasswordReset(request: PasswordResetRequest): Promise<PasswordResetRequestResponse> {
    return this.remote.requestPasswordReset(request);
  }

  async resetPassword(request: PasswordReset): Promise<PasswordResetResponse> {
    return this.remote.resetPassword(request);
  }
}
