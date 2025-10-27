import { createContext } from 'react';
import { WalletViewModel } from '../domain/viewmodel/WalletViewModal';

export const WalletViewModelContext = createContext<WalletViewModel | null>(null);

export const WalletViewModelProvider: React.FC<{
  value: WalletViewModel;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <WalletViewModelContext.Provider value={value}>
      {children}
    </WalletViewModelContext.Provider>
  );
};