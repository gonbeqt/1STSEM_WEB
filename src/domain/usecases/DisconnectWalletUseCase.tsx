import { WalletRepository } from '../../data/repositories/WalletRepository';
import { DisconnectWalletRequest, DisconnectWalletResponse } from '../entities/WalletEntities';

export class DisconnectWalletUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(request: DisconnectWalletRequest): Promise<DisconnectWalletResponse> {
    if (!request.wallet_id) {
      throw new Error('Wallet ID is required');
    }

    return await this.walletRepository.disconnectWallet(request);
  }
}