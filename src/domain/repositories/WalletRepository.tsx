// src/data/repositories/WalletRepository.tsx
import { Wallet, ConnectWalletRequest, ReconnectWalletRequest, ReconnectWalletResponse, GetWalletsListResponse, SendEthRequest, SendEthResponse } from "../entities/WalletEntities";
import { WalletResponse } from "../entities/WalletEntities";

export interface WalletRepository {
    connectWallet(request: ConnectWalletRequest): Promise<WalletResponse>;
    reconnectWallet(request: ReconnectWalletRequest): Promise<ReconnectWalletResponse>;
    getWalletBalance(token: string): Promise<GetWalletsListResponse>;
    sendEth(request: SendEthRequest): Promise<SendEthResponse>;
    // Added sendEth method - forcing re-evaluation
}