// src/Presentation/pages/manager/home/page.tsx
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Charts from '../../../components/Charts';
import EthereumIcon from '../../../components/icons/EthereumIcon';
import WalletModal from '../../../components/WalletModal';
import PaymentModal from './Modal/Payment/PaymentModal';
import PayrollModal from './Modal/Payroll/PayrollModal';
import { Bell, Loader2, Wifi, Clock, TrendingDown, Send, DollarSign, FileText, TrendingUp, RefreshCw, ClipboardList } from 'lucide-react';
import AuditContractModal from './Modal/AuditContractModal/AuditContractModal';
import GenerateReportModal from './Modal/GenerateReportModal/GenerateReportModal';
import InvestModal from './Modal/InvestModal/InvestModal';
import { useWallet } from '../../../hooks/useWallet';
import { useEnhancedTransactionHistory } from '../../../hooks/useEnhancedTransactionHistory';

type WalletModalInitialView = 'connect' | 'send';

const Home = observer(() => {                                                   
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isAuditContractModalOpen, setIsAuditContractModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  
  // Conversion state
  const [convertedBalance, setConvertedBalance] = useState<number | null>(null);
  const [conversionCurrency, setConversionCurrency] = useState<string>('USD');
  const [isAutoConverting, setIsAutoConverting] = useState<boolean>(false);

  // Wallet state
  const {
    isWalletConnected,
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
      type: transaction.status === 'confirmed' ? 'outflow' : 'pending',
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

  // Fetch all transactions for manager (no category filtering)
  useEffect(() => {
    fetchTransactionHistory({ 
      limit: 10,
      offset: 0
    });
  }, []); // Remove fetchTransactionHistory from dependencies to prevent infinite loop

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
  }, [ethBalance, conversionCurrency, isWalletConnected]);

  const toggleCurrency = () => {
    setConversionCurrency(conversionCurrency === 'USD' ? 'PHP' : 'USD');
  };

  const handleSendPayment = () => {
    if (!isWalletConnected) {
      alert('Please connect a wallet first');
      handleOpenWalletModal('connect');
      return;
    }
    handleOpenWalletModal('send');
  };

  const handleSendPayroll = () => {
    if (!isWalletConnected) {
      alert('Please connect a wallet first');
      handleOpenWalletModal('connect');
      return;
    }
    setIsPayrollModalOpen(true);
  };

  const handleAuditContract = () => {
    setIsAuditContractModalOpen(true);
  }

  const handleGenerateReport = () => {
    setIsGenerateReportModalOpen(true);
  }

  const handleInvestment = () => {
    setIsInvestModalOpen(true);
  }

  const handleProcessPayroll = (data: any) => {
    alert(`Payroll processed successfully for ${data.employees.length} employees. Total: ₱${data.total.toLocaleString()}`);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 font-sans p-0 m-0 box-border overflow-y-auto">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}



      {/* Header */}
      <div className="text-black p-5">
        <h1 className="text-2xl font-bold">Home</h1>
      </div>
      
      <div className="flex justify-between items-center p-5 pb-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Hi Manager</h2>
          <p className="text-gray-600">How are you today?</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Current Wallet Card */}
      <div className="mx-5 my-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 rounded-3xl p-6 text-white relative flex-shrink-0 shadow-xl">
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
                {walletAddress}
              </span>
            ) : (
              <span className="text-white">Wallet Not Connected</span>
            )}
          </div>
        </div>
      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-5 gap-4 px-5 mb-8 flex-shrink-0">
        {/* Send Payment */}
        <button
          className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl cursor-pointer transition-all duration-200 border border-gray-100 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 group"
          onClick={handleSendPayment}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Send className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors">Send Payment</span>
        </button>

        {/* Send Payroll */}
        <button
          className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl cursor-pointer transition-all duration-200 border border-gray-100 hover:-translate-y-1 hover:shadow-xl hover:border-yellow-200 group"
          onClick={handleSendPayroll}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 transition-colors">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-yellow-600 transition-colors">Send Payroll</span>
        </button>

        {/* Audit Contract */}
        <button
          className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl cursor-pointer transition-all duration-200 border border-gray-100 hover:-translate-y-1 hover:shadow-xl hover:border-green-200 group"
          onClick={handleAuditContract}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-green-600 transition-colors">Audit Contract</span>
        </button>

        {/* Generate Report */}
        <button
          className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl cursor-pointer transition-all duration-200 border border-gray-100 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 group"
          onClick={handleGenerateReport}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-purple-600 transition-colors">Generate Report</span>
        </button>

        {/* Investment */}
        <button
          className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl cursor-pointer transition-all duration-200 border border-gray-100 hover:-translate-y-1 hover:shadow-xl hover:border-pink-200 group"
          onClick={handleInvestment}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-pink-50 text-pink-600 group-hover:bg-pink-100 transition-colors">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-pink-600 transition-colors">Investment</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="flex justify-between items-center px-5 my-6 bg-transparent">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 m-0">Recent Transactions</h2>
          <p className="text-sm text-gray-600 mt-1">Showing all transactions</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             className="flex items-center gap-2 text-indigo-600 text-sm font-medium cursor-pointer transition-colors hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg"
             onClick={() => {
               fetchTransactionHistory({ 
                 limit: 10,
                 offset: 0
               });
             }}
           >
             <RefreshCw className="w-4 h-4" />
             <span>Refresh</span>
           </button>
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
                <div className="text-sm font-medium text-gray-900">No SENT transactions found</div>
                <div className="text-sm text-gray-900">No outgoing transactions to display. Check console for debugging info.</div>
                <div className="text-xs text-gray-500 mt-1">Total transactions loaded: {transactions.length}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {transactionData.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-5 bg-white min-h-[80px] shadow-lg border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    transaction.type === 'outflow' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {transaction.icon}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="text-base font-semibold text-gray-900 leading-tight">{transaction.name}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <div className={`text-xl font-bold flex-shrink-0 whitespace-nowrap ${
                  transaction.type === 'outflow' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {transaction.type === 'outflow' ? '-' : '+'}{(transaction.amount || 0).toFixed(4)} {transaction.token_symbol || 'ETH'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue vs Expenses */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex justify-between items-center px-5 my-6 bg-transparent">
          <h2 className="text-xl font-bold text-gray-900 m-0">Revenue vs Expenses</h2>
          <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 cursor-pointer hover:border-indigo-300 transition-colors shadow-sm">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last month</option>
          </select>
        </div>

        <div className="flex justify-around bg-white mx-5 mb-6 p-6 rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-600 uppercase tracking-wide font-medium">Revenue</span>
            <span className="text-2xl font-bold text-green-600">₱7,120</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm text-gray-600 uppercase tracking-wide font-medium">Expenses</span>
            <span className="text-2xl font-bold text-red-600">₱4,200</span>
          </div>
        </div>

        <div className="bg-white mx-5 p-6 rounded-2xl border border-gray-100 shadow-lg">
          <Charts />
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        initialView={walletModalInitialView}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Payroll Modal */}
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onProcess={handleProcessPayroll}
      />

      <AuditContractModal
        isOpen={isAuditContractModalOpen}
        onClose={() => setIsAuditContractModalOpen(false)}
      />

      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={() => setIsGenerateReportModalOpen(false)}
      />
      
      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
      />
    </div>
  );
})

export default Home;