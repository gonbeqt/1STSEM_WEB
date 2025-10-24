import { ApiService } from '../api/ApiService';
import {
  UpsertAddressBookRequest,
  UpsertAddressBookResponse,
  ResolveAddressRequest,
  ResolveAddressResponse,
  ListAddressBookResponse,
  DeleteAddressBookRequest,
  DeleteAddressBookResponse,
} from '../../domain/entities/AddressBookEntities';

export class AddressBookRemoteDataSource {
  private readonly apiUrl = process.env.REACT_APP_API_BASE_URL;

  constructor(private readonly api: ApiService) {}

  async upsertAddressBookEntry(request: UpsertAddressBookRequest): Promise<UpsertAddressBookResponse> {
    try {
      const payload = {
        address: request.address?.toString().trim().toLowerCase(),
        name: request.name?.toString().trim(),
        role: request.role?.toString().trim() || 'investor',
        notes: request.notes?.toString().trim() || '',
      };

      if (!payload.address || !payload.name) {
        return { success: false, message: 'address and name are required', error: 'address and name are required' };
      }

      if (!(payload.address.startsWith('0x') && payload.address.length === 42)) {
        return { success: false, message: 'Invalid wallet address format', error: 'Invalid wallet address format' };
      }

      return await this.api.post<UpsertAddressBookResponse>(`${this.apiUrl}/address-book/upsert/`, payload);
    } catch (error) {
      console.error('Error upserting address book entry:', error);
      const msg = (error as any)?.response?.data?.error || (error as any)?.response?.data?.message || (error as any)?.message || 'Network error occurred';
      return { success: false, message: msg, error: msg };
    }
  }

  async resolveAddressName(request: ResolveAddressRequest): Promise<ResolveAddressResponse> {
    try {
      const address = request.address?.toString().trim().toLowerCase();
      if (!address) {
        return { success: false, data: null, message: 'address is required', error: 'address is required' };
      }

      if (!(address.startsWith('0x') && address.length === 42)) {
        return { success: false, data: null, message: 'Invalid wallet address format', error: 'Invalid wallet address format' };
      }

      const url = `${this.apiUrl}/address-book/resolve/?address=${encodeURIComponent(address)}`;
      return await this.api.get<ResolveAddressResponse>(url);
    } catch (error) {
      console.error('Error resolving address name:', error);
      const msg = (error as any)?.response?.data?.error || (error as any)?.message || 'Network error occurred';
      return { success: false, data: null, error: msg };
    }
  }

  async listAddressBook(): Promise<ListAddressBookResponse> {
    try {
      const primaryUrl = `${this.apiUrl}/address-book/list/`;
      try {
        return await this.api.get<ListAddressBookResponse>(primaryUrl);
      } catch (err) {
        const status = (err as any)?.response?.status;
        // If primary returned 404, attempt with an /api/ prefix (some deployments include it)
        if (status === 404) {
          const altUrl = `${this.apiUrl}/api/address-book/list/`;
          try {
            return await this.api.get<ListAddressBookResponse>(altUrl);
          } catch (err2) {
            console.error('Error listing address book (alt):', err2, 'url:', altUrl);
            throw err2;
          }
        }
        console.error('Error listing address book (primary):', err, 'url:', primaryUrl);
        throw err;
      }
    } catch (error) {
      console.error('Error listing address book:', error);
      const msg = (error as any)?.response?.data?.error || (error as any)?.message || 'Network error occurred';
      return { success: false, data: [], count: 0, error: msg };
    }
  }

  async deleteAddressBookEntry(request: DeleteAddressBookRequest): Promise<DeleteAddressBookResponse> {
    try {
      const address = request.address?.toString().trim().toLowerCase();
      if (!address) {
        return { success: false, message: 'address is required', error: 'address is required' };
      }

      if (!(address.startsWith('0x') && address.length === 42)) {
        return { success: false, message: 'Invalid wallet address format', error: 'Invalid wallet address format' };
      }

      return await this.api.delete<DeleteAddressBookResponse>(`${this.apiUrl}/address-book/delete/`, { address });
    } catch (error) {
      console.error('Error deleting address book entry:', error);
      const msg = (error as any)?.response?.data?.error || (error as any)?.message || 'Network error occurred';
      return { success: false, message: msg, error: msg };
    }
  }
}
