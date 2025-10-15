// src/domain/repositoriesImpl/WalletRepositoryImpl.tsx
import { ConnectWalletRequest, WalletResponse, GetWalletBalanceResponse, SendEthRequest, SendEthResponse, DisconnectWalletResponse, ConversionRequest, ConversionResponse } from '../../domain/entities/WalletEntities';
import { WalletRepository } from '../../domain/repositories/WalletRepository';
import apiService from '../api';
 


export class WalletRepositoryImpl implements WalletRepository {


  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;


  async connectWallet(request: ConnectWalletRequest): Promise<WalletResponse> {
    const data = await apiService.post<WalletResponse>(`${this.API_URL}/wallets/connect_wallet/`, request);
    return data;
  }

  async getWalletBalance(token: string): Promise<GetWalletBalanceResponse> {
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const data = await apiService.get<GetWalletBalanceResponse>(`${this.API_URL}/wallets/get_wallet_balance/`);
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

    const url = `${this.API_URL}/wallets/send_eth/`;
    const data = await apiService.post<SendEthResponse>(url, backendRequest);
    return data;
  }

  async disconnectWallet(token: string): Promise<DisconnectWalletResponse> {
   

    const data = await apiService.delete<DisconnectWalletResponse>(`${this.API_URL}/wallets/disconnect_wallet/`);
    return data;
  }

  async convertCryptoToFiat(request: ConversionRequest): Promise<ConversionResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const data = await apiService.post<ConversionResponse>(`${this.API_URL}/conversion/crypto-to-fiat/`, request);
    return data;
  }
}