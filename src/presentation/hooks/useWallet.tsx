import { useState, useEffect, useContext } from 'react';
import { container } from '../../di/container';
import { WalletViewModel } from '../../domain/models/WalletViewModal';
import { WalletViewModelContext } from '../../context/WalletViewModelContext';

export const useWallet = (): WalletViewModel => {
  const [viewModel] = useState<WalletViewModel>(() => container.walletViewModel());
const walletViewModel = useContext(WalletViewModelContext);
  if (!walletViewModel) {
    throw new Error('useWallet must be used within a WalletViewModelProvider');
  }
  return walletViewModel;
};