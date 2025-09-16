// src/domain/models/WalletViewModel.tsx
import { makeAutoObservable } from 'mobx';
import { ConnectWalletUseCase } from '../usecases/ConnectWalletUseCase';
import { ReconnectWalletUseCase } from '../usecases/ReconnectWalletUseCase';
import { Wallet, GetWalletsResponse, GetWalletsListResponse } from '../entities/WalletEntities';
import { GetWalletBalanceUseCase } from '../usecases/GetWalletBalanceUseCase';
import { SendEthUseCase } from '../usecases/SendEthUseCase'; // Import SendEthUseCase
import { SendEthRequest, SendEthResponse } from '../entities/WalletEntities';

interface WalletState {
  // Connect wallet form
  privateKey: string;
  walletName: string;
  walletType: string;
  
  // Reconnect wallet form
  reconnectPrivateKey: string;
  
  // Loading states
  isConnecting: boolean;
  isReconnecting: boolean;
  isFetchingBalance: boolean;
  isSendingEth: boolean; // New state for sending ETH
  
  // Error states
  connectError: string | null;
  reconnectError: string | null;
  fetchBalanceError: string | null;
  sendEthError: string | null; // New state for send ETH error
  
  // Success messages
  successMessage: string | null;
  
  // Reconnect success data
  reconnectedWalletAddress: string | null;

  // Wallet Balance Data
  walletAddress: string | null;
  ethBalance: number | null;
  usdBalance: number | null;
}

export class WalletViewModel {
  private state: WalletState = {
    privateKey: '',
    walletName: 'My Wallet',
    walletType: 'Private Key',
    reconnectPrivateKey: '',
    isConnecting: false,
    isReconnecting: false,
    isFetchingBalance: false,
    isSendingEth: false, // Initialize new state
    connectError: null,
    reconnectError: null,
    fetchBalanceError: null,
    sendEthError: null, // Initialize new state
    successMessage: null,
    reconnectedWalletAddress: null,
    walletAddress: null,
    ethBalance: null,
    usdBalance: null,
  };

  constructor(
    private connectWalletUseCase: ConnectWalletUseCase,
    private reconnectWalletUseCase: ReconnectWalletUseCase,
    private getWalletBalanceUseCase: GetWalletBalanceUseCase,
    private sendEthUseCase: SendEthUseCase // Inject SendEthUseCase
  ) {
    makeAutoObservable(this);
  }

  // Form setters
  setPrivateKey = (privateKey: string) => {
    this.state.privateKey = privateKey;
    this.clearErrors();
  };

  setReconnectPrivateKey = (privateKey: string) => {
    this.state.reconnectPrivateKey = privateKey;
    this.state.reconnectError = null; // Clear reconnect error when user types
  };

  setWalletName = (walletName: string) => {
    this.state.walletName = walletName;
  };

  setWalletType = (walletType: string) => {
    this.state.walletType = walletType;
  };

  // Clear methods
  clearErrors = () => {
    this.state.connectError = null;
    this.state.reconnectError = null;
    this.state.fetchBalanceError = null;
  };

