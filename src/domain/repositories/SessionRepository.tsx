import { Session } from "../entities/SessionEntities";

export interface SessionRepository {
  listSessions(): Promise<Session[]>;
  revokeSession(sid: string): Promise<void>;
  revokeOtherSessions(): Promise<void>;
  approveSession(sid: string): Promise<void>;
  transferMainDevice(sid: string): Promise<void>;
}