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
      const response = await fetch(`${this.API_URL}/address-book/upsert/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error upserting address book entry:', error);
      return {
        success: false,
        message: 'Network error occurred',
        error: 'Network error occurred'
      };
    }
  }

  async resolveAddressName(request: ResolveAddressRequest): Promise<ResolveAddressResponse> {
    try {
      const response = await fetch(`${this.API_URL}/address-book/resolve/?address=${encodeURIComponent(request.address)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error resolving address name:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  async listAddressBook(): Promise<ListAddressBookResponse> {
    try {
      const response = await fetch(`${this.API_URL}/address-book/list/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error listing address book:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: 'Network error occurred'
      };
    }
  }

  async deleteAddressBookEntry(request: DeleteAddressBookRequest): Promise<DeleteAddressBookResponse> {
    try {
      const response = await fetch(`${this.API_URL}/address-book/delete/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting address book entry:', error);
      return {
        success: false,
        message: 'Network error occurred',
        error: 'Network error occurred'
      };
    }
  }
}
