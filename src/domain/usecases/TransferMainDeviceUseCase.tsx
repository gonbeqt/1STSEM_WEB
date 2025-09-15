import { SessionRepository } from "../../data/repositories/SessionRepository";

export class TransferMainDeviceUseCase {
    constructor(private sessionRepository: SessionRepository) {}

    async execute(sid: string): Promise<void> {
        await this.sessionRepository.transferMainDevice(sid);
    }
}
