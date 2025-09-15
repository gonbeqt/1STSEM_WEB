import { useState, useEffect } from 'react';
import { container } from '../../di/container';
import { WalletViewModel } from '../../domain/models/WalletViewModal';

export const useWallet = () => {
  const [viewModel] = useState<WalletViewModel>(() => container.walletViewModel());

  useEffect(() => {
    // Attempt to load wallets or check for existing connection on mount
    viewModel.checkWalletConnection();
  }, [viewModel]);

  return {
    // State from ViewModel
    isWalletConnected: viewModel.isWalletConnected,
    reconnectedWalletAddress: viewModel.reconnectedWalletAddress,
    successMessage: viewModel.successMessage,
    reconnectError: viewModel.reconnectError,
    isReconnecting: viewModel.isReconnecting,
    isFetchingBalance: viewModel.isFetchingBalance,
    fetchBalanceError: viewModel.fetchBalanceError,
    walletAddress: viewModel.walletAddress,
    ethBalance: viewModel.ethBalance,
    usdBalance: viewModel.usdBalance,
    
    // Actions from ViewModel
    clearSuccessMessage: viewModel.clearSuccessMessage,
    reconnectWallet: viewModel.reconnectWallet,
    setReconnectPrivateKey: viewModel.setReconnectPrivateKey, // Expose setter for private key
    connectWallet: viewModel.connectWallet,
    setPrivateKey: viewModel.setPrivateKey,
    setWalletName: viewModel.setWalletName,
    setWalletType: viewModel.setWalletType,
    fetchWalletBalance: viewModel.fetchWalletBalance,
    
  };
};