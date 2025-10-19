// src/domain/repositoriesImpl/WalletRepositoryImpl.tsx
import { ConnectWalletRequest, WalletResponse, GetWalletBalanceResponse, SendEthRequest, SendEthResponse, DisconnectWalletResponse, ConversionRequest, ConversionResponse } from '../../domain/entities/WalletEntities';
import { WalletRepository } from '../../domain/repositories/WalletRepository';
import { WalletRemoteDataSource } from '../datasources/WalletRemoteDataSource';

export class WalletRepositoryImpl implements WalletRepository {
  constructor(private readonly remote: WalletRemoteDataSource) {}

  async connectWallet(request: ConnectWalletRequest): Promise<WalletResponse> {
    return this.remote.connectWallet(request);
  }

  async getWalletBalance(token: string): Promise<GetWalletBalanceResponse> {
    return this.remote.getWalletBalance(token);
  }

  async sendEth(request: SendEthRequest): Promise<SendEthResponse> {
    return this.remote.sendEth(request);
  }

  async disconnectWallet(token: string): Promise<DisconnectWalletResponse> {
    return this.remote.disconnectWallet(token);
  }

  async convertCryptoToFiat(request: ConversionRequest): Promise<ConversionResponse> {
    return this.remote.convertCryptoToFiat(request);
  }
}