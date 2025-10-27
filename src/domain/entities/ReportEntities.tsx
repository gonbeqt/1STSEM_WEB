export interface BalanceSheetAssets {
  current_assets: {
    crypto_holdings: Record<string, CryptoHolding>;
    cash_and_equivalents?: number;
    accounts_receivable?: number;
    inventory?: number;
    other_current_assets?: number;
    total: number;
  };
  non_current_assets?: {
    property_plant_equipment?: number;
    intangible_assets?: number;
    long_term_investments?: number;
    other_non_current_assets?: number;
    total?: number;
  };
  total?: number;
}

export interface BalanceSheetLiabilities {
  current_liabilities: {
    accounts_payable?: number;
    short_term_debt?: number;
    accrued_expenses?: number;
    other_current_liabilities?: number;
    [key: string]: number | undefined;
  };
  long_term_liabilities?: {
    long_term_debt?: number;
    deferred_tax_liabilities?: number;
    other_long_term_liabilities?: number;
    [key: string]: number | undefined;
  };
  total: number;
}

export interface BalanceSheetEquity {
  retained_earnings: number;
  common_stock?: number;
  additional_paid_in_capital?: number;
  other_equity?: number;
  total: number;
}

export interface BalanceSheetTotals {
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  balance_check: number;
}

export interface BalanceSheetData {
  balance_sheet_id: string;
  as_of_date: string;
  currency: string;
  assets: BalanceSheetAssets;
  liabilities: BalanceSheetLiabilities;
  equity: BalanceSheetEquity;
  totals: BalanceSheetTotals;
  metadata?: Record<string, unknown>;
}

export interface CryptoHolding {
  balance: number;
  current_value: number;
  cost_basis?: number;
  unrealized_gain_loss: number;
}

export interface CashFlowStatement {
  cash_flow_id: string;
  period_start: string;
  period_end: string;
  generated_at: string;
  currency: string;
  operating_activities: {
    cash_receipts: {
      customer_payments: number;
      invoice_collections: number;
      other_income: number;
      total: number;
    };
    cash_payments: {
      payroll_payments: number;
      supplier_payments: number;
      operating_expenses: number;
      tax_payments: number;
      other_expenses: number;
      total: number;
    };
    net_cash_flow: number;
  };
  investing_activities: {
    cash_receipts: {
      asset_sales: number;
      investment_returns: number;
      crypto_sales: number;
      total: number;
    };
    cash_payments: {
      asset_purchases: number;
      crypto_purchases: number;
      investment_purchases: number;
      total: number;
    };
    net_cash_flow: number;
  };
  financing_activities: {
    cash_receipts: {
      owner_contributions: number;
      loans_received: number;
      other_financing: number;
      total: number;
    };
    cash_payments: {
      owner_withdrawals: number;
      loan_payments: number;
      dividend_payments: number;
      total: number;
    };
    net_cash_flow: number;
  };
  cash_summary: {
    beginning_cash: number;
    net_cash_from_operations: number;
    net_cash_from_investing: number;
    net_cash_from_financing: number;
    net_change_in_cash: number;
    ending_cash: number;
  };
  analysis?: {
    cash_flow_health: string;
    operating_cash_ratio: number;
    free_cash_flow: number;
    cash_flow_composition: {
      operating_percentage: number;
      investing_percentage: number;
      financing_percentage: number;
    };
    liquidity_position: string;
    key_insights: string[];
  };
  ai_insights?: string;
  metadata?: {
    transaction_count: number;
    payroll_entries: number;
    invoice_payments: number;
    period_days: number;
  };
}

export interface TaxReport {
  report_id: string;
  user_id: string;
  report_type: 'ANNUAL' | 'QUARTERLY' | 'CUSTOM' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  start_date: string;
  end_date: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  generated_at: string;
  total_gains: number;
  total_losses: number;
  net_pnl: number;
  total_income: number;
  total_expenses: number;
  llm_analysis?: {
    tax_optimization_tips: string[];
    compliance_status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
  };
  metadata?: {
    transaction_count: number;
    accounting_method: 'FIFO' | 'LIFO' | 'SPECIFIC_ID';
    tax_year: number;
    calculations: Record<string, any>;
  };
}

export interface GenerateBalanceSheetRequest {
  as_of_date?: string;
  include_all_assets?: boolean;
  format?: 'detailed' | 'summary';
}

export interface GenerateBalanceSheetResponse {
  success: boolean;
  balance_sheet: BalanceSheetData;
  message?: string;
  error?: string;
}

