import { WalletRepository } from '../repositories/WalletRepository';
import { GetWalletsListResponse } from '../entities/WalletEntities';

export class GetWalletBalanceUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(token: string): Promise<GetWalletsListResponse> {
    return this.walletRepository.getWalletBalance(token);
  }
}