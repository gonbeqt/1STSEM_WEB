// src/contexts/WalletViewModelContext.ts
import { createContext, useContext } from 'react';
import { WalletViewModel } from '../domain/viewmodel/WalletViewModal';

// Create the context with a default value of null
export const WalletViewModelContext = createContext<WalletViewModel | null>(null);

// Provider component to wrap the app or relevant components
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