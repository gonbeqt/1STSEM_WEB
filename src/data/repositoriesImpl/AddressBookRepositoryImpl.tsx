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
import { AddressBookRemoteDataSource } from '../datasources/AddressBookRemoteDataSource';

export class AddressBookRepositoryImpl implements AddressBookRepository {
  constructor(private readonly remote: AddressBookRemoteDataSource) {}

  async upsertAddressBookEntry(request: UpsertAddressBookRequest): Promise<UpsertAddressBookResponse> {
    return this.remote.upsertAddressBookEntry(request);
  }

  async resolveAddressName(request: ResolveAddressRequest): Promise<ResolveAddressResponse> {
    return this.remote.resolveAddressName(request);
  }

  async listAddressBook(): Promise<ListAddressBookResponse> {
    return this.remote.listAddressBook();
  }

  async deleteAddressBookEntry(request: DeleteAddressBookRequest): Promise<DeleteAddressBookResponse> {
    return this.remote.deleteAddressBookEntry(request);
  }
}
