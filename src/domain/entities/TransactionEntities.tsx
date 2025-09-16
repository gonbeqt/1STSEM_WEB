export interface Transaction {
  _id: string;
  user_id: string;
  from_wallet_id: string;
  from_wallet_name?: string;
  from_wallet_type?: string;
  to_address: string;
  amount: string;
  gas_limit: string;
  gas_price: string;
  transaction_hash?: string;
  status: 'confirmed' | 'pending' | 'failed';
  created_at: string;
  updated_at?: string;
  block_number?: number;
  gas_used?: string;
  transaction_fee?: string;
}

export interface TransactionHistoryRequest {
  wallet_id?: string;
  limit?: number;
  offset?: number;
  status?: 'confirmed' | 'pending' | 'failed';
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
  };
}