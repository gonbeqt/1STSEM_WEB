// src/Presentation/pages/manager/home/page.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import WalletModal from '../../../components/WalletModal';
import PaymentModal from './Modal/Payment/PaymentModal';
import PayrollModal from './Modal/Payroll/PayrollModal';
import AuditContractModal from './Modal/AuditContractModal/AuditContractModal';
import InvestModal from './Modal/InvestModal/InvestModal';
import { useWallet } from '../../../hooks/useWallet';
import RecentTransactionDetails from '../../../components/RecentTransactionDetails';
import { useEnhancedTransactionHistory } from '../../../hooks/useEnhancedTransactionHistory';
import ManagerNavbar from '../../../components/ManagerNavbar';
import { useToast } from '../../../components/Toast/ToastProvider';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { TransactionRecord, DisplayTransaction, mapTransactionToDisplay } from './utils';
import WalletSummaryCard from '../../../components/WalletSummaryCard';
import QuickActions from '../../../components/QuickActions';
import RecentTransactions from '../../../components/RecentTransactions';
import TransactionsModal from '../../../components/TransactionsModal';

type WalletModalInitialView = 'connect' | 'send';

const Home = observer(() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isAuditContractModalOpen, setIsAuditContractModalOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const [convertedBalance, setConvertedBalance] = useState<number | null>(null);
  const [conversionCurrency, setConversionCurrency] = useState<string>('USD');
  const [isAutoConverting, setIsAutoConverting] = useState<boolean>(false);

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
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();
  const {
    transactions,
    isLoading: isLoadingTransactions,
    error: transactionError,
    fetchTransactionHistory,
    pagination
  } = useEnhancedTransactionHistory();

  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<DisplayTransaction | null>(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);

  const transactionData = useMemo<DisplayTransaction[]>(
    () => transactions.map((transaction) => mapTransactionToDisplay(transaction as TransactionRecord)),
    [transactions]
  );

  const recentTransactions = useMemo(() => transactionData.slice(0, 5), [transactionData]);

  const initialWalletCheckDone = useRef(false);
  useEffect(() => {
    if (initialWalletCheckDone.current) return;
    initialWalletCheckDone.current = true;
    checkWalletConnection();
  }, [checkWalletConnection]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  useEffect(() => {
    if (isWalletConnected) {
      fetchWalletBalance();
    }
  }, [isWalletConnected, fetchWalletBalance]);

  const initialTxFetchDone = useRef(false);
  useEffect(() => {
    if (initialTxFetchDone.current) return;
    initialTxFetchDone.current = true;
    fetchTransactionHistory({
      limit: 5,
      offset: 0
    });
  }, [fetchTransactionHistory]);

  const fetchAllTransactions = async () => {
    const limit = pagination?.total && pagination.total > 0 ? pagination.total : 10000;
    await fetchTransactionHistory({ limit, offset: 0 });
  };

  const openTransactionDetails = (tx: DisplayTransaction) => {
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
      toastError('Unable to load all transactions. Please try again.');
    }
  };

  const closeTransactionsModal = async () => {
    setIsTransactionsModalOpen(false);
    // restore recent 5 transactions on close
    try {
      await fetchTransactionHistory({ limit: 5, offset: 0 });
    } catch (err) {
      toastError('Unable to restore recent transactions. Please refresh.');
    }
  };

  const handleOpenWalletModal = (view: WalletModalInitialView) => {
    setWalletModalInitialView(view);
    setIsWalletModalOpen(true);
  };

  const handleDisconnectWallet = () => {
    setShowDisconnectConfirm(true);
  };

  const confirmDisconnect = async () => {
    setShowDisconnectConfirm(false);
    const success = await disconnectWallet();
    if (success) {
      // Refresh transactions after disconnecting
      fetchTransactionHistory();
    }
  };

  const cancelDisconnect = () => setShowDisconnectConfirm(false);

  useEffect(() => {
    if (!isWalletConnected || !ethBalance || ethBalance <= 0) {
      setConvertedBalance(null);
      setIsAutoConverting(false);
      return;
    }

    let isCancelled = false;

    const autoConvertBalance = async () => {
      setIsAutoConverting(true);
      try {
        const success = await convertCryptoToFiat(ethBalance, 'ETH', conversionCurrency);
        if (!success && !isCancelled) {
          setConvertedBalance(null);
        }
      } catch (error) {
        console.error('Auto-conversion failed:', error);
      } finally {
        if (!isCancelled) {
          setIsAutoConverting(false);
        }
      }
    };

    autoConvertBalance();

    return () => {
      isCancelled = true;
    };
  }, [convertCryptoToFiat, conversionCurrency, ethBalance, isWalletConnected]);

  useEffect(() => {
    if (!conversionResult?.content?.length) {
      return;
    }

    const latest = conversionResult.content[0];
    if (latest.fiat?.toUpperCase() !== conversionCurrency) {
      return;
    }

    setConvertedBalance(latest.total_value);
  }, [conversionResult, conversionCurrency]);

  const toggleCurrency = () => {
    setConversionCurrency(conversionCurrency === 'USD' ? 'PHP' : 'USD');
  };

  const handleSendPayment = () => {
    if (!isWalletConnected) {
      toastWarning('Please connect a wallet first');
      handleOpenWalletModal('connect');
      return;
    }
    handleOpenWalletModal('send');
  };

  const handleSendPayroll = () => {
    if (!isWalletConnected) {
      toastWarning('Please connect a wallet first');
      handleOpenWalletModal('connect');
      return;
    }
    setIsPayrollModalOpen(true);
  };

  const handleAuditContract = () => {
    setIsAuditContractModalOpen(true);
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

      toastSuccess(`${successText}${failureText} Total scheduled amount: $${formattedTotal} USD.`);
      return;
    }

    if (data?.action === 'create') {
      const createdCount = data?.creationSummary?.successCount ?? (data?.employees?.length || 0);
      const failedCount = data?.creationSummary?.errorCount ?? 0;
      const successText = `Created payroll entries for ${createdCount} employee${createdCount === 1 ? '' : 's'}.`;
      const failureText = failedCount
        ? ` ${failedCount} entry${failedCount === 1 ? '' : 'ies'} failed to create.`
        : '';

      toastSuccess(`${successText}${failureText} Total scheduled amount: $${formattedTotal} USD.`);
      return;
    }

    toastSuccess(`Payroll action completed. Total scheduled amount: $${formattedTotal} USD.`);
  };

  const copyToClipboard = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      toastSuccess('Address copied to clipboard!', { duration: 2000 });
    } catch (e) {
      toastError('Failed to copy address.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Home</h1>
        </div>


        {/* Wallet Summary Card */}
        <WalletSummaryCard
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          ethBalance={ethBalance}
          isFetchingBalance={isFetchingBalance}
          fetchBalanceError={fetchBalanceError}
          conversionCurrency={conversionCurrency}
          convertedBalance={convertedBalance}
          isAutoConverting={isAutoConverting}
          isConnecting={isConnecting}
          onToggleCurrency={toggleCurrency}
          onOpenWalletModal={handleOpenWalletModal}
          onFetchBalance={fetchWalletBalance}
          onDisconnectClick={handleDisconnectWallet}
          onCopyAddress={copyToClipboard}
        />

        <QuickActions
          onSendPayment={handleSendPayment}
          onSendPayroll={handleSendPayroll}
          onAuditContract={handleAuditContract}
          onInvestment={handleInvestment}
        />

        <RecentTransactions
          isLoading={isLoadingTransactions}
          error={transactionError}
          transactions={transactionData}
          recent={recentTransactions}
          totalCount={transactions.length}
          onViewAll={openTransactionsModal}
          onOpenDetails={openTransactionDetails}
        />

        <TransactionsModal
          isOpen={isTransactionsModalOpen}
          isLoading={isLoadingTransactions}
          transactions={transactionData}
          onClose={closeTransactionsModal}
        />


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

      

      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        title="Disconnect wallet?"
        description="Are you sure you want to disconnect your wallet? This will remove all wallet data from your account."
        confirmText="Disconnect"
        cancelText="Cancel"
        onConfirm={confirmDisconnect}
        onCancel={cancelDisconnect}
      />
    </div>
  );
})

export default Home;