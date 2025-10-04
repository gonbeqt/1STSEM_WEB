import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { TransactionHistoryRequest, TransactionHistoryResponse } from '../../domain/entities/TransactionEntities';

export class TransactionRepositoryImpl implements TransactionRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    console.log('🔑 Transaction API Auth Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.warn('⚠️ No authentication token found for transaction API');
    }
    
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
    
    // Remove category filtering - get all transactions
    // Don't send category parameter to backend

    // Use the correct endpoint that matches your backend
    const url = `${this.API_URL}/eth/history/?${queryParams.toString()}`;
    
    console.log('🔍 Fetching all transaction history (no category filter):', { url });

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const data = await response.json();
        console.log('Error response data:', data);
        
        // Ensure error message is always a string
        if (data.error && typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data.message && typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.detail && typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
        
        console.log('🚨 Transaction API Error:', errorMessage);
        
        // Handle specific error cases
        if (response.status === 403) {
          console.error('🔒 Access forbidden - check user permissions and authentication');
          errorMessage = 'Access denied. Please check your permissions or try logging in again.';
        } else if (response.status === 401) {
          console.error('🔐 Unauthorized - authentication required');
          errorMessage = 'Authentication required. Please log in again.';
        }
      } catch (parseError) {
        console.log('Could not parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Transaction history API success:', `${response.status} ${response.statusText}`);
    return data;
  }
}