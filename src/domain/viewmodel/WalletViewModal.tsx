// src/domain/models/WalletViewModel.tsx
import { makeAutoObservable } from 'mobx';
import { ConnectWalletUseCase } from '../usecases/ConnectWalletUseCase';
import { DisconnectWalletResponse, ConversionRequest, ConversionResponse } from '../entities/WalletEntities';
import { GetWalletBalanceUseCase } from '../usecases/GetWalletBalanceUseCase';
import { DisconnectWalletUseCase } from '../usecases/DisconnectWalletUseCase';
import { ConvertCryptoToFiatUseCase } from '../usecases/ConvertCryptoToFiatUseCase';
import { SendEthUseCase } from '../usecases/SendEthUseCase'; // Import SendEthUseCase
import { SendEthRequest, SendEthResponse } from '../entities/WalletEntities';
import { GetExchangeRatesUseCase } from '../usecases/GetExchangeRatesUseCase';

interface WalletState {
  // Connect wallet form
  privateKey: string;
  walletName: string;
  walletType: string;
  
  
  // Loading states
  isConnecting: boolean;
  isFetchingBalance: boolean;
  isSendingEth: boolean; // New state for sending ETH
  isConverting: boolean; // New state for currency conversion
  
  // Error states
  connectError: string | null;
  fetchBalanceError: string | null;
  sendEthError: string | null; // New state for send ETH error
  conversionError: string | null; // New state for conversion error
  
  // Success messages
  successMessage: string | null;
  

  // Wallet Balance Data
  walletAddress: string | null;
  ethBalance: number | null;
  rates: { [key: string]: number } | null;
  fiatCurrency: string | null;
  
  // Conversion Data
  conversionResult: ConversionResponse | null;
}

export class WalletViewModel {
  private state: WalletState = {
    privateKey: '',
    walletName: 'MetaMask',
    walletType: 'MetaMask',
    isConnecting: false,
    isFetchingBalance: false,
    isSendingEth: false,
    isConverting: false,
    connectError: null,
    fetchBalanceError: null,
    sendEthError: null,
    conversionError: null,
    successMessage: null,
    walletAddress: null,
    ethBalance: null,
    rates: null,
    fiatCurrency: null,
    conversionResult: null,
   
  };

  constructor(
    private connectWalletUseCase: ConnectWalletUseCase,
    private getWalletBalanceUseCase: GetWalletBalanceUseCase,
    private disconnectWalletUseCase: DisconnectWalletUseCase,
    private convertCryptoToFiatUseCase: ConvertCryptoToFiatUseCase,
    private sendEthUseCase: SendEthUseCase, // Inject SendEthUseCase
    private getExchangeRatesUseCase: GetExchangeRatesUseCase 
  ) {
    makeAutoObservable(this);
    
    // Initialize wallet state from localStorage on startup
    this.initializeWalletState();
  }

  // Initialize wallet state from localStorage
  initializeWalletState = () => {
    const walletAddress = localStorage.getItem('walletAddress');
    const walletConnected = localStorage.getItem('walletConnected');
    
    if (walletAddress && walletConnected === 'true') {
      this.state.walletAddress = walletAddress;
      
      // Also check if we have a stored balance
      const storedBalance = localStorage.getItem('ethBalance');
      if (storedBalance) {
        this.state.ethBalance = parseFloat(storedBalance);
      }
    }
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

  // Clear methods
  clearErrors = () => {
    this.state.connectError = null;
    this.state.fetchBalanceError = null;
  };


  clearSuccessMessage = () => {
    this.state.successMessage = null;
  };

  clearForm = () => {
    this.state.privateKey = '';
    this.state.walletName = 'MetaMask';
    this.state.walletType = 'MetaMask';
    this.clearErrors();
    this.clearSuccessMessage();
  };


  // Validation
  validateConnectForm = (): boolean => {
    if (!this.state.privateKey.trim()) {
      this.state.connectError = 'Private key is required';
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


  sendEth = async (recipientAddress: string, amount: string, company: string, category: string, description: string, isInvesting: boolean = false, investorName: string = ''): Promise<boolean> => {
    if (!this.isWalletConnected) {
      this.state.sendEthError = 'No wallet connected. Please connect a wallet first.';
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
        to_address: recipientAddress,
        amount: amount,
        company: company,
        category: category,
        description: description,
        is_investing: isInvesting,
        investor_name: investorName,
      };

      const response: SendEthResponse = await this.sendEthUseCase.execute(request);

      if (response.success && response.data) {
        await this.fetchWalletBalance(); 
        return true;
      } else {
        this.state.sendEthError = response.message || 'Failed to send ETH.';
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      this.state.isSendingEth = false;
    }
  };

  disconnectWallet = async (authToken?: string): Promise<boolean> => {
    const token = authToken || localStorage.getItem('token');
    if (!token) {
      this.state.fetchBalanceError = 'Authentication required to disconnect wallet.';
      return false;
    }

    try {
      this.state.isConnecting = true;
      this.state.fetchBalanceError = null;

      const response: DisconnectWalletResponse = await this.disconnectWalletUseCase.execute(token);
      
      if (response.success) {
        this.resetWalletState();
        return true;
      } else {
        this.state.fetchBalanceError = 'Failed to disconnect wallet';
        return false;
      }
    } catch (error) {
      this.state.fetchBalanceError = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      return false;
    } finally {
      this.state.isConnecting = false;
    }
  };

  convertCryptoToFiat = async (amount: number, fromCurrency: string, toCurrency: string): Promise<boolean> => {
    try {
      this.state.isConverting = true;
      this.state.conversionError = null;
      this.state.conversionResult = null;

      const request: ConversionRequest = {
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency
      };

      const response: ConversionResponse = await this.convertCryptoToFiatUseCase.execute(request);
      
      if (response.success) {
        this.state.conversionResult = response;
        this.state.successMessage = `Successfully converted ${amount} ${fromCurrency} to ${toCurrency}`;
        return true;
      } else {
        this.state.conversionError = response.error || 'Conversion failed';
        return false;
      }
    } catch (error) {
      this.state.conversionError = error instanceof Error ? error.message : 'Failed to convert currency';
      return false;
    } finally {
      this.state.isConverting = false;
    }
  };

  fetchExchangeRates = async (silent: boolean = false): Promise<void> => {
    try {
      const response = await this.getExchangeRatesUseCase.execute(['ETH'], ['USD'], 'USD');
      if (response.success && response.rates) {
        this.state.rates = response.rates;
        this.state.fiatCurrency = response.currency;
      } else {
        console.error('Failed to fetch exchange rates:', response.error);
        if (!silent) {
          this.state.fetchBalanceError = response.error || 'Failed to fetch exchange rates';
        }
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      if (!silent) {
        this.state.fetchBalanceError = error instanceof Error ? error.message : 'Failed to fetch exchange rates';
      }
    }
  };

  fetchWalletBalance = async (authToken?: string, options?: { silent?: boolean }): Promise<void> => {
    const token = authToken || localStorage.getItem('token');
    const silent = options?.silent ?? false;

    if (!token) {
      if (!silent) {
        this.state.fetchBalanceError = 'Authentication required to fetch balance.';
      }
      return;
    }

    try {
      this.state.isFetchingBalance = true;
      this.state.fetchBalanceError = null;

      const response = await this.getWalletBalanceUseCase.execute(token);
      if (response.success && response.data) {
        const walletData = response.data;
        const parsedBalance = parseFloat(walletData.balance_eth);

        this.state.walletAddress = walletData.wallet_address;
        this.state.ethBalance = isNaN(parsedBalance) ? 0 : parsedBalance;

        localStorage.setItem('walletAddress', walletData.wallet_address);
        localStorage.setItem('ethBalance', this.state.ethBalance.toString());
        localStorage.setItem('walletConnected', 'true');

        await this.fetchExchangeRates(silent);
      } else {
        this.state.walletAddress = null;
        this.state.ethBalance = null;
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('ethBalance');

        if (!silent) {
          this.state.fetchBalanceError = 'No wallet data found or invalid response';
        }
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      this.state.walletAddress = null;
      this.state.ethBalance = null;
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('ethBalance');

      if (!silent) {
        this.state.fetchBalanceError = error instanceof Error ? error.message : 'Failed to fetch wallet balance';
      }
    } finally {
      this.state.isFetchingBalance = false;
    }
  };

  // Check if wallet was previously connected (from localStorage)
  checkWalletConnection = async (authToken?: string) => {
    const token = authToken || localStorage.getItem('token');
    if (!token) {
      return;
    }

    const walletAddress = localStorage.getItem('walletAddress');
    const walletConnected = localStorage.getItem('walletConnected') === 'true';

    if (walletAddress && walletConnected) {
      this.state.walletAddress = walletAddress;
      await this.fetchWalletBalance(token);
      return;
    }

    await this.fetchWalletBalance(token, { silent: true });
  };

  // Getters
  get formData() {
    return {
      privateKey: this.state.privateKey,
      walletName: this.state.walletName,
      walletType: this.state.walletType
    };
  }


  get isConnecting() {
    return this.state.isConnecting;
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


  get fetchBalanceError() {
    return this.state.fetchBalanceError;
  }

  get sendEthError() {
    return this.state.sendEthError;
  }

  get conversionError() {
    return this.state.conversionError;
  }

  get isConverting() {
    return this.state.isConverting;
  }

  get conversionResult() {
    return this.state.conversionResult;
  }

  get successMessage() {
    return this.state.successMessage;
  }


  get walletAddress() {
    return this.state.walletAddress;
  }

  get ethBalance() {
    return this.state.ethBalance || 0;
  }



  get usdBalance() {
    if (this.state.ethBalance !== null && this.state.rates && this.state.rates.ETH) {
      return this.state.ethBalance * this.state.rates.ETH;
    }
    return 0; // Return 0 instead of null
  }

  get rates() {
    return this.state.rates;
  }

  get fiatCurrency() {
    return this.state.fiatCurrency;
  }


  resetWalletState = () => {
    this.state.walletAddress = null;
    this.state.ethBalance = null;
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('ethBalance');
    localStorage.removeItem('privateKey');
  };


  get isWalletConnected() {
  return !!this.state.walletAddress;
  }
}