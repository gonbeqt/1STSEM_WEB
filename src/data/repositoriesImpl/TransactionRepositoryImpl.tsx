import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { TransactionHistoryRequest, TransactionHistoryResponse } from '../../domain/entities/TransactionEntities';

export class TransactionRepositoryImpl implements TransactionRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getTransactionHistory(request: TransactionHistoryRequest): Promise<TransactionHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (request.wallet_id) queryParams.append('wallet_id', request.wallet_id);
    if (request.limit) queryParams.append('limit', request.limit.toString());
    if (request.offset) queryParams.append('offset', request.offset.toString());
    if (request.status) queryParams.append('status', request.status);
    
    // Always send a valid category - default to 'all' if not specified
    // Convert to lowercase to match backend expectations
    const category = (request.category || 'all').toLowerCase();
    queryParams.append('category', category);

    // Use the correct endpoint that matches your backend
    const url = `${this.API_URL}/eth/history/?${queryParams.toString()}`;
    
    console.log('Transaction history request:', {
      url,
      category,
      request
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Transaction history API response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      url: response.url
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const data = await response.json();
        console.log('Error response data:', data);
        errorMessage = data.error || data.message || errorMessage;
      } catch (parseError) {
        console.log('Could not parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Success response data:', data);
    return data;
  }
}