// src/domain/entities/SendETHEntities.tsx

export interface SendETHRequest {
  from_wallet_id?: string;
  from_address?: string;
  to_address: string;
  amount: string;
  private_key: string;
  gas_price?: string;
  gas_limit?: string;
  company?: string;
  category?: string;
  description?: string;
}

export interface SendETHResponse {
  success: boolean;
  message: string;
  data: {
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
    timestamp: string;
    explorer_url?: string;
    accounting_processed: boolean;
  };
}

export interface ETHTransaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  gasPrice: number;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}