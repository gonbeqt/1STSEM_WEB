import { SessionRepository } from "../repositories/SessionRepository";

export class RevokeSessionUseCase {
    constructor(private sessionRepository: SessionRepository) {}

    execute(sid: string): Promise<void> {
        return this.sessionRepository.revokeSession(sid);
    }
}
