// src/domain/usecases/ReconnectWalletUseCase.tsx
import { WalletRepository } from '../repositories/WalletRepository';
import { ReconnectWalletRequest } from '../entities/WalletEntities';
import { ReconnectWalletResponse } from '../entities/WalletEntities';

export class ReconnectWalletUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(request: ReconnectWalletRequest): Promise<ReconnectWalletResponse> {
    // Validate private key format (basic validation)
    if (!request.private_key || request.private_key.trim() === '') {
      throw new Error('Private key is required');
    }

    // Basic hex validation for private key
    const hexRegex = /^0x[a-fA-F0-9]{64}$|^[a-fA-F0-9]{64}$/;
    if (!hexRegex.test(request.private_key)) {
      throw new Error('Invalid private key format');
    }

    return await this.walletRepository.reconnectWallet(request);
  }
}