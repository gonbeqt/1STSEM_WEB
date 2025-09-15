// src/domain/repositoriesImpl/WalletRepositoryImpl.tsx
import { WalletRepository } from '../../data/repositories/WalletRepository';
import { ConnectWalletRequest, GetWalletsResponse, ReconnectWalletRequest, ReconnectWalletResponse, WalletResponse, GetWalletsListResponse } from '../entities/WalletEntities';

export class WalletRepositoryImpl implements WalletRepository {


  private readonly API_URL = 'http://localhost:8000/api';

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

  async getWalletBalance(): Promise<GetWalletsListResponse> {
    const response = await fetch(`${this.API_URL}/wallets/get_wallet_balance/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch wallet balance');
    }

    return data;
  }
}