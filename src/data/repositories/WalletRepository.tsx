// src/data/repositories/WalletRepository.tsx
import { ConnectWalletRequest } from '../../domain/entities/WalletEntities';
import { WalletResponse, WalletListResponse, DisconnectWalletRequest, DisconnectWalletResponse } from '../../domain/entities/WalletEntities';

export interface WalletRepository {
  connectWallet(request: ConnectWalletRequest): Promise<WalletResponse>;
  getWallets(): Promise<WalletListResponse>;
  disconnectWallet(request: DisconnectWalletRequest): Promise<DisconnectWalletResponse>;
}