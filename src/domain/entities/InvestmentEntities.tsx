export interface InvestmentRecord {
  transaction_hash?: string;
  timestamp?: string;
  from_address?: string;
  to_address?: string;
  direction: 'SENT' | 'RECEIVED';
  amount: number;
  currency?: string;
  investor_name?: string;
  company_name?: string;
  number?: string;
  recipient_name?: string;
  recipient_company?: string;
  description_receiver_pov?: string;
}

export interface InvestmentReportResponse {
  success: boolean;
  count?: number;
  investments: InvestmentRecord[];
  error?: string;
}

export interface InvestmentReportRequest {
  start_date?: string;
  end_date?: string;
}
