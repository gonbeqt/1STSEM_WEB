import { WalletRepository } from '../../data/repositories/WalletRepository';
import { GetWalletsResponse, GetWalletsListResponse } from '../entities/WalletEntities';

export class GetWalletBalanceUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(token: string): Promise<GetWalletsListResponse> {
    return this.walletRepository.getWalletBalance(token);
  }
}