import { Wallet, ConnectWalletRequest, GetWalletsListResponse, GetWalletBalanceResponse, SendEthRequest, SendEthResponse, DisconnectWalletResponse, ConversionRequest, ConversionResponse } from "../entities/WalletEntities";
import { WalletResponse } from "../entities/WalletEntities";

export interface WalletRepository {
    connectWallet(request: ConnectWalletRequest): Promise<WalletResponse>;
    getWalletBalance(token: string): Promise<GetWalletBalanceResponse>;
    sendEth(request: SendEthRequest): Promise<SendEthResponse>;
    disconnectWallet(token: string): Promise<DisconnectWalletResponse>;
    convertCryptoToFiat(request: ConversionRequest): Promise<ConversionResponse>;
}