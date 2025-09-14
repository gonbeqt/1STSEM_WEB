import { WalletRepository } from '../../data/repositories/WalletRepository';
import { WalletListResponse } from '../entities/WalletEntities';

export class GetWalletsUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(): Promise<WalletListResponse> {
    return await this.walletRepository.getWallets();
  }
}