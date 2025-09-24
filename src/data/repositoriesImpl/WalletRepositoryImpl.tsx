// src/domain/repositoriesImpl/WalletRepositoryImpl.tsx
import { ConnectWalletRequest, ReconnectWalletRequest, ReconnectWalletResponse, WalletResponse, GetWalletsListResponse, SendEthRequest, SendEthResponse } from '../../domain/entities/WalletEntities';
import { WalletRepository } from '../../domain/repositories/WalletRepository';
 
import { SendETHRequest, SendETHResponse } from '../../domain/entities/SendEthEntities'; 


export class WalletRepositoryImpl implements WalletRepository {


  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async connectWallet(request: ConnectWalletRequest): Promise<WalletResponse> {
    const response = await fetch(`${this.API_URL}/wallets/connect_wallet_with_private_key/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    const data = await response.json();
    console.log('Connect Wallet Response:', data);
    if (!response.ok) {
      throw new Error(data.error || 'Failed to connect wallet');
    }

    return data;
  }
  async reconnectWallet(request: ReconnectWalletRequest): Promise<ReconnectWalletResponse> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.API_URL}/wallets/reconnect_wallet_with_private_key/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Wallet reconnection failed');
    }

    return data;
  }

  async getWalletBalance(token: string): Promise<GetWalletsListResponse> {
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

    const backendRequest: SendETHRequest = {
      to_address: request.recipient_address,
      amount: request.amount,
      private_key: request.private_key,
      from_address: request.from_address || undefined,
      company: request.company || undefined,
      category: request.category || undefined,
      description: request.description || undefined,
    };

    const response = await fetch(`${this.API_URL}/eth/send/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(backendRequest),
    });

    const data: SendETHResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send ETH transaction');
    }

    return {
        success: data.success,
        message: data.message,
        transaction_hash: data.data ? data.data.transaction_hash : undefined,
    };
  }
}