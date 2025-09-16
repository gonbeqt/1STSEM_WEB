import { SessionRepository } from '../../data/repositories/SessionRepository';

export class GetSessionApprovalStatusUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(sessionId: string): Promise<'pending' | 'approved' | 'rejected'> {
    try {
      const sessions = await this.sessionRepository.listSessions();
      const targetSession = sessions.find(session => session.sid === sessionId);

      if (!targetSession) {
        // If the session is not found, it might be a temporary issue or still pending.
        // Continue polling.
        return 'pending';
      }

      if (targetSession.approved) {
        return 'approved';
      } else if (targetSession.revoked_at) {
        // If revoked_at is not null, it means the session was explicitly revoked
        return 'rejected';
      } else {
        return 'pending';
      }
    } catch (error) {
      console.error('Error getting session approval status:', error);
      // If an error occurs, continue polling as it might be a transient network issue.
      return 'pending';
    }
  }
}
