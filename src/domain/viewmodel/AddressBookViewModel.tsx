import { makeAutoObservable } from 'mobx';
import { AddressBookEntry, UpsertAddressBookRequest, InvestmentData } from '../entities/AddressBookEntities';
import {
  UpsertAddressBookEntryUseCase,
  ResolveAddressNameUseCase,
  ListAddressBookUseCase,
  DeleteAddressBookEntryUseCase
} from '../usecases/AddressBookUseCases';

interface AddressBookState {
  entries: AddressBookEntry[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  searchTerm: string;
  isAddingEntry: boolean;
  editingEntry: AddressBookEntry | null;
  formData: {
    address: string;
    name: string;
    role: string;
    notes: string;
  };
  investmentData: InvestmentData;
}

export class AddressBookViewModel {
  private state: AddressBookState = {
    entries: [],
    isLoading: false,
    error: null,
    successMessage: null,
    searchTerm: '',
    isAddingEntry: false,
    editingEntry: null,
    formData: {
      address: '',
      name: '',
      role: 'investor',
      notes: ''
    },
    investmentData: {
      recipientAddress: '',
      amount: '',
      company: '',
      category: 'investment',
      description: ''
    }
  };

  constructor(
    private upsertAddressBookEntryUseCase: UpsertAddressBookEntryUseCase,
    private resolveAddressNameUseCase: ResolveAddressNameUseCase,
    private listAddressBookUseCase: ListAddressBookUseCase,
    private deleteAddressBookEntryUseCase: DeleteAddressBookEntryUseCase
  ) {
    makeAutoObservable(this);
  }

  // Getters
  get entries() {
    return this.state.entries;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get error() {
    return this.state.error;
  }

  get successMessage() {
    return this.state.successMessage;
  }

  get searchTerm() {
    return this.state.searchTerm;
  }

  get isAddingEntry() {
    return this.state.isAddingEntry;
  }

  get editingEntry() {
    return this.state.editingEntry;
  }

  get formData() {
    return this.state.formData;
  }

  get investmentData() {
    return this.state.investmentData;
  }

  get filteredEntries() {
    return this.state.entries.filter(entry =>
      entry.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
      entry.address.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
      entry.role.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
  }

  // Actions
  setSearchTerm(searchTerm: string) {
    this.state.searchTerm = searchTerm;
  }

  setIsAddingEntry(isAddingEntry: boolean) {
    this.state.isAddingEntry = isAddingEntry;
    if (isAddingEntry) {
      this.clearForm();
      this.clearMessages();
    }
  }

  setEditingEntry(entry: AddressBookEntry | null) {
    this.state.editingEntry = entry;
    if (entry) {
      this.state.formData = {
        address: entry.address,
        name: entry.name,
        role: entry.role,
        notes: entry.notes
      };
      this.clearMessages();
    } else {
      this.clearForm();
    }
  }

  updateFormData(field: keyof typeof this.state.formData, value: string) {
    this.state.formData[field] = value;
    this.clearError();
  }

  updateInvestmentData(field: keyof InvestmentData, value: string) {
    this.state.investmentData[field] = value;
  }

  clearForm() {
    this.state.formData = {
      address: '',
      name: '',
      role: 'investor',
      notes: ''
    };
  }

  clearError() {
    this.state.error = null;
  }

  clearSuccessMessage() {
    this.state.successMessage = null;
  }

  clearMessages() {
    this.state.error = null;
    this.state.successMessage = null;
  }

  // Business Logic
  async loadAddressBook() {
    this.state.isLoading = true;
    this.state.error = null;

    try {
      const response = await this.listAddressBookUseCase.execute();
      
      if (response.success) {
        this.state.entries = response.data || [];
      } else {
        this.state.error = response.error || 'Failed to load address book';
      }
    } catch (error) {
      this.state.error = 'Network error occurred';
      console.error('Error loading address book:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  async addEntry() {
    this.state.isLoading = true;
    this.state.error = null;
    this.state.successMessage = null;

    try {
      const request: UpsertAddressBookRequest = {
        address: this.state.formData.address,
        name: this.state.formData.name,
        role: this.state.formData.role,
        notes: this.state.formData.notes
      };

      const response = await this.upsertAddressBookEntryUseCase.execute(request);
      
      if (response.success) {
        this.state.successMessage = 'Address book entry added successfully';
        this.clearForm();
        this.state.isAddingEntry = false;
        this.state.searchTerm = ''; // Clear search term to show all entries including the new one
        await this.loadAddressBook();
      } else {
        this.state.error = response.error || 'Failed to add entry';
      }
    } catch (error) {
      this.state.error = 'Network error occurred';
      console.error('Error adding entry:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  async updateEntry() {
    if (!this.state.editingEntry) return;

    this.state.isLoading = true;
    this.state.error = null;
    this.state.successMessage = null;

    try {
      const request: UpsertAddressBookRequest = {
        address: this.state.formData.address,
        name: this.state.formData.name,
        role: this.state.formData.role,
        notes: this.state.formData.notes
      };

      const response = await this.upsertAddressBookEntryUseCase.execute(request);
      
      if (response.success) {
        this.state.successMessage = 'Address book entry updated successfully';
        this.state.editingEntry = null;
        this.clearForm();
        this.state.searchTerm = ''; // Clear search term to show all entries including the updated one
        await this.loadAddressBook();
      } else {
        this.state.error = response.error || 'Failed to update entry';
      }
    } catch (error) {
      this.state.error = 'Network error occurred';
      console.error('Error updating entry:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  async deleteEntry(address: string) {
    this.state.isLoading = true;
    this.state.error = null;
    this.state.successMessage = null;

    try {
      const response = await this.deleteAddressBookEntryUseCase.execute({ address });
      
      if (response.success) {
        this.state.successMessage = 'Address book entry deleted successfully';
        await this.loadAddressBook();
      } else {
        this.state.error = response.error || 'Failed to delete entry';
      }
    } catch (error) {
      this.state.error = 'Network error occurred';
      console.error('Error deleting entry:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  async resolveAddressName(address: string) {
    if (!address || address.length < 42) return;

    try {
      const response = await this.resolveAddressNameUseCase.execute({ address });
      
      if (response.success && response.data) {
        const entry = response.data;
        this.state.investmentData.recipientAddress = address;
        return entry;
      }
    } catch (error) {
      console.error('Error resolving address:', error);
    }
    return null;
  }

  startEdit(entry: AddressBookEntry) {
    this.setEditingEntry(entry);
  }

  cancelEdit() {
    this.setEditingEntry(null);
  }

  resetInvestmentForm() {
    this.state.investmentData = {
      recipientAddress: '',
      amount: '',
      company: '',
      category: 'investment',
      description: ''
    };
  }

}
