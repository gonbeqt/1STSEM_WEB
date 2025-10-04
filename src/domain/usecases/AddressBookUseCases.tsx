import { AddressBookRepository } from '../repositories/AddressBookRepository';
import {
  UpsertAddressBookRequest,
  UpsertAddressBookResponse,
  ResolveAddressRequest,
  ResolveAddressResponse,
  ListAddressBookResponse,
  DeleteAddressBookRequest,
  DeleteAddressBookResponse
} from '../entities/AddressBookEntities';

export class UpsertAddressBookEntryUseCase {
  constructor(private addressBookRepository: AddressBookRepository) {}

  async execute(request: UpsertAddressBookRequest): Promise<UpsertAddressBookResponse> {
    // Validate request
    if (!request.address || !request.name) {
      return {
        success: false,
        message: 'Address and name are required',
        error: 'Address and name are required'
      };
    }

    // Validate address format
    if (!request.address.startsWith('0x') || request.address.length !== 42) {
      return {
        success: false,
        message: 'Invalid wallet address format',
        error: 'Invalid wallet address format'
      };
    }

    return await this.addressBookRepository.upsertAddressBookEntry(request);
  }
}

export class ResolveAddressNameUseCase {
  constructor(private addressBookRepository: AddressBookRepository) {}

  async execute(request: ResolveAddressRequest): Promise<ResolveAddressResponse> {
    if (!request.address) {
      return {
        success: false,
        error: 'Address parameter is required'
      };
    }

    return await this.addressBookRepository.resolveAddressName(request);
  }
}

export class ListAddressBookUseCase {
  constructor(private addressBookRepository: AddressBookRepository) {}

  async execute(): Promise<ListAddressBookResponse> {
    return await this.addressBookRepository.listAddressBook();
  }
}

export class DeleteAddressBookEntryUseCase {
  constructor(private addressBookRepository: AddressBookRepository) {}

  async execute(request: DeleteAddressBookRequest): Promise<DeleteAddressBookResponse> {
    if (!request.address) {
      return {
        success: false,
        message: 'Address is required',
        error: 'Address is required'
      };
    }

    return await this.addressBookRepository.deleteAddressBookEntry(request);
  }
}
