import {  useContext } from 'react';
import { WalletViewModel } from '../../domain/viewmodel/WalletViewModal';
import { WalletViewModelContext } from '../../context/WalletViewModelContext';

export const useWallet = (): WalletViewModel => {
const walletViewModel = useContext(WalletViewModelContext);
  if (!walletViewModel) {
    throw new Error('useWallet must be used within a WalletViewModelProvider');
  }
  return walletViewModel;
};