import { Session } from "../../domain/entities/SessionEntities";

export interface SessionRepository {
    listSessions(): Promise<Session[]>;
    revokeSession(sid: string): Promise<void>;
    revokeOtherSessions(): Promise<void>;
    approveSession(sid: string): Promise<void>;
}
