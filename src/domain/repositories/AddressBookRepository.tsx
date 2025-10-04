import {
  UpsertAddressBookRequest,
  UpsertAddressBookResponse,
  ResolveAddressRequest,
  ResolveAddressResponse,
  ListAddressBookResponse,
  DeleteAddressBookRequest,
  DeleteAddressBookResponse
} from '../entities/AddressBookEntities';

export interface AddressBookRepository {
  upsertAddressBookEntry(request: UpsertAddressBookRequest): Promise<UpsertAddressBookResponse>;
  resolveAddressName(request: ResolveAddressRequest): Promise<ResolveAddressResponse>;
  listAddressBook(): Promise<ListAddressBookResponse>;
  deleteAddressBookEntry(request: DeleteAddressBookRequest): Promise<DeleteAddressBookResponse>;
}
