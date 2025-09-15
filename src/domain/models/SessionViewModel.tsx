import { ListSessionsUseCase } from '../usecases/ListSessionsUseCase';
import { RevokeSessionUseCase } from '../usecases/RevokeSessionUseCase';
import { RevokeOtherSessionsUseCase } from '../usecases/RevokeOtherSessionsUseCase';
import { ApproveSessionUseCase } from '../usecases/ApproveSessionUseCase';
import { Session } from '../entities/SessionEntities';
import { makeAutoObservable } from 'mobx';

export class SessionViewModel {
    sessions: Session[] = [];
    isLoading: boolean = false;
    error: string | null = null;

    constructor(
        private listSessionsUseCase: ListSessionsUseCase,
        private revokeSessionUseCase: RevokeSessionUseCase,
        private revokeOtherSessionsUseCase: RevokeOtherSessionsUseCase,
        private approveSessionUseCase: ApproveSessionUseCase
    ) {
        makeAutoObservable(this);
    }

    async fetchSessions() {
        this.isLoading = true;
        try {
            this.sessions = await this.listSessionsUseCase.execute();
            this.error = null;
        } catch (e: any) {
            this.error = e.message;
        } finally {
            this.isLoading = false;
        }
    }

    async revokeSession(sid: string) {
        try {
            await this.revokeSessionUseCase.execute(sid);
            // After revoking, refresh the session list
            await this.fetchSessions();
        } catch (e: any) {
            this.error = e.message;
        }
    }

    async revokeOtherSessions() {
        try {
            await this.revokeOtherSessionsUseCase.execute();
            // After revoking others, refresh the session list
            await this.fetchSessions();
        } catch (e: any) {
            this.error = e.message;
        }
    }

    async approveSession(sid: string) {
        try {
            await this.approveSessionUseCase.execute(sid);
            // After approving, refresh the session list
            await this.fetchSessions();
        } catch (e: any) {
            this.error = e.message;
        }
    }
}
