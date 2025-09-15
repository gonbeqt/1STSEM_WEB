// src/data/repositories/WalletRepository.tsx
import { Wallet, ConnectWalletRequest, ReconnectWalletRequest, ReconnectWalletResponse, GetWalletsListResponse } from "../../domain/entities/WalletEntities";
import { WalletResponse } from "../../domain/entities/WalletEntities";

export interface WalletRepository {
    connectWallet(request: ConnectWalletRequest): Promise<WalletResponse>;
    reconnectWallet(request: ReconnectWalletRequest): Promise<ReconnectWalletResponse>;
    getWalletBalance(token: string): Promise<GetWalletsListResponse>;
}