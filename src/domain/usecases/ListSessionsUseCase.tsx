import { SessionRepository } from "../repositories/SessionRepository";
import { Session } from "../entities/SessionEntities";

export class ListSessionsUseCase {
    constructor(private sessionRepository: SessionRepository) {}

    execute(): Promise<Session[]> {
        return this.sessionRepository.listSessions();
    }
}
