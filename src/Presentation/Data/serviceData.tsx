export interface ServiceData {
  id: string;
  name: string;
  icon: string;
  category: 'utilities' | 'office';
  defaultAmount: string;
  walletId: string;
  provider: string;
  accountNumber?: string;
}

export const services: ServiceData[] = [
  {
    id: 'electricity',
    name: 'Electricity',
    icon: '⚡',
    category: 'utilities',
    defaultAmount: '0.039',
    walletId: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    provider: 'City Power Corp',
    accountNumber: 'ELEC-2024-0123'
  },
  {
    id: 'water',
    name: 'Water',
    icon: '💧',
    category: 'utilities',
    defaultAmount: '0.025',
    walletId: '0x9B27d4E51994E3E1D7De93128D6a5c5A86944f55',
    provider: 'Metro Water District',
    accountNumber: 'WAT-2024-0456'
  },
  {
    id: 'internet',
    name: 'Internet',
    icon: '🌐',
    category: 'utilities',
    defaultAmount: '0.045',
    walletId: '0x3F4c52E8F2f0C81B5247E21B4B7B31939D933Af4',
    provider: 'FastNet Solutions',
    accountNumber: 'NET-2024-0789'
  },
  {
    id: 'office-rent',
    name: 'Office Rent',
    icon: '🏢',
    category: 'office',
    defaultAmount: '0.85',
    walletId: '0x1B5d3E28f2A0C81B5247E21B4B7B31939D933Bf2',
    provider: 'Prime Properties Ltd'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: '🧹',
    category: 'office',
    defaultAmount: '0.028',
    walletId: '0x5A2d35Cc6634C0532925a3b844Bc454e4438e33d',
    provider: 'CleanPro Services'
  },
  {
    id: 'security',
    name: 'Security',
    icon: '🔒',
    category: 'office',
    defaultAmount: '0.032',
    walletId: '0x8C27d4E51994E3E1D7De93128D6a5c5A86944d44',
    provider: 'SecureGuard Systems'
  }
];