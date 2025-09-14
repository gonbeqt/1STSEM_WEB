// src/domain/entities/WalletRequest.tsx
export interface ConnectWalletRequest {
  private_key: string;
  wallet_name?: string;
  wallet_type?: string;
}

// src/domain/entities/WalletResponse.tsx
export interface WalletData {
  wallet_id: string;
  user_id: string;
  username: string;
  wallet_address: string;
  wallet_name: string;
  wallet_type: string;
  action: 'created' | 'updated';
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: WalletData;
}

export interface WalletListResponse {
  success: boolean;
  message: string;
  data: {
    wallets: WalletData[];
    total_count: number;
  };
}

// src/domain/entities/Wallet.tsx
export interface Wallet {
  id: string;
  userId: string;
  name: string;
  address: string;
  walletType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DisconnectWalletRequest {
  wallet_id: string;
}

export interface DisconnectWalletResponse {
  success: boolean;
  message: string;
}