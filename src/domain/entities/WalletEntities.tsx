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

export interface GetWalletBalanceResponse {
  success: boolean;
  data: {
    wallet_address: string;
    balance_eth: string;
    balance_wei: string;
    user_id: string;
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

export interface WalletBalance {
  wallet_address: string;
  eth_balance: number;
  usd_balance: number;
}

export interface GetWalletsResponse {
  wallets: WalletBalance[];
}

export interface SendEthRequest {
  to_address: string;
  amount: string; // Amount in ETH
  gas_price?: number; // Gwei, optional
  gas_limit?: number; // Optional
  company?: string;
  category?: string;
  description?: string;
  is_investing?: boolean;
  investor_name?: string;
}

export interface CryptoToFiatAnalysis {
  fiat_amount: number;
  fiat_currency: string;
  gas_fee_fiat: number;
  total_cost_fiat: number;
  exchange_rate: number;
  conversion_timestamp: string;
}

export interface LlmAnalysis {
  tax_category: string;
  is_business_expense: boolean;
  crypto_to_fiat: CryptoToFiatAnalysis;
  ai_classification?: string;
  ai_confidence?: number;
  ai_reasoning?: string;
  ai_tags?: string[];
  ai_metadata?: any;
  is_ai_analyzed?: boolean;
}

export interface TaxDeductionsSummary {
  gross_amount: number;
  deductions: Record<string, number>;
  total_tax_amount: number;
  net_amount: number;
  total_cost_with_tax: number;
  tax_rates_applied: Record<string, number>;
  tax_config_source: string;
}

export interface SendEthResponse {
  success: boolean;
  message: string;
  data?: {
    transaction_hash: string;
    from_address: string;
    from_wallet_name: string;
    to_address: string;
    amount_eth: number;
    gas_price_gwei: number;
    gas_limit: number;
    gas_used: number;
    gas_cost_eth: number;
    total_cost_eth: number;
    status: string;
    chain_id: number;
    nonce: number;
    company: string;
    category: string;
    description: string;
    timestamp: string;
    explorer_url?: string;
    accounting_processed?: boolean;
    used_connected_wallet?: boolean;
    user_role?: string;
    wallet_type?: string;
    llm_analysis?: LlmAnalysis;
    tax_deductions?: TaxDeductionsSummary;
  };
}

export interface DisconnectWalletResponse {
  success: boolean;
  message: string;
  deleted_count: number;
}

export interface ConversionRequest {
  amount: number;
  from_currency: string;
  to_currency: string;
}

export interface ConversionResponse {
  success: boolean;
  content?: {
    quantity: number;
    crypto: string;
    total_value: number;
    fiat: string;
    unit_price: number;
  }[];
  error?: string;
}