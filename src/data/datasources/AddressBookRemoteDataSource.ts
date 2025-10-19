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
      return await this.api.post<UpsertAddressBookResponse>(`${this.apiUrl}/address-book/upsert/`, request);
    } catch (error) {
      console.error('Error upserting address book entry:', error);
      return { success: false, message: 'Network error occurred', error: 'Network error occurred' };
    }
  }

  async resolveAddressName(request: ResolveAddressRequest): Promise<ResolveAddressResponse> {
    try {
      const url = `${this.apiUrl}/address-book/resolve/?address=${encodeURIComponent(request.address)}`;
      return await this.api.get<ResolveAddressResponse>(url);
    } catch (error) {
      console.error('Error resolving address name:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async listAddressBook(): Promise<ListAddressBookResponse> {
    try {
      return await this.api.get<ListAddressBookResponse>(`${this.apiUrl}/address-book/list/`);
    } catch (error) {
      console.error('Error listing address book:', error);
      return { success: false, data: [], count: 0, error: 'Network error occurred' };
    }
  }

  async deleteAddressBookEntry(request: DeleteAddressBookRequest): Promise<DeleteAddressBookResponse> {
    try {
      return await this.api.delete<DeleteAddressBookResponse>(`${this.apiUrl}/address-book/delete/`, request);
    } catch (error) {
      console.error('Error deleting address book entry:', error);
      return { success: false, message: 'Network error occurred', error: 'Network error occurred' };
    }
  }
}
