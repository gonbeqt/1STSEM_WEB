import { EmailVerificationRepository } from '../../domain/repositories/EmailVerificationRepository';
import { VerifyEmailRequest, VerifyEmailResponse, ResendVerificationRequest, ResendVerificationResponse } from '../../domain/entities/EmailVerificationEntities';
import { EmailVerificationRemoteDataSource } from '../datasources/EmailVerificationRemoteDataSource';

export class EmailVerificationRepositoryImpl implements EmailVerificationRepository {
  constructor(private readonly remote: EmailVerificationRemoteDataSource) {}

  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return this.remote.verifyEmail(request);
  }

  async resendVerificationEmail(request: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    return this.remote.resendVerificationEmail(request);
  }
}