export interface GenerateCashFlowRequest {
  start_date?: string;
  end_date?: string;
}

export interface GenerateCashFlowResponse {
  success: boolean;
  cash_flow_statement: CashFlowStatement;
  message?: string;
  error?: string;
}

export interface GenerateTaxReportRequest {
  start_date: string;
  end_date: string;
  report_type: 'ANNUAL' | 'QUARTERLY' | 'CUSTOM' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  accounting_method?: 'FIFO' | 'LIFO' | 'SPECIFIC_ID';
  include_ai_analysis?: boolean;
}

export interface GenerateTaxReportResponse {
  success: boolean;
  report: TaxReport;
  message?: string;
  error?: string;
}

export interface ExportReportRequest {
  report_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface ExportReportResponse {
  success: boolean;
  excel_data?: string; // Base64 encoded
  pdf_data?: string;   // Base64 encoded
  filename: string;
  content_type: string;
  message?: string;
  error?: string;
}

export interface ListReportsResponse {
  success: boolean;
  balance_sheets?: BalanceSheetData[];
  cash_flow_statements?: CashFlowStatement[];
  income_statements?: any[];
  tax_reports?: TaxReport[];
  count: number;
  error?: string;
}

export interface ListBalanceSheetsParams {
  report_type?: string;
  limit?: number;
}

export interface TaxAnalysisRequest {
  period_type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
  date?: string;
  start_date?: string;
  end_date?: string;
  year?: number;
  month?: number;
  compare_previous?: boolean;
  include_projections?: boolean;
  accounting_method?: 'FIFO' | 'LIFO' | 'SPECIFIC_ID';
}

export interface TaxAnalysisResponse {
  success: boolean;
  period_type: string;
  analysis: {
    executive_summary: string;
    performance_breakdown: {
      total_gains?: number;
      total_losses?: number;
      net_profit?: number;
      weekly_gains?: number;
      weekly_losses?: number;
      net_weekly_pnl?: number;
      monthly_gains?: number;
      monthly_losses?: number;
      net_monthly_pnl?: number;
      yearly_gains?: number;
      yearly_losses?: number;
      net_yearly_pnl?: number;
    };
    recommendations: string[];
    previous_week_comparison?: {
      performance_change: string;
    };
    previous_month_comparison?: {
      performance_change: string;
    };
    previous_year_comparison?: {
      performance_change: string;
    };
  };
  metrics: {
    date?: string;
    transaction_count: number;
    daily_pnl?: number;
    weekly_pnl?: number;
    monthly_pnl?: number;
    yearly_pnl?: number;
  };
  error?: string;
}

export type RiskAnalysisPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskAnalysisAlert {
  id?: string;
  title: string;
  description?: string;
  severity: RiskSeverity;
  recommendation?: string;
  category?: string;
  metric_change?: string;
}

export interface RiskAnalysisMetrics {
  [metric: string]: number | string | null | undefined;
}

export interface RiskAnalysisOverview {
  analysis_id?: string;
  period_type: RiskAnalysisPeriod;
  generated_at?: string;
  summary?: string;
  ai_overview?: string;
  key_findings?: string[];
  risk_score?: number;
  risk_level?: RiskSeverity;
  liquidity_risk?: number;
  cash_flow_risk?: number;
  compliance_risk?: number;
  alerts?: RiskAnalysisAlert[];
  recommendations?: string[];
  action_items?: string[];
  metrics?: RiskAnalysisMetrics;
  metadata?: Record<string, any>;
}

export interface RiskAnalysisGenerateRequest {
  date?: string;
  start_date?: string;
  year?: number;
  month?: number;
  quarter?: number;
}

export interface RiskAnalysisResponse {
  success: boolean;
  period_type: RiskAnalysisPeriod;
  risk_analysis: RiskAnalysisOverview;
  message?: string;
  error?: string;
}

export interface RiskAnalysisHistoryEntry {
  analysis_id: string;
  period_type: RiskAnalysisPeriod;
  generated_at: string;
  risk_level?: RiskSeverity;
  risk_score?: number;
  summary?: string;
  metadata?: Record<string, any>;
}

export interface RiskAnalysisHistoryParams {
  period_type?: RiskAnalysisPeriod;
  limit?: number;
  date?: string;
  start_date?: string;
  year?: number;
  month?: number;
  quarter?: number;
}

export interface RiskAnalysisHistoryResponse {
  success: boolean;
  risk_analyses: RiskAnalysisHistoryEntry[];
  count: number;
  error?: string;
}