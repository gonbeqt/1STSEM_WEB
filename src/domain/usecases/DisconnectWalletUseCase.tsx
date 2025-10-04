import { WalletRepository } from '../repositories/WalletRepository';
import { DisconnectWalletResponse } from '../entities/WalletEntities';

export class DisconnectWalletUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(token: string): Promise<DisconnectWalletResponse> {
    return this.walletRepository.disconnectWallet(token);
  }
}
