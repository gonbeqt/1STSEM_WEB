// src/Presentation/pages/employee/home/page.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Bell, RotateCcw, Loader2, Wifi, ChevronRight, Clock, TrendingDown } from 'lucide-react';
import { useWallet } from '../../../hooks/useWallet';
import { useEnhancedTransactionHistory } from '../../../hooks/useEnhancedTransactionHistory';
import WalletModal from '../../../components/WalletModal';
import EthereumIcon from '../../../components/icons/EthereumIcon';

type WalletModalInitialView = 'connect' | 'send';

const EmployeeHome = observer(() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  
  // Conversion state
  const [convertedBalance, setConvertedBalance] = useState<number | null>(null);
  const [conversionCurrency, setConversionCurrency] = useState<string>('USD');
  const [isAutoConverting, setIsAutoConverting] = useState<boolean>(false);
  
  const { isWalletConnected,
    walletAddress,
    ethBalance,
    isFetchingBalance,
    fetchBalanceError,
    successMessage,
    clearSuccessMessage,
    fetchWalletBalance,
    disconnectWallet,
    isConnecting,
    convertCryptoToFiat,
    conversionResult,
    checkWalletConnection
  } = useWallet();

  const { 
    transactions, 
    isLoading: isLoadingTransactions, 
    error: transactionError, 
    refreshTransactions,
    fetchTransactionHistory
  } = useEnhancedTransactionHistory();

  const formatTransactionDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hrs ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTransactionIcon = (transaction: any) => {
    if (transaction.status === 'pending') {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    }
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getTransactionName = (transaction: any): string => {
    // Use counterparty name if available
    if (transaction.counterparty_name) {
      return `${transaction.transaction_category === 'SENT' ? 'Sent to' : 'Received from'} ${transaction.counterparty_name}`;
    }
    
    // Use category description from backend
    if (transaction.category_description) {
      return transaction.category_description;
    }
    
    // Fallback to transaction category
    const categoryLabels: Record<string, string> = {
      'SENT': 'Sent ETH',
      'RECEIVED': 'Received ETH',
      'TRANSFER': 'Internal Transfer',
      'EXTERNAL': 'External Transaction'
    };
    
    return categoryLabels[transaction.transaction_category] || 'ETH Transaction';
  };

  // Convert API transactions to display format
  const transactionData = transactions.map(transaction => {
    // Use the new amount_eth field from the updated backend and ensure it's a number
    const displayAmount = typeof transaction.amount_eth === 'string' 
      ? parseFloat(transaction.amount_eth) || 0
      : Number(transaction.amount_eth) || 0;
    
    return {
      name: getTransactionName(transaction),
      amount: displayAmount,
      type: transaction.status === 'confirmed' ? 'inflow' : 'pending',
      date: formatTransactionDate(transaction.created_at),
      icon: getTransactionIcon(transaction),
      hash: transaction.transaction_hash,
      token_symbol: 'ETH',
      // Enhanced data from new backend
      counterparty_name: transaction.counterparty_name,
      counterparty_role: transaction.counterparty_role,
      category: transaction.transaction_category,
      ai_analysis: transaction.ai_analysis,
      explorer_url: transaction.explorer_url
    };
  });

  // Check wallet connection on page load
  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  // Clear success message after showing it
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);
  
    // Fetch wallet balance when connected
    useEffect(() => {
      if (isWalletConnected) {
        fetchWalletBalance();
      }
    }, [isWalletConnected, fetchWalletBalance]);

  // Fetch RECEIVED transactions for employee
  useEffect(() => {
    fetchTransactionHistory({ 
      category: 'RECEIVED',
      limit: 10,
      offset: 0
    });
  }, [fetchTransactionHistory]);
  
 
  const getNextMonthFirstDay = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };


 const handleOpenWalletModal = (view: WalletModalInitialView) => {
    setWalletModalInitialView(view);
    setIsWalletModalOpen(true);
  };

  const handleDisconnectWallet = async () => {
    const confirmed = window.confirm('Are you sure you want to disconnect your wallet? This will remove all wallet data from your account.');
    if (confirmed) {
      const success = await disconnectWallet();
      if (success) {
        // Refresh transactions after disconnecting
        fetchTransactionHistory();
      }
    }
  };

  // Auto-convert balance when ETH balance or currency changes
  useEffect(() => {
    const autoConvertBalance = async () => {
      if (ethBalance && ethBalance > 0 && isWalletConnected) {
        setIsAutoConverting(true);
        try {
          const success = await convertCryptoToFiat(ethBalance, 'ETH', conversionCurrency);
          if (success && conversionResult && conversionResult.content && conversionResult.content.length > 0) {
            setConvertedBalance(conversionResult.content[0].total_value);
          }
        } catch (error) {
          console.error('Auto-conversion failed:', error);
        } finally {
          setIsAutoConverting(false);
        }
      }
    };

    autoConvertBalance();
  }, [ethBalance, conversionCurrency, isWalletConnected, convertCryptoToFiat, conversionResult]);

  const toggleCurrency = () => {
    setConversionCurrency(conversionCurrency === 'USD' ? 'PHP' : 'USD');
  };

 return (
    <div className="w-full h-screen max-w-full mx-auto text-gray-800 font-sans p-4 box-border bg-gray-50 animate-[slideIn_0.3s_ease-out]">
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center p-2 bg-gray-50">
        <h1 className="text-2xl font-semibold">Home</h1>
      </div>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="m-0 text-2xl font-semibold text-gray-800">Hi {localStorage.getItem('employee_id') || 'Employee'}</h2>
          <p className="my-1 text-base text-gray-600 font-normal">How are you today?</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-100 border-none rounded-xl p-3 text-gray-800 cursor-pointer transition-colors duration-200 hover:bg-gray-200">
            <Bell size={20} />
          </button>
          <button className="bg-gray-100 border-none rounded-xl p-3 text-gray-800 cursor-pointer transition-colors duration-200 hover:bg-gray-200">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Wallet Balance Card */}
       <div className="mx-5 my-5 bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 rounded-2xl p-6 text-white relative flex-shrink-0">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg opacity-90 font-medium text-white">Current Wallet</span>
            {isWalletConnected && (
              <div className="flex items-center gap-1 bg-green-500 bg-opacity-20 px-2 py-1 rounded-full">
                <Wifi className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Connected</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isWalletConnected ? (
              <button
                className="bg-white bg-opacity-20 border border-white border-opacity-30 text-white px-6 py-4 rounded-full text-base font-medium cursor-pointer backdrop-blur-sm hover:bg-white hover:bg-opacity-40 transition-all"
                onClick={() => handleOpenWalletModal('connect')}
              >
                Connect Wallet
              </button>
            ) : isWalletConnected ? (
              <button
                className="bg-red-500 bg-opacity-80 border border-red-400 border-opacity-50 text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer backdrop-blur-sm hover:bg-red-600 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDisconnectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Disconnecting...
                  </>
                ) : (
                  'Disconnect'
                )}
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <EthereumIcon className="w-6 h-6 fill-white text-white" />
            <span className="text-3xl font-bold text-white">
              {isFetchingBalance ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : ethBalance !== null ? (
                `${ethBalance.toFixed(4)} ETH`
              ) : (
                <span className="text-white"> 0 ETH</span>
              )}
            </span>
          </div>
          
          {/* Auto-converted balance display */}
          {isWalletConnected && ethBalance && ethBalance > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-base opacity-90 font-medium">
                {isAutoConverting ? (
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Converting...
                  </span>
                ) : convertedBalance !== null ? (
                  <span className="text-sm text-white">
                    Converted to {conversionCurrency}: {conversionCurrency === 'USD' ? '$' : '₱'}{convertedBalance.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">Loading conversion...</span>
                )}
              </div>
              <button
                onClick={toggleCurrency}
                className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full hover:bg-opacity-30 transition-all"
              >
                Show {conversionCurrency === 'USD' ? 'PHP' : 'USD'}
              </button>
            </div>
          )}
          
          <div className="text-base opacity-90 font-medium">
            {isFetchingBalance ? (
              <span className="text-sm text-gray-400">Fetching...</span>
            ) : fetchBalanceError ? (
              <span className="text-sm text-red-400">Error fetching balance</span>
            ) : walletAddress ? (
              <span className="text-sm font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            ) : (
              <span className="text-white">Wallet Not Connected</span>
            )}
          </div>
        </div>
      </div>


      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-gray-100 border border-gray-200 rounded-2xl p-4 text-gray-800 flex items-center gap-3 transition-colors duration-200 hover:bg-gray-200">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-purple-500">📤</div>
          <div className="text-left">
            <div className="font-semibold text-sm mb-1">Next Payout</div>
            <div className="text-xs text-gray-600">{getNextMonthFirstDay()}</div>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 border border-gray-200 rounded-2xl p-4 text-gray-800 flex items-center gap-3 transition-colors duration-200 hover:bg-gray-200">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-pink-500">📊</div>
          <div className="text-left">
            <div className="font-semibold text-sm mb-1">Frequency</div>
            <div className="text-xs text-gray-600">Monthly</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex justify-between items-center px-5 my-6 bg-transparent">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 m-0 text-black">Recent Transactions</h2>
          <p className="text-sm text-gray-600 mt-1">Showing RECEIVED transactions only</p>
        </div>
        <div 
          className="flex items-center gap-1 text-indigo-600 text-sm font-medium cursor-pointer transition-colors hover:text-indigo-700"
          onClick={refreshTransactions}
        >
          <span>Refresh</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="mx-5 mb-8 rounded-xl overflow-hidden min-h-[200px]">
        {isLoadingTransactions ? (
          <div className="flex justify-between items-center p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Loading transactions...</div>
              </div>
            </div>
          </div>
        ) : transactionError ? (
          <div className="flex justify-between items-center p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Error loading transactions</div>
                <div className="text-sm text-gray-900">{transactionError}</div>
              </div>
            </div>
          </div>
        ) : transactionData.length === 0 ? (
          <div className="flex justify-between items-center p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">No transactions found</div>
                <div className="text-sm text-gray-900">Start making transactions to see them here.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {transactionData.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'outflow' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {transaction.icon}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 leading-tight">{transaction.name}</div>
                  </div>
                </div>
                <div className={`text-lg font-semibold flex-shrink-0 whitespace-nowrap ${
                  transaction.type === 'outflow' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {transaction.type === 'outflow' ? '' : transaction.type === 'pending' ? '' : '+'}
                  {(transaction.amount || 0).toFixed(4)} {transaction.token_symbol || 'ETH'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        initialView={walletModalInitialView}
      />
    </div>
  );
});

export default EmployeeHome;