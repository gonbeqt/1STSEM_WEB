// src/domain/repositoriesImpl/WalletRepositoryImpl.tsx
import { ConnectWalletRequest, WalletResponse, GetWalletBalanceResponse, SendEthRequest, SendEthResponse, DisconnectWalletResponse, ConversionRequest, ConversionResponse } from '../../domain/entities/WalletEntities';
import { WalletRepository } from '../../domain/repositories/WalletRepository';
 


export class WalletRepositoryImpl implements WalletRepository {


  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async connectWallet(request: ConnectWalletRequest): Promise<WalletResponse> {
    const response = await fetch(`${this.API_URL}/wallets/connect_wallet/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to connect wallet');
    }

    return data;
  }

  async getWalletBalance(token: string): Promise<GetWalletBalanceResponse> {
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const response = await fetch(`${this.API_URL}/wallets/get_wallet_balance/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch wallet balance');
    }

    return data;
  }

  async sendEth(request: SendEthRequest): Promise<SendEthResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

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
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(backendRequest),
    });
    
    

    const data: SendEthResponse = await response.json();

    if (!response.ok) {
      console.error('Send ETH failed:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw new Error(data.message || `Failed to send ETH transaction: ${response.status} ${response.statusText}`);
    }

    return {
        success: data.success,
        message: data.message,
        data: data.data,
    };
  }

  async disconnectWallet(token: string): Promise<DisconnectWalletResponse> {
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const response = await fetch(`${this.API_URL}/wallets/disconnect_wallet/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to disconnect wallet');
    }

    return data;
  }

  async convertCryptoToFiat(request: ConversionRequest): Promise<ConversionResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const response = await fetch(`${this.API_URL}/conversion/crypto-to-fiat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to convert crypto to fiat');
    }

    return data;
  }
}