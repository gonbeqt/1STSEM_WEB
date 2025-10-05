import { 
  PasswordResetRequest, 
  PasswordResetRequestResponse, 
  PasswordReset, 
  PasswordResetResponse 
} from '../entities/PasswordResetEntities';

export interface PasswordResetRepository {
  requestPasswordReset(request: PasswordResetRequest): Promise<PasswordResetRequestResponse>;
  resetPassword(request: PasswordReset): Promise<PasswordResetResponse>;
}
