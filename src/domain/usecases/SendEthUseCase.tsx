import { WalletRepository } from '../repositories/WalletRepository';
import { SendEthRequest, SendEthResponse } from '../entities/WalletEntities';

export class SendEthUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(request: SendEthRequest): Promise<SendEthResponse> {
    // Implement the logic to send ETH using the walletRepository
    // This will involve calling a method on walletRepository to send the transaction
    // and handling the response.
    return this.walletRepository.sendEth(request);
  }
}