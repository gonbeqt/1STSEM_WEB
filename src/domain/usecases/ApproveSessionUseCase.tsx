import { SessionRepository } from "../repositories/SessionRepository";

export class ApproveSessionUseCase {
    constructor(private sessionRepository: SessionRepository) {}

    async execute(sid: string): Promise<void> {
        await this.sessionRepository.approveSession(sid);
    }
}
