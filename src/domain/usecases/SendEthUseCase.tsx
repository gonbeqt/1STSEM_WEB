import { WalletRepository } from '../repositories/WalletRepository';
import { SendEthRequest, SendEthResponse } from '../entities/WalletEntities';

export class SendEthUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(request: SendEthRequest): Promise<SendEthResponse> {
    return this.walletRepository.sendEth(request);
  }
}