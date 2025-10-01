export interface ConnectWalletRequest {
  private_key: string;
  wallet_name?: string;
  wallet_type?: string;
}

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

export interface EthBalanceData {
  balance: string;
  name: string;
  symbol: string;
  usd_value: number;
}

export interface WalletBalancesData {
  ETH: EthBalanceData;
  // Add other currencies if needed
}

export interface ApiWalletData {
  address: string;
  balances: WalletBalancesData;
  name: string;
  wallet_id: string;
  wallet_type: string;
}

export interface GetWalletsListResponse {
  success: boolean;
  message: string;
  data: {
    wallets: ApiWalletData[];
    total_count: number;
  };
}

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

export interface ReconnectWalletRequest {
  private_key: string;
}

export interface ReconnectWalletResponse {
  success: boolean;
  message: string;
  data: {
    wallet_id: string;
    user_id: string;
    username: string;
    wallet_address: string;
    wallet_name: string;
    wallet_type: string;
    action: 're_authenticated';
    last_authenticated: string;
  };
}

export interface WalletBalance {
  wallet_address: string;
  eth_balance: number;
  usd_balance: number;
}

export interface GetWalletsResponse {
  wallets: WalletBalance[];
}

export interface SendEthRequest {
  private_key: string;
  recipient_address: string;
  amount: string; // Amount in ETH
  from_address?: string;
  company?: string;
  category?: string;
  description?: string;
}

export interface SendEthResponse {
  success: boolean;
  message: string;
  transaction_hash?: string;
}