import { ListSessionsUseCase } from '../usecases/ListSessionsUseCase';
import { RevokeSessionUseCase } from '../usecases/RevokeSessionUseCase';
import { RevokeOtherSessionsUseCase } from '../usecases/RevokeOtherSessionsUseCase';
import { ApproveSessionUseCase } from '../usecases/ApproveSessionUseCase';
import { TransferMainDeviceUseCase } from '../usecases/TransferMainDeviceUseCase';
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
        private approveSessionUseCase: ApproveSessionUseCase,
        private transferMainDeviceUseCase: TransferMainDeviceUseCase
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

    async transferMainDevice(sid: string) {
        try {
            await this.transferMainDeviceUseCase.execute(sid);
            await this.fetchSessions();
        } catch (e: any) {
            this.error = e.message;
        }
    }
}
