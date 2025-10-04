import { WalletRepository } from '../repositories/WalletRepository';
import { GetWalletBalanceResponse } from '../entities/WalletEntities';

export class GetWalletBalanceUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(token: string): Promise<GetWalletBalanceResponse> {
    return this.walletRepository.getWalletBalance(token);
  }
}