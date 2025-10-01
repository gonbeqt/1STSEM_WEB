export interface Transaction {
  _id: string;
  transaction_hash: string;
  from_address: string;
  to_address: string;
  amount: number;
  token_symbol: string;
  token_address?: string;
  gas_price?: number;
  gas_used?: number;
  transaction_fee?: number;
  block_number?: number;
  block_hash?: string;
  transaction_index?: number;
  status: 'pending' | 'confirmed' | 'failed';
  transaction_type: 'transfer' | 'salary' | 'bonus' | 'expense' | 'other';
  description?: string;
  timestamp: string;
  confirmation_count?: number;
  usd_value?: number;
  exchange_rate?: number;
  network: 'ethereum' | 'polygon' | 'bsc';
  created_at: string;
  updated_at?: string;
  
  // Additional fields that might be added by the API
  user_id?: string;
  from_wallet_id?: string;
  from_wallet_name?: string;
  from_wallet_type?: string;
  transaction_category?: 'SENT' | 'RECEIVED' | 'TRANSFER' | 'EXTERNAL';
  category_description?: string;
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
    category: string;
    transactions: Transaction[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
  };
}