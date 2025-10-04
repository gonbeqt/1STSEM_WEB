export interface AddressBookEntry {
  address: string;
  name: string;
  role: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpsertAddressBookRequest {
  address: string;
  name: string;
  role: string;
  notes: string;
}

export interface UpsertAddressBookResponse {
  success: boolean;
  message: string;
  data?: {
    address: string;
    name: string;
    role: string;
    notes: string;
  };
  error?: string;
}

export interface ResolveAddressRequest {
  address: string;
}

export interface ResolveAddressResponse {
  success: boolean;
  data?: {
    address: string;
    name: string;
    role: string;
    notes: string;
  } | null;
  message?: string;
  error?: string;
}

export interface ListAddressBookResponse {
  success: boolean;
  data: AddressBookEntry[];
  count: number;
  error?: string;
}

export interface DeleteAddressBookRequest {
  address: string;
}

export interface DeleteAddressBookResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface InvestmentData {
  recipientAddress: string;
  amount: string;
  company: string;
  category: string;
  description: string;
}
