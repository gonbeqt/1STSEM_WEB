import { ApiService } from '../api/ApiService';
import {
  ConnectWalletRequest,
  WalletResponse,
  GetWalletBalanceResponse,
  SendEthRequest,
  SendEthResponse,
  DisconnectWalletResponse,
  ConversionRequest,
  ConversionResponse,
} from '../../domain/entities/WalletEntities';

export class WalletRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async connectWallet(request: ConnectWalletRequest): Promise<WalletResponse> {
    const data = await this.api.post<WalletResponse>(`${this.apiUrl}/wallets/connect_wallet/`, request);
    return data;
  }

  async getWalletBalance(token: string): Promise<GetWalletBalanceResponse> {
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const data = await this.api.get<GetWalletBalanceResponse>(`${this.apiUrl}/wallets/get_wallet_balance/`);
    return data;
  }

  async sendEth(request: SendEthRequest): Promise<SendEthResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const toAddress = request.to_address?.trim();
    if (!toAddress) {
      throw new Error('Recipient address is required.');
    }

    if (!(toAddress.startsWith('0x') && toAddress.length === 42)) {
      throw new Error('Invalid recipient address format.');
    }

    const normalizedAmount = request.amount?.toString().trim();
    const amountValue = Number(normalizedAmount);
    if (!normalizedAmount || Number.isNaN(amountValue) || amountValue <= 0) {
      throw new Error('Amount must be greater than 0.');
    }

    const company = request.company?.trim();
    const category = request.category?.trim() || 'BUSINESS_PAYMENT';
    const description = request.description?.trim();
    const investorName = request.investor_name?.trim();

    // Auto-align investing metadata with backend classification rules.
    const isInvesting = Boolean(request.is_investing || investorName);

    const gasPrice = request.gas_price !== undefined ? Number(request.gas_price) : undefined;
    const gasLimit = request.gas_limit !== undefined ? Number(request.gas_limit) : undefined;

    if (gasPrice !== undefined && (Number.isNaN(gasPrice) || gasPrice < 0)) {
      throw new Error('Invalid gas price.');
    }

    if (gasLimit !== undefined && (Number.isNaN(gasLimit) || gasLimit < 0)) {
      throw new Error('Invalid gas limit.');
    }

    const backendRequest = {
      to_address: toAddress,
      amount: normalizedAmount,
      gas_price: gasPrice,
      gas_limit: gasLimit,
      company: company || undefined,
      category,
      description: description || undefined,
      is_investing: isInvesting,
      investor_name: investorName || undefined,
    };

    const url = `${this.apiUrl}/eth/send/`;
    const data = await this.api.post<SendEthResponse>(url, backendRequest);
    return data;
  }

  async disconnectWallet(token: string): Promise<DisconnectWalletResponse> {
    const data = await this.api.delete<DisconnectWalletResponse>(`${this.apiUrl}/wallets/disconnect_wallet/`);
    return data;
  }

  async convertCryptoToFiat(request: ConversionRequest): Promise<ConversionResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const data = await this.api.post<ConversionResponse>(`${this.apiUrl}/conversion/crypto-to-fiat/`, request);
    return data;
  }
}
