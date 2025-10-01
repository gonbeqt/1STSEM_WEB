// src/Presentation/pages/manager/home/page.tsx
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Charts from '../../../components/Charts';
import EthereumIcon from '../../../components/icons/EthereumIcon';
import WalletModal from '../../../components/WalletModal';
import PaymentModal from './Modal/Payment/PaymentModal';
import PayrollModal from './Modal/Payroll/PayrollModal';
import {
  Bell,
  User,
  ChevronRight,
  TrendingUpIcon,
  ClipboardList,
  ChartBarIncreasing,
  Users,
  Loader2,
  Wifi,
  WifiOff,
  Clock,
  TrendingDown,
  RotateCcw,
} from 'lucide-react';
import AuditContractModal from './Modal/AuditContractModal/AuditContractModal';
import GenerateReportModal from './Modal/GenerateReportModal/GenerateReportModal';
import { useWallet } from '../../../hooks/useWallet';
import { useTransactionHistory } from '../../../hooks/useTransactionHistory';

type WalletModalInitialView = 'connect' | 'send';

const Home = observer(() => {                                                   
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isAuditContractModalOpen, setIsAuditContractModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);

  // Wallet state
  const {
    isWalletConnected,
    walletAddress,
    ethBalance,
    isFetchingBalance,
    fetchBalanceError,
    successMessage,
    clearSuccessMessage,
    isReconnecting,
    reconnectError,
    fetchWalletBalance
  } = useWallet();
  const { 
    transactions, 
    isLoading: isLoadingTransactions, 
    error: transactionError, 
    refreshTransactions,
    fetchTransactionHistory
  } = useTransactionHistory();
  
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
    if (transaction.from_wallet_name) {
      return `Sent ${transaction.token_symbol || 'ETH'} via ${transaction.from_wallet_name}`;
    }
    if (transaction.transaction_type) {
      const typeLabels: Record<string, string> = {
        'transfer': 'Transfer',
        'salary': 'Salary Payment',
        'bonus': 'Bonus Payment',
        'expense': 'Expense',
        'other': 'Other Transaction'
      };
      return typeLabels[transaction.transaction_type] || 'Transaction';
    }
    return `${transaction.token_symbol || 'ETH'} Transaction`;
  };

  // Convert API transactions to display format
  const transactionData = transactions.map(transaction => {
    console.log('Processing transaction:', {
      id: transaction._id,
      status: transaction.status,
      from_address: transaction.from_address,
      to_address: transaction.to_address,
      amount: transaction.amount,
      amountType: typeof transaction.amount,
      allFields: Object.keys(transaction),
      fullTransaction: transaction
    });
    
    // Parse amount from database - check multiple possible amount fields
    let displayAmount = 0;
    
    // Try different possible amount field names from eth_transactions collection
    const amountValue = transaction.amount || 
                       (transaction as any).amount_eth || 
                       (transaction as any).value || 
                       (transaction as any).eth_amount ||
                       (transaction as any).amount_wei ||
                       (transaction as any).total_cost_eth;
    
    if (amountValue !== null && amountValue !== undefined) {
      // Convert to number if it's a string
      displayAmount = typeof amountValue === 'string' 
        ? parseFloat(amountValue) 
        : Number(amountValue);
      
      // If we're using amount_wei, convert from wei to ETH (divide by 10^18)
      if ((transaction as any).amount_wei && !(transaction as any).amount_eth) {
        displayAmount = displayAmount / Math.pow(10, 18);
        console.log('Converted from wei to ETH:', {
          wei: amountValue,
          eth: displayAmount
        });
      }
      
      console.log('Amount conversion:', {
        original: amountValue,
        type: typeof amountValue,
        parsed: displayAmount,
        fieldUsed: transaction.amount ? 'amount' : 
                  (transaction as any).amount_eth ? 'amount_eth' :
                  (transaction as any).value ? 'value' :
                  (transaction as any).eth_amount ? 'eth_amount' :
                  (transaction as any).amount_wei ? 'amount_wei' :
                  (transaction as any).total_cost_eth ? 'total_cost_eth' : 'none'
      });
    } else {
      console.log('No amount field found. Available fields:', Object.keys(transaction));
    }
    
    console.log('Final display amount:', displayAmount, 'for transaction:', transaction._id);
    
    return {
      name: getTransactionName(transaction),
      amount: displayAmount,
      type: transaction.status === 'confirmed' ? 'outflow' : 'pending',
      date: formatTransactionDate(transaction.timestamp || transaction.created_at),
      icon: getTransactionIcon(transaction),
      hash: transaction.transaction_hash,
      token_symbol: transaction.token_symbol || 'ETH'
    };
  });

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

  // Fetch SENT transactions for manager
  useEffect(() => {
    console.log('Fetching SENT transactions for manager...');
    fetchTransactionHistory({ 
      category: 'SENT',
      limit: 10,
      offset: 0
    });
  }, [fetchTransactionHistory]);

  const handleOpenWalletModal = (view: WalletModalInitialView) => {
    setWalletModalInitialView(view);
    setIsWalletModalOpen(true);
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
    console.log("handleSendPayroll called");
    setIsPayrollModalOpen(true);
  };

  const handleAuditContract = () => {
    console.log("handleAuditContract called. Setting isAuditContractModalOpen to true.");
    setIsAuditContractModalOpen(true);
  }

  const handleGenerateReport = () => {
    setIsGenerateReportModalOpen(true);
  }

  const handleProcessPayroll = (data: any) => {
    console.log('Processing payroll:', data);
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

      {/* Reconnection Error Message */}
      {reconnectError && (
        <div className="fixed top-16 right-4 z-50 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <div>
              <p className="text-sm font-medium">Auto-reconnect failed</p>
              <p className="text-xs">Please connect your wallet manually</p>
            </div>
          </div>
        </div>
      )}

      {/* Reconnecting Indicator */}
      {isReconnecting && (
        <div className="fixed top-4 right-4 z-50 bg-blue-100 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Reconnecting wallet...</span>
          </div>
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
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RotateCcw size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Current Wallet Card */}
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
            {isReconnecting && (
              <div className="flex items-center gap-1 bg-blue-500 bg-opacity-20 px-2 py-1 rounded-full">
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                <span className="text-xs text-blue-400 font-medium">Connecting...</span>
              </div>
            )}
          </div>

          {!isWalletConnected && !isReconnecting ? (
            <button
              className="bg-white bg-opacity-20 border border-white border-opacity-30 text-white px-6 py-4 rounded-full text-base font-medium cursor-pointer backdrop-blur-sm hover:bg-white hover:bg-opacity-40 transition-all"
              onClick={() => handleOpenWalletModal('connect')}
            >
              Connect Wallet
            </button>
          ) : null}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 px-5 mb-8 flex-shrink-0">
        {/* Send Payment */}
        <button
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl cursor-pointer transition-all border border-gray-100 hover:-translate-y-0.5 hover:shadow-lg z-10"
          onClick={handleSendPayment}
        >
          <div className="w-6 h-6 rounded-xl p-2.5 flex items-center justify-center bg-blue-100 text-blue-600">
            <TrendingUpIcon className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Send Payment</span>
        </button>

        {/* Send Payroll */}
        <button
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl cursor-pointer transition-all border border-gray-100 hover:-translate-y-0.5 hover:shadow-lg z-10"
          onClick={handleSendPayroll}
        >
          <div className="w-6 h-6 rounded-xl p-2.5 flex items-center justify-center bg-yellow-500 text-white">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Send Payroll</span>
        </button>

        {/* Audit Contract */}
        <button
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl cursor-pointer transition-all border border-gray-100 hover:-translate-y-0.5 hover:shadow-lg z-10"
          onClick={handleAuditContract}
        >
          <div className="w-6 h-6 rounded-xl p-2.5 flex items-center justify-center bg-green-100 text-green-600">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Audit Contract</span>
        </button>

        {/* Generate Report */}
        <button
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl cursor-pointer transition-all border border-gray-100 hover:-translate-y-0.5 hover:shadow-lg z-10"
          onClick={handleGenerateReport}
        >
          <div className="w-6 h-6 rounded-xl p-2.5 flex items-center justify-center bg-pink-100 text-pink-600">
            <ChartBarIncreasing className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">Generate Report</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="flex justify-between items-center px-5 my-6 bg-transparent">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 m-0 text-black">Recent Transactions</h2>
          <p className="text-sm text-gray-600 mt-1">Showing SENT transactions only</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             className="flex items-center gap-1 text-indigo-600 text-sm font-medium cursor-pointer transition-colors hover:text-indigo-700"
             onClick={() => {
               console.log('Refreshing SENT transactions...');
               fetchTransactionHistory({ 
                 category: 'SENT',
                 limit: 10,
                 offset: 0
               });
             }}
           >
             <span>Refresh</span>
             <ChevronRight className="w-4 h-4" />
           </button>
           <button 
             className="flex items-center gap-1 text-blue-600 text-sm font-medium cursor-pointer transition-colors hover:text-blue-700"
             onClick={() => {
               console.log('Fetching ALL transactions for testing...');
               fetchTransactionHistory({ 
                 category: 'ALL',
                 limit: 10,
                 offset: 0
               });
             }}
           >
             <span>Test ALL</span>
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
              <div key={index} className="flex justify-between items-center p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'outflow' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {transaction.icon}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 leading-tight">{transaction.name}</div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <div className={`text-lg font-semibold flex-shrink-0 whitespace-nowrap ${
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
          <h2 className="text-lg font-semibold text-gray-900 m-0">Revenue vs Expenses</h2>
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 cursor-pointer">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last month</option>
          </select>
        </div>

        <div className="flex justify-around bg-white mx-5 mb-5 p-5 rounded-xl border border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 uppercase tracking-wide">Revenue</span>
            <span className="text-xl font-bold text-green-600">₱7120</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 uppercase tracking-wide">Expenses</span>
            <span className="text-xl font-bold text-red-600">₱4200</span>
          </div>
        </div>

        <div className="bg-white mx-5 p-5 rounded-xl border border-gray-100">
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
    </div>
  );
})

export default Home;