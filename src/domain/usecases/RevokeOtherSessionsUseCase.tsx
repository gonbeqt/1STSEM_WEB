import { SessionRepository } from "../../data/repositories/SessionRepository";

export class RevokeOtherSessionsUseCase {
    constructor(private sessionRepository: SessionRepository) {}

    async execute(): Promise<void> {
        await this.sessionRepository.revokeOtherSessions();
    }
}
