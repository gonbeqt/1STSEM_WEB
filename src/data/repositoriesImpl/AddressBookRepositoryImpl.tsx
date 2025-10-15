import { AddressBookRepository } from '../../domain/repositories/AddressBookRepository';
import {
  UpsertAddressBookRequest,
  UpsertAddressBookResponse,
  ResolveAddressRequest,
  ResolveAddressResponse,
  ListAddressBookResponse,
  DeleteAddressBookRequest,
  DeleteAddressBookResponse
} from '../../domain/entities/AddressBookEntities';
import apiService from '../api';

export class AddressBookRepositoryImpl implements AddressBookRepository {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async upsertAddressBookEntry(request: UpsertAddressBookRequest): Promise<UpsertAddressBookResponse> {
    try {
      return await apiService.post<UpsertAddressBookResponse>(`${this.API_URL}/address-book/upsert/`, request);
    } catch (error) {
      console.error('Error upserting address book entry:', error);
      return { success: false, message: 'Network error occurred', error: 'Network error occurred' };
    }
  }

  async resolveAddressName(request: ResolveAddressRequest): Promise<ResolveAddressResponse> {
    try {
      const url = `${this.API_URL}/address-book/resolve/?address=${encodeURIComponent(request.address)}`;
      return await apiService.get<ResolveAddressResponse>(url);
    } catch (error) {
      console.error('Error resolving address name:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async listAddressBook(): Promise<ListAddressBookResponse> {
    try {
      return await apiService.get<ListAddressBookResponse>(`${this.API_URL}/address-book/list/`);
    } catch (error) {
      console.error('Error listing address book:', error);
      return { success: false, data: [], count: 0, error: 'Network error occurred' };
    }
  }

  async deleteAddressBookEntry(request: DeleteAddressBookRequest): Promise<DeleteAddressBookResponse> {
    try {
      return await apiService.delete<DeleteAddressBookResponse>(`${this.API_URL}/address-book/delete/`, request);
    } catch (error) {
      console.error('Error deleting address book entry:', error);
      return { success: false, message: 'Network error occurred', error: 'Network error occurred' };
    }
  }
}