  clearReconnectError = () => {
    this.state.reconnectError = null;
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

  clearReconnectForm = () => {
    this.state.reconnectPrivateKey = '';
    this.state.reconnectError = null;
    this.state.reconnectedWalletAddress = null;
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

  validateReconnectForm = (): boolean => {
    if (!this.state.reconnectPrivateKey.trim()) {
      this.state.reconnectError = 'Private key is required';
      return false;
    }

    // Basic hex validation for private key
    const hexRegex = /^0x[a-fA-F0-9]{64}$|^[a-fA-F0-9]{64}$/;
    if (!hexRegex.test(this.state.reconnectPrivateKey)) {
      this.state.reconnectError = 'Invalid private key format';
      return false;
    }

    return true;
  };

  // Actions
  connectWallet = async (walletData: { privateKey: string; walletName: string; walletType: string }): Promise<boolean> => {
    this.state.privateKey = walletData.privateKey;
    this.state.walletName = walletData.walletName;
    this.state.walletType = walletData.walletType;
  
    if (!this.validateConnectForm()) return false;
  
    const token = localStorage.getItem('token');
    if (!token) {
      this.state.connectError = 'You must be logged in to connect a wallet.';
      return false;
    }
  
    try {
      this.state.isConnecting = true;
      this.clearErrors();
  
      const response = await this.connectWalletUseCase.execute({
        private_key: this.state.privateKey,
        wallet_name: this.state.walletName,
        wallet_type: this.state.walletType,
      });
  
      this.state.successMessage = response.message;
  
      // Store wallet info in localStorage for persistence
      localStorage.setItem('walletAddress', response.data.wallet_address);
      localStorage.setItem('privateKey', walletData.privateKey);
      localStorage.setItem('walletConnected', 'true');
  
      this.clearForm();
      // After successful connection, fetch the balance
      await this.fetchWalletBalance(token);
      this.state.walletAddress = response.data.wallet_address; // Set walletAddress after successful balance fetch
      return true;
    } catch (error) {
      this.state.connectError = error instanceof Error ? error.message : 'Failed to connect wallet';
      return false;
    } finally {
      this.state.isConnecting = false;
    }
  };

  reconnectWallet = async (privateKeyToUse?: string): Promise<boolean> => {
    const key = privateKeyToUse || this.state.reconnectPrivateKey;

    if (!key.trim()) {
      this.state.reconnectError = 'Private key is required';
      return false;
    }

    // Basic hex validation for private key
    const hexRegex = /^0x[a-fA-F0-9]{64}$|^[a-fA-F0-9]{64}$/;
    if (!hexRegex.test(key)) {
      this.state.reconnectError = 'Invalid private key format';
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.state.reconnectError = 'You must be logged in to reconnect a wallet.';
      return false;
    }

    try {
      this.state.isReconnecting = true;
      this.state.reconnectError = null;

      const response = await this.reconnectWalletUseCase.execute({
        private_key: key
      });

      this.state.successMessage = response.message;
      this.state.reconnectedWalletAddress = response.wallet_address;
      
      // Store wallet info in localStorage for persistence
      localStorage.setItem('walletAddress', response.wallet_address);
      localStorage.setItem('walletConnected', 'true');

      // Clear the form for security
      this.state.reconnectPrivateKey = '';

      // After successful reconnection, fetch the balance
      await this.fetchWalletBalance(token);
      this.state.reconnectedWalletAddress = response.wallet_address; // Set reconnectedWalletAddress after successful balance fetch

      return true;
    } catch (error) {
      this.state.reconnectError = error instanceof Error ? error.message : 'Wallet reconnection failed';
      return false;
    } finally {
      this.state.isReconnecting = false;
    }
  };

  sendEth = async (recipientAddress: string, amount: string): Promise<boolean> => {
    const privateKey = this.state.privateKey || localStorage.getItem('privateKey');

    if (!privateKey) {
      this.state.sendEthError = 'Wallet not connected or private key not available.';
      return false;
    }

    if (!recipientAddress.trim()) {
      this.state.sendEthError = 'Recipient address is required.';
      return false;
    }

    if (parseFloat(amount) <= 0) {
      this.state.sendEthError = 'Amount must be greater than zero.';
      return false;
    }

    try {
      this.state.isSendingEth = true;
      this.state.sendEthError = null;

      const request: SendEthRequest = {
        private_key: privateKey,
        recipient_address: recipientAddress,
        amount: amount,
        from_address: this.state.walletAddress || undefined,
      };

      const response: SendEthResponse = await this.sendEthUseCase.execute(request);

      if (response.success) {
        this.state.successMessage = `Transaction sent: ${response.transaction_hash}`;
        await this.fetchWalletBalance(); // Refresh balance after sending
        return true;
      } else {
        this.state.sendEthError = response.message || 'Failed to send ETH.';
        return false;
      }
    } catch (error) {
      this.state.sendEthError = error instanceof Error ? error.message : 'Failed to send ETH.';
      return false;
    } finally {
      this.state.isSendingEth = false;
    }
  };

  fetchWalletBalance = async (authToken?: string): Promise<void> => {
  const token = authToken || localStorage.getItem('token');
  if (!token) {
    this.state.fetchBalanceError = 'Authentication required to fetch balance.';
    return;
  }

  try {
    this.state.isFetchingBalance = true;
    this.state.fetchBalanceError = null;
    const response: GetWalletsListResponse = await this.getWalletBalanceUseCase.execute(token);
    console.log('Fetch Wallet Balance API Response:', response);
    if (response.data && response.data.wallets && response.data.wallets.length > 0) {
      const primaryWallet = response.data.wallets[0];
      console.log('Primary Wallet Data:', primaryWallet);
      if (primaryWallet.balances && primaryWallet.balances.ETH) {
        this.state.walletAddress = primaryWallet.address;
        this.state.ethBalance = parseFloat(primaryWallet.balances.ETH.balance);
        this.state.usdBalance = primaryWallet.balances.ETH.usd_value ?? 0; // Use nullish coalescing to default to 0
        console.log('Updated Wallet Balance:', this.state.ethBalance, this.state.usdBalance);
      } else {
        console.log('Primary wallet does not have ETH balance data.', primaryWallet);
        this.state.fetchBalanceError = 'ETH balance data not found for primary wallet';
      }
    } else {
      console.log('No wallets found in response data or response data is malformed.', response);
      this.state.fetchBalanceError = 'No wallets found or invalid response';
    }
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    this.state.fetchBalanceError = error instanceof Error ? error.message : 'Failed to fetch wallet balance';
    this.state.walletAddress = null;
    this.state.ethBalance = null;
    this.state.usdBalance = null;
  } finally {
    this.state.isFetchingBalance = false;
    }
    };

    // Check if wallet was previously connected (from localStorage)
    checkWalletConnection = async (authToken?: string) => {
    const token = authToken || localStorage.getItem('token');
    const walletAddress = localStorage.getItem('walletAddress');
    const privateKey = localStorage.getItem('privateKey');
    const walletConnected = localStorage.getItem('walletConnected');

    if (walletAddress && privateKey && walletConnected === 'true' && token) {
      this.state.reconnectedWalletAddress = walletAddress;
      // Attempt to auto-reconnect using the stored private key
      await this.reconnectWallet(privateKey);
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

  get reconnectFormData() {
    return {
      privateKey: this.state.reconnectPrivateKey,
      isReconnecting: this.state.isReconnecting,
      error: this.state.reconnectError,
      walletAddress: this.state.reconnectedWalletAddress,
      isConnected: !!this.state.reconnectedWalletAddress
    };
  }

  get isConnecting() {
    return this.state.isConnecting;
  }

  get isReconnecting() {
    return this.state.isReconnecting;
  }

  get isFetchingBalance() {
    return this.state.isFetchingBalance;
  }

  get isSendingEth() {
    return this.state.isSendingEth;
  }

  get connectError() {
    return this.state.connectError;
  }

  get reconnectError() {
    return this.state.reconnectError;
  }

  get fetchBalanceError() {
    return this.state.fetchBalanceError;
  }

  get sendEthError() {
    return this.state.sendEthError;
  }

  get successMessage() {
    return this.state.successMessage;
  }

  get reconnectedWalletAddress() {
    return this.state.reconnectedWalletAddress;
  }

  get walletAddress() {
    return this.state.walletAddress;
  }

  get ethBalance() {
    return this.state.ethBalance;
  }

  get usdBalance() {
    return this.state.usdBalance;
  }

  get isReconnectFormValid() {
    return this.state.reconnectPrivateKey.trim() !== '' && !this.state.isReconnecting;
  }

  resetWalletState = () => {
    this.state.walletAddress = null;
    this.state.reconnectedWalletAddress = null;
    this.state.ethBalance = null;
    this.state.usdBalance = null;
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('privateKey');
  };

  get isWalletConnected() {
  return !!this.state.walletAddress || !!this.state.reconnectedWalletAddress;
  }
}