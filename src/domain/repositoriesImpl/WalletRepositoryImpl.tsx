// src/domain/repositoriesImpl/WalletRepositoryImpl.tsx
import { WalletRepository } from '../../data/repositories/WalletRepository';
import { ConnectWalletRequest } from '../entities/WalletEntities';
import { WalletResponse, WalletListResponse, DisconnectWalletRequest, DisconnectWalletResponse } from '../entities/WalletEntities';

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

  async getWallets(): Promise<WalletListResponse> {
    const response = await fetch(`${this.API_URL}/wallets/list/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch wallets');
    }

    return data;
  }

  async disconnectWallet(request: DisconnectWalletRequest): Promise<DisconnectWalletResponse> {
    const response = await fetch(`${this.API_URL}/wallets/disconnect/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to disconnect wallet');
    }

    return data;
  }
}