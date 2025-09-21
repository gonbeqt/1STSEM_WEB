import { WalletRepository } from '../repositories/WalletRepository';
import { ConnectWalletRequest } from '../entities/WalletEntities';
import { WalletResponse } from '../entities/WalletEntities';

export class ConnectWalletUseCase {
  constructor(private walletRepository: WalletRepository) {}

    async execute(request: ConnectWalletRequest): Promise<WalletResponse> {
    return await this.walletRepository.connectWallet(request);
  }
}