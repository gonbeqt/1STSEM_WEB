// src/Presentation/pages/manager/home/page.tsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Charts from '../../../components/Charts';
import EthereumIcon from '../../../components/icons/EthereumIcon';
import WalletModal from '../../../components/WalletModal';
import PaymentModal from './Modal/Payment/PaymentModal';
import PayrollModal from './Modal/Payroll/PayrollModal';
import { Loader2, Clock, TrendingDown, Send, DollarSign, FileText, TrendingUp, RefreshCw, ClipboardList, Copy, ChevronDown, MoreVertical, ChevronRight, Plug } from 'lucide-react';
import AuditContractModal from './Modal/AuditContractModal/AuditContractModal';
import GenerateReportModal from './Modal/GenerateReportModal/GenerateReportModal';
import InvestModal from './Modal/InvestModal/InvestModal';
import { useWallet } from '../../../hooks/useWallet';
import RecentTransactionDetails from '../../../components/RecentTransactionDetails';
import { useEnhancedTransactionHistory } from '../../../hooks/useEnhancedTransactionHistory';
import ManagerNavbar from '../../../components/ManagerNavbar';
import Skeleton, { SkeletonCircle, SkeletonText } from '../../../components/Skeleton';
// Use a runtime string path for the background image so TypeScript doesn't need a module for .png files
const WalletCardBg = '/assets/wallet_bg.png';

type WalletModalInitialView = 'connect' | 'send';

const Home = observer(() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isAuditContractModalOpen, setIsAuditContractModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    fetchTransactionHistory,
    pagination
  } = useEnhancedTransactionHistory();

  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);

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
      from_address: transaction.from_address,
      to_address: transaction.to_address,
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

  // Fetch the 5 most recent transactions for manager on load
  useEffect(() => {
    fetchTransactionHistory({
      limit: 5,
      offset: 0
    });
  }, []); // intentionally run once on mount

  const fetchAllTransactions = async () => {
    // Determine a sensible limit: use pagination.total if available, otherwise a large fallback
    const limit = pagination?.total && pagination.total > 0 ? pagination.total : 10000;
    await fetchTransactionHistory({ limit, offset: 0 });
  };

  const openTransactionDetails = (tx: any) => {
    setSelectedTransaction(tx);
    setIsTransactionDetailsOpen(true);
  };

  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
    setIsTransactionDetailsOpen(false);
  };

  const openTransactionsModal = async () => {
    if (isLoadingTransactions) return;
    setIsTransactionsModalOpen(true);
    try {
      await fetchAllTransactions();
    } catch (err) {
      console.error('Failed to load all transactions for modal:', err);
    }
  };

  const closeTransactionsModal = async () => {
    setIsTransactionsModalOpen(false);
    // restore recent 5 transactions on close
    try {
      await fetchTransactionHistory({ limit: 5, offset: 0 });
    } catch (err) {
      console.error('Failed to restore recent transactions:', err);
    }
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
    const totalValue = Number(data?.total) || 0;
    const formattedTotal = totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (data?.action === 'process') {
      const successCount = data?.processSummary?.successCount ?? 0;
      const failedCount = data?.processSummary?.errorCount ?? 0;
      const successText = `Processed payroll for ${successCount} employee${successCount === 1 ? '' : 's'}.`;
      const failureText = failedCount
        ? ` ${failedCount} payment${failedCount === 1 ? '' : 's'} failed to complete.`
        : '';

      alert(`${successText}${failureText} Total scheduled amount: $${formattedTotal} USD.`);
      return;
    }

    if (data?.action === 'create') {
      const createdCount = data?.creationSummary?.successCount ?? (data?.employees?.length || 0);
      const failedCount = data?.creationSummary?.errorCount ?? 0;
      const successText = `Created payroll entries for ${createdCount} employee${createdCount === 1 ? '' : 's'}.`;
      const failureText = failedCount
        ? ` ${failedCount} entry${failedCount === 1 ? '' : 'ies'} failed to create.`
        : '';

      alert(`${successText}${failureText} Total scheduled amount: $${formattedTotal} USD.`);
      return;
    }

    alert(`Payroll action completed. Total scheduled amount: $${formattedTotal} USD.`);
  };

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      alert('Address copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      <ManagerNavbar />

      <div className="w-full mx-auto px-4 sm:px-6 py-6">
         <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        </div>

    
        {/* Connected Wallet Card */}
        <div
          className="rounded-3xl p-6 text-white shadow-xl mb-6 relative bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{
            backgroundColor: '#8b5cf6',
            backgroundImage: `linear-gradient(135deg, rgba(168,85,247,0.92), rgba(91,33,182,0.88)), url(${WalletCardBg})`,
            backgroundBlendMode: 'overlay, normal',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <span className="text-sm font-medium text-purple-100">
              Current Balance
            </span>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 hover:bg-white/20 rounded-full transition-all"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
                    {!isWalletConnected ? (
                      <button
                        onClick={() => {
                          handleOpenWalletModal('connect');
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 transition-colors text-left font-semibold"
                      >
                        <Plug className="w-4 h-4" />
                        <span className="text-sm">Connect Wallet</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            fetchWalletBalance();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span className="text-sm font-medium">Refresh Balance</span>
                        </button>
                        <button
                          onClick={() => {
                            handleDisconnectWallet();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                          disabled={isConnecting}
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm font-medium">Disconnecting...</span>
                            </>
                          ) : (
                            <span className="text-sm font-medium">Disconnect Wallet</span>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {!isWalletConnected ? (
            <>
              <div className="mb-4 flex flex-col items-start gap-2">
                <span className="text-lg font-semibold text-white/90">No connected wallet</span>
                <p className="text-sm text-purple-100/80">
                  Connect a wallet to see live balances and manage transactions.
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <EthereumIcon className="w-8 h-8 text-white fill-white" />
                  <h2 className="text-3xl sm:text-5xl font-bold">0.000000 ETH</h2>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-purple-100">Converted to {conversionCurrency}</p>
                  <p className="text-xl font-semibold">
                    {conversionCurrency === 'PHP' ? '₱' : '$'}0.00
                  </p>
                </div>
                <button
                  onClick={toggleCurrency}
                  className="flex items-center gap-1 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <span className="text-sm font-medium">{conversionCurrency}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

          
            </>
          ) : (
            <>
              <div className="mb-4 flex flex-col items-start gap-3">
                <span className="text-l font-semibold text-white/90">Metamask</span>
                {walletAddress && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-opacity-30 transition-all"
                    >
                      <span className="text-sm font-mono">
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                      </span>
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Balance */}
              <div className="mb-4">
                {isFetchingBalance ? (
                  <div className="flex items-center gap-3">
                    <SkeletonCircle className="h-12 w-12 bg-white/20 from-white/20 via-white/40 to-white/20" />
                    <Skeleton className="h-10 w-48 bg-white/20 from-white/20 via-white/40 to-white/20" />
                  </div>
                ) : ethBalance !== null ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <EthereumIcon className="w-8 h-8 text-white fill-white" />
                    <h2 className="text-3xl sm:text-5xl font-bold">{ethBalance.toFixed(6)} ETH</h2>
                  </div>
                ) : (
                  <h2 className="text-3xl sm:text-5xl font-bold">0.000000 ETH</h2>
                )}
              </div>

              {/* Converted Balance */}
              {ethBalance && ethBalance > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-purple-100">Converted to {conversionCurrency}</p>
                    {isAutoConverting ? (
                      <Skeleton className="h-6 w-32 bg-white/20 from-white/20 via-white/40 to-white/20" />
                    ) : convertedBalance !== null ? (
                      <p className="text-xl font-semibold">
                        {conversionCurrency === 'PHP' ? '₱' : '$'}{convertedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    ) : (
                      <p className="text-lg text-purple-200">Loading...</p>
                    )}
                  </div>

                  {/* Currency Toggle */}
                  <button
                    onClick={toggleCurrency}
                    className="flex items-center gap-1 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <span className="text-sm font-medium">{conversionCurrency}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              {fetchBalanceError && (
                <p className="text-sm text-red-300 mt-2">{fetchBalanceError}</p>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <button
              onClick={handleSendPayment}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Send Payment</span>
            </button>

            <button
              onClick={handleSendPayroll}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Send Payroll</span>
            </button>

            <button
              onClick={handleAuditContract}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Audit Contract</span>
            </button>

            <button
              onClick={handleGenerateReport}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Generate Report</span>
            </button>

            <button
              onClick={handleInvestment}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Invest Smart</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button
              onClick={openTransactionsModal}
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 transition-colors"
            >
              <MoreVertical className="w-4 h-4 rotate-90" />
              View all
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Showing 5 most recent</p>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoadingTransactions ? (
              <div className="space-y-4 p-6">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <SkeletonCircle className="h-10 w-10 bg-gray-100" />
                      <div className="flex flex-col gap-2 w-full">
                        <SkeletonText className="w-48 max-w-full" />
                        <SkeletonText className="w-32 max-w-full h-3" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                      <SkeletonText className="w-24 h-4" />
                      <SkeletonText className="w-20 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactionError ? (
              <div className="p-6">
                <p className="text-sm text-red-600">Error loading transactions: {transactionError}</p>
              </div>
            ) : transactionData.length === 0 ? (
              <div className="p-6">
                <div className="rounded-3xl border border-dashed border-purple-200 bg-purple-50/40 px-6 py-10 text-center">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">No transactions found</h4>
                  <p className="text-sm text-gray-500">Total transactions loaded: {transactions.length}</p>
                </div>
              </div>
            ) : (
              transactionData.slice(0, 5).map((tx: any, index: number, arr: any[]) => (
                <div
                  key={index}
                  onClick={() => openTransactionDetails(tx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openTransactionDetails(tx); }}
                  className={`cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 transition-colors ${
                    index !== arr.length - 1 ? 'border-b border-gray-100' : ''
                  } hover:bg-purple-50/30`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        tx.type === 'outflow' ? 'bg-red-50 text-red-600' : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {tx.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{tx.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {tx.hash ? `${tx.hash.substring(0, 10)}...` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 text-left sm:text-right">
                    <p
                      className={`font-semibold text-sm sm:text-base ${
                        tx.type === 'outflow' ? 'text-red-600' : 'text-purple-600'
                      }`}
                    >
                      {tx.type === 'outflow' ? '-' : '+'}
                      {(tx.amount || 0).toFixed(4)} {tx.token_symbol}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">{tx.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transactions Modal */}
        {isTransactionsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold">All Transactions</h3>
                  <p className="text-sm text-gray-500">Search by wallet address or hash</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    placeholder="Search address or hash"
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button onClick={() => { setTransactionSearch(''); }} className="text-sm text-gray-500">Clear</button>
                  <button onClick={closeTransactionsModal} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoadingTransactions ? (
                  <div className="space-y-4 p-4">
                    {[...Array(6)].map((_, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <SkeletonCircle className="h-10 w-10" />
                          <div className="flex flex-col gap-2 w-48 max-w-full">
                            <SkeletonText className="w-full" />
                            <SkeletonText className="w-32 h-3" />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-32">
                          <SkeletonText className="w-full h-4" />
                          <SkeletonText className="w-24 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : transactionData.length === 0 ? (
                  <div className="p-4">
                    <p className="text-sm text-gray-600">No transactions found</p>
                  </div>
                ) : (
                  // filter transactions by wallet address (from/to) when a search is provided
                  transactions
                    .filter((transaction: any) => {
                      const q = transactionSearch.trim().toLowerCase();
                      if (!q) return true;
                      const from = (transaction.counterparty_name || transaction.transaction_hash || '').toString().toLowerCase();
                      const to = (transaction.transaction_hash || '').toString().toLowerCase();
                      const rawFrom = (transaction.from_address || '').toString().toLowerCase();
                      const rawTo = (transaction.to_address || '').toString().toLowerCase();
                      return from.includes(q) || to.includes(q) || rawFrom.includes(q) || rawTo.includes(q);
                    })
                    .map((transaction: any, idx: number) => {
                      // Map to display format as in transactionData
                      const displayAmount = typeof transaction.amount_eth === 'string'
                        ? parseFloat(transaction.amount_eth) || 0
                        : Number(transaction.amount_eth) || 0;
                      const tx = {
                        name: getTransactionName(transaction),
                        amount: displayAmount,
                        type: transaction.status === 'confirmed' ? 'outflow' : 'pending',
                        date: formatTransactionDate(transaction.created_at),
                        icon: getTransactionIcon(transaction),
                        hash: transaction.transaction_hash,
                        token_symbol: 'ETH',
                        counterparty_name: transaction.counterparty_name,
                        counterparty_role: transaction.counterparty_role,
                        category: transaction.transaction_category,
                        ai_analysis: transaction.ai_analysis,
                        explorer_url: transaction.explorer_url
                      };
                      return (
                        <div key={idx} className={`flex items-center justify-between p-4 border-b border-gray-100`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'outflow' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                              {tx.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{tx.name}</p>
                              <p className="text-sm text-gray-500">{tx.hash ? `${tx.hash.substring(0, 10)}...` : 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${tx.type === 'outflow' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {tx.type === 'outflow' ? '-' : '+'}{(tx.amount || 0).toFixed(4)} {tx.token_symbol}
                            </p>
                            <p className="text-sm text-gray-500">{tx.date}</p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        
      </div>

      {/* All Modals */}
      <RecentTransactionDetails
        isOpen={isTransactionDetailsOpen}
        transaction={selectedTransaction}
        onClose={closeTransactionDetails}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        initialView={walletModalInitialView}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

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