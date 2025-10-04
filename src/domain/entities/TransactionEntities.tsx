export interface Transaction {
  _id: string;
  transaction_hash: string;
  from_address: string;
  to_address: string;
  amount_eth: number;
  gas_price_gwei: number;
  gas_limit: number;
  gas_used: number;
  gas_cost_eth: number;
  total_cost_eth: number;
  status: 'pending' | 'confirmed' | 'failed';
  chain_id: number;
  nonce: number;
  company?: string;
  category: string;
  description?: string;
  is_investing?: boolean;
  created_at: string;
  explorer_url?: string;
  
  // Enhanced fields from new backend
  user_id: string;
  from_wallet_id?: string;
  from_wallet_name?: string;
  from_wallet_type?: string;
  transaction_category: 'SENT' | 'RECEIVED' | 'TRANSFER' | 'EXTERNAL';
  category_description: string;
  counterparty_name?: string;
  counterparty_role?: string;
  
  // AI Analysis data
  ai_analysis: {
    classification: string;
    confidence: number;
    reasoning: string;
    tags: string[];
    metadata: any;
    is_analyzed: boolean;
    analysis_timestamp: string;
    crypto_to_fiat: {
      fiat_amount: number;
      fiat_currency: string;
      gas_fee_fiat: number;
      total_cost_fiat: number;
      exchange_rate: number;
      conversion_timestamp: string;
    };
  };
}

export interface TransactionHistoryRequest {
  wallet_id?: string;
  limit?: number;
  offset?: number;
  status?: 'confirmed' | 'pending' | 'failed';
  category?: 'SENT' | 'RECEIVED' | 'TRANSFER' | 'ALL';
}

export interface TransactionHistoryResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    username: string;
    transactions: Transaction[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
    filters: {
      category_filter?: string;
      status_filter?: string;
      wallet_id?: string;
    };
  };
}