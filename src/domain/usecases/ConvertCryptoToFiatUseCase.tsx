import { WalletRepository } from '../repositories/WalletRepository';
import { ConversionRequest, ConversionResponse } from '../entities/WalletEntities';

export class ConvertCryptoToFiatUseCase {
  constructor(private walletRepository: WalletRepository) {}

  async execute(request: ConversionRequest): Promise<ConversionResponse> {
    return this.walletRepository.convertCryptoToFiat(request);
  }
}
