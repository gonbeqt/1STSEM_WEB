// src/domain/models/WalletViewModel.tsx
import { makeAutoObservable } from 'mobx';
import { ConnectWalletUseCase } from '../usecases/ConnectWalletUseCase';
import { GetWalletsUseCase } from './../usecases/GetWalletUseCase';
import { DisconnectWalletUseCase } from '../usecases/DisconnectWalletUseCase';
import { Wallet } from '../entities/WalletEntities';

interface WalletState {
  // Connect wallet form
  privateKey: string;
  walletName: string;
  walletType: string;
  
  // Wallet list
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  
  // Loading states
  isConnecting: boolean;
  isLoadingWallets: boolean;
  isDisconnecting: boolean;
  
  // Error states
  connectError: string | null;
  walletsError: string | null;
  disconnectError: string | null;
  
  // Success messages
  successMessage: string | null;
}

export class WalletViewModel {
  private state: WalletState = {
    privateKey: '',
    walletName: 'My Wallet',
    walletType: 'Private Key',
    wallets: [],
    selectedWallet: null,
    isConnecting: false,
    isLoadingWallets: false,
    isDisconnecting: false,
    connectError: null,
    walletsError: null,
    disconnectError: null,
    successMessage: null
  };

  constructor(
    private connectWalletUseCase: ConnectWalletUseCase,
    private getWalletsUseCase: GetWalletsUseCase,
    private disconnectWalletUseCase: DisconnectWalletUseCase
  ) {
    makeAutoObservable(this);
  }

  // Form setters
  setPrivateKey = (privateKey: string) => {
    this.state.privateKey = privateKey;
    this.clearErrors();
  };

  setWalletName = (walletName: string) => {
    this.state.walletName = walletName;
  };

  setWalletType = (walletType: string) => {
    this.state.walletType = walletType;
  };

  setSelectedWallet = (wallet: Wallet | null) => {
    this.state.selectedWallet = wallet;
  };

  // Clear methods
  clearErrors = () => {
    this.state.connectError = null;
    this.state.walletsError = null;
    this.state.disconnectError = null;
  };

  clearSuccessMessage = () => {
    this.state.successMessage = null;
  };

  clearForm = () => {
    this.state.privateKey = '';
    this.state.walletName = 'My Wallet';
    this.state.walletType = 'Private Key';
    this.clearErrors();
    this.clearSuccessMessage();
  };

  // Validation
    validateConnectForm = (): boolean => {
    if (!this.state.privateKey.trim()) {
      this.state.connectError = 'Private key is required';
      return false;
    }

    const cleanPrivateKey = this.state.privateKey.startsWith('0x')
      ? this.state.privateKey.slice(2)
      : this.state.privateKey;
   

    return true;
  };

  // Actions
  connectWallet = async (): Promise<boolean> => {
    if (!this.validateConnectForm()) return false;

    try {
      this.state.isConnecting = true;
      this.clearErrors();

      const response = await this.connectWalletUseCase.execute({
        private_key: this.state.privateKey,
        wallet_name: this.state.walletName,
        wallet_type: this.state.walletType
      });

      this.state.successMessage = response.message;
      
      // Add or update wallet in local state
      const newWallet: Wallet = {
        id: response.data.wallet_id,
        userId: response.data.user_id,
        name: response.data.wallet_name,
        address: response.data.wallet_address,
        walletType: response.data.wallet_type,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (response.data.action === 'created') {
        this.state.wallets.push(newWallet);
      } else {
        // Update existing wallet
        const index = this.state.wallets.findIndex(w => w.id === newWallet.id);
        if (index !== -1) {
          this.state.wallets[index] = newWallet;
        }
      }

      this.clearForm();
      return true;
    } catch (error) {
      this.state.connectError = error instanceof Error ? error.message : 'Failed to connect wallet';
      return false;
    } finally {
      this.state.isConnecting = false;
    }
  };

  loadWallets = async (): Promise<void> => {
    try {
      this.state.isLoadingWallets = true;
      this.state.walletsError = null;

      const response = await this.getWalletsUseCase.execute();
      
      this.state.wallets = response.data.wallets.map((walletData: { wallet_id: any; user_id: any; wallet_name: any; wallet_address: any; wallet_type: any; }) => ({
        id: walletData.wallet_id,
        userId: walletData.user_id,
        name: walletData.wallet_name,
        address: walletData.wallet_address,
        walletType: walletData.wallet_type,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      this.state.walletsError = error instanceof Error ? error.message : 'Failed to load wallets';
    } finally {
      this.state.isLoadingWallets = false;
    }
  };

  disconnectWallet = async (walletId: string): Promise<boolean> => {
    try {
      this.state.isDisconnecting = true;
      this.state.disconnectError = null;

      const response = await this.disconnectWalletUseCase.execute({
        wallet_id: walletId
      });

      this.state.successMessage = response.message;
      
      // Remove wallet from local state
      this.state.wallets = this.state.wallets.filter(w => w.id !== walletId);
      
      // Clear selected wallet if it was the disconnected one
      if (this.state.selectedWallet?.id === walletId) {
        this.state.selectedWallet = null;
      }

      return true;
    } catch (error) {
      this.state.disconnectError = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      return false;
    } finally {
      this.state.isDisconnecting = false;
    }
  };

  // Getters
  get formData() {
    return {
      privateKey: this.state.privateKey,
      walletName: this.state.walletName,
      walletType: this.state.walletType
    };
  }

  get wallets() {
    return this.state.wallets;
  }

  get selectedWallet() {
    return this.state.selectedWallet;
  }

  get isConnecting() {
    return this.state.isConnecting;
  }

  get isLoadingWallets() {
    return this.state.isLoadingWallets;
  }

  get isDisconnecting() {
    return this.state.isDisconnecting;
  }

  get connectError() {
    return this.state.connectError;
  }

  get walletsError() {
    return this.state.walletsError;
  }

  get disconnectError() {
    return this.state.disconnectError;
  }

  get successMessage() {
    return this.state.successMessage;
  }

  get hasWallets() {
    return this.state.wallets.length > 0;
  }

  get walletCount() {
    return this.state.wallets.length;
  }

  get canAddMoreWallets() {
    return this.state.wallets.length < 10; // Maximum 10 wallets per user
  }
}