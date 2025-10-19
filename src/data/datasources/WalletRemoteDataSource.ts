import { ApiService } from '../api/ApiService';
import {
  ConnectWalletRequest,
  WalletResponse,
  GetWalletBalanceResponse,
  SendEthRequest,
  SendEthResponse,
  DisconnectWalletResponse,
  ConversionRequest,
  ConversionResponse,
} from '../../domain/entities/WalletEntities';

export class WalletRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async connectWallet(request: ConnectWalletRequest): Promise<WalletResponse> {
    const data = await this.api.post<WalletResponse>(`${this.apiUrl}/wallets/connect_wallet/`, request);
    return data;
  }

  async getWalletBalance(token: string): Promise<GetWalletBalanceResponse> {
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const data = await this.api.get<GetWalletBalanceResponse>(`${this.apiUrl}/wallets/get_wallet_balance/`);
    return data;
  }

  async sendEth(request: SendEthRequest): Promise<SendEthResponse> {
    const backendRequest = {
      to_address: request.to_address,
      amount: request.amount,
      gas_price: request.gas_price,
      gas_limit: request.gas_limit,
      company: request.company || undefined,
      category: request.category || undefined,
      description: request.description || undefined,
      is_investing: request.is_investing || false,
      investor_name: request.investor_name || undefined,
    };

    const url = `${this.apiUrl}/wallets/send_eth/`;
    const data = await this.api.post<SendEthResponse>(url, backendRequest);
    return data;
  }

  async disconnectWallet(token: string): Promise<DisconnectWalletResponse> {
    const data = await this.api.delete<DisconnectWalletResponse>(`${this.apiUrl}/wallets/disconnect_wallet/`);
    return data;
  }

  async convertCryptoToFiat(request: ConversionRequest): Promise<ConversionResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const data = await this.api.post<ConversionResponse>(`${this.apiUrl}/conversion/crypto-to-fiat/`, request);
    return data;
  }
}
