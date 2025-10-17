// src/Presentation/pages/employee/home/page.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Loader2, ChevronRight, Copy, MoreVertical, RefreshCw, ChevronDown, Plug, FileText, CalendarDays } from 'lucide-react';
import { useWallet } from '../../../hooks/useWallet';
import { usePayslips } from '../../../hooks/usePayslips';
import { useViewModel } from '../../../hooks/useViewModel';
import { LoginViewModel } from '../../../../domain/viewmodel/LoginViewModel';
import type { Payslip } from '../../../../domain/entities/PayslipEntities';
import WalletModal from '../../../components/WalletModal';
import EthereumIcon from '../../../components/icons/EthereumIcon';
import EmployeeNavbar from '../../../components/EmployeeNavbar';
import Skeleton, { SkeletonCircle, SkeletonText } from '../../../components/Skeleton';
import { useToast } from '../../../components/Toast/ToastProvider';
import ConfirmDialog from '../../../components/ConfirmDialog';

const WalletCardBg = '/assets/wallet_bg.png';

type WalletModalInitialView = 'connect' | 'send';

const EmployeeHome = observer(() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const menuRootRef = useRef<HTMLDivElement | null>(null);
  const skipNextOutsideRef = useRef(false);

  // Conversion state
  const [convertedBalance, setConvertedBalance] = useState<number | null>(null);
  const [conversionCurrency, setConversionCurrency] = useState<string>('USD');
  const [isAutoConverting, setIsAutoConverting] = useState<boolean>(false);
  const { success: toastSuccess, error: toastError } = useToast();

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
  const loginViewModel = useViewModel(LoginViewModel);
  const currentUser = loginViewModel?.currentUser;
  const userId = currentUser?.id;

  const {
    payslips,
    loading: isLoadingPayslips,
    error: payslipsError,
    refreshPayslips
  } = usePayslips({ userId }, { enabled: Boolean(userId) });

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Not provided';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency = 'USD'): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(amount);
    } catch {
      return `$${amount.toFixed(2)}`;
    }
  };

  const resolveNetPay = (payslip: Payslip): number => {
    const value = payslip.final_net_pay ?? payslip.net_amount ?? payslip.usd_equivalent ?? 0;
    return Number.isFinite(value) ? Number(value) : 0;
  };

  const resolveCurrency = (payslip: Payslip): string => payslip.salary_currency || 'USD';

  const payslipStatusTone = (status?: string) => {
    const normalized = (status || '').toUpperCase();
    if (normalized === 'PAID') return 'bg-green-100 text-green-700 border-green-200';
    if (normalized === 'PENDING') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (normalized === 'GENERATED') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const recentPayslips = useMemo(() => {
    if (!payslips || payslips.length === 0) return [];
    return [...payslips]
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.pay_date || a.pay_period_end || 0).getTime();
        const dateB = new Date(b.created_at || b.pay_date || b.pay_period_end || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [payslips]);

  const getPayPeriodLabel = (payslip: Payslip) => `${formatDate(payslip.pay_period_start)} - ${formatDate(payslip.pay_period_end)}`;

  const getPayDateLabel = (payslip: Payslip) => formatDate(payslip.pay_date || payslip.created_at || payslip.issued_at);

  const canRefreshPayslips = Boolean(userId);

  // Check wallet connection on page load (guard StrictMode double-invoke)
  const initialWalletCheckDone = useRef(false);
  useEffect(() => {
    if (initialWalletCheckDone.current) return;
    initialWalletCheckDone.current = true;
    checkWalletConnection();
  }, [checkWalletConnection]);

  useEffect(() => {
    if (!successMessage) return;
    toastSuccess(successMessage, { duration: 2400 });
    clearSuccessMessage();
  }, [successMessage, clearSuccessMessage, toastSuccess]);

  // Fetch wallet balance when connected
  useEffect(() => {
    if (isWalletConnected) {
      fetchWalletBalance();
    }
  }, [isWalletConnected, fetchWalletBalance]);


  useEffect(() => {
    if (payslipsError) {
      toastError(payslipsError);
    }
  }, [payslipsError, toastError]);


  const getNextMonthFirstDay = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };


  const handleOpenWalletModal = (view: WalletModalInitialView) => {
    setWalletModalInitialView(view);
    setIsWalletModalOpen(true);
  };

  const toggleMenu = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isMenuOpen) {
      skipNextOutsideRef.current = true;
      setIsMenuOpen(true);
      // allow the opening click to complete before we start reacting to outside clicks
      setTimeout(() => { skipNextOutsideRef.current = false; }, 0);
    } else {
      setIsMenuOpen(false);
    }
  };

  // Close on outside click using a document listener (more robust than overlay)
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleDown = (ev: MouseEvent) => {
      if (skipNextOutsideRef.current) { skipNextOutsideRef.current = false; return; }
      const root = menuRootRef.current;
      if (root && ev.target instanceof Node && !root.contains(ev.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [isMenuOpen]);

  const handleDisconnectWallet = async () => {
    setShowDisconnectConfirm(true);
  };

  const confirmDisconnect = async () => {
    setShowDisconnectConfirm(false);
    const success = await disconnectWallet();
    if (success) {
      await refreshPayslips();
    }
  };

  const cancelDisconnect = () => setShowDisconnectConfirm(false);

  const copyToClipboard = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      toastSuccess('Address copied to clipboard!', { duration: 2000 });
    } catch (e) {
      toastError('Failed to copy address.');
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
  }, [ethBalance, conversionCurrency, isWalletConnected]); // intentionally omit fn deps to avoid loop

  const toggleCurrency = () => {
    setConversionCurrency(conversionCurrency === 'USD' ? 'PHP' : 'USD');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <EmployeeNavbar />


      <div className="w-full mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Home</h1>
          <p className="text-sm text-gray-500">Your personal dashboard — balances, upcoming payouts, and recent activity.</p>
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
            <div className="relative" ref={menuRootRef}>
              <button
                onMouseDown={(e) => { e.stopPropagation(); skipNextOutsideRef.current = true; setTimeout(() => { skipNextOutsideRef.current = false; }, 0); }}
                onClick={toggleMenu}
                className="p-1 hover:bg-white/20 rounded-full transition-all"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isMenuOpen && (
                <>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
                    {!isWalletConnected ? (
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
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
                          onMouseDown={(e) => e.stopPropagation()}
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
                          onMouseDown={(e) => e.stopPropagation()}
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


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

        {/* Recent Payslips */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-0 sm:px-5 my-6 bg-transparent">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 m-0">Recent Payslips</h2>
            <p className="text-sm text-gray-600 mt-1">Your latest payroll documents in one place.</p>
          </div>
          <button
            type="button"
            className={`inline-flex items-center gap-1 text-sm font-medium self-start sm:self-center transition-colors ${
              canRefreshPayslips && !isLoadingPayslips ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={() => canRefreshPayslips && refreshPayslips()}
            disabled={!canRefreshPayslips || isLoadingPayslips}
          >
            <span>{isLoadingPayslips ? 'Refreshing…' : 'Refresh'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-8 sm:mx-5 rounded-xl overflow-hidden min-h-[200px]">
          {isLoadingPayslips ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl">
                  <div className="flex items-start sm:items-center gap-4 w-full">
                    <SkeletonCircle className="h-10 w-10 bg-gray-100" />
                    <div className="flex flex-col gap-2 flex-1">
                      <SkeletonText className="w-48 max-w-full" />
                      <SkeletonText className="w-32 max-w-full h-3" />
                    </div>
                  </div>
                  <SkeletonText className="w-24 h-4" />
                </div>
              ))}
            </div>
          ) : !canRefreshPayslips ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl text-gray-600 text-sm">
              <p className="m-0">Sign in to view your payslips.</p>
            </div>
          ) : payslipsError ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-white min-h-[70px] shadow-sm border border-red-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-700">Unable to load payslips</div>
                  <div className="text-sm text-red-600">{payslipsError}</div>
                </div>
              </div>
            </div>
          ) : recentPayslips.length === 0 ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-white min-h-[70px] shadow-sm border border-gray-100 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">No payslips yet</div>
                  <div className="text-sm text-gray-600">Your payslips will appear here once generated.</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPayslips.map((payslip) => {
                const netPay = resolveNetPay(payslip);
                const currency = resolveCurrency(payslip);
                const cryptoAmount = payslip.crypto_amount;
                return (
                  <div key={payslip.payslip_id} className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                          <FileText className="w-5 h-5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">{payslip.payslip_number}</p>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${payslipStatusTone(payslip.status)}`}>
                              {payslip.status || 'UNKNOWN'}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {getPayPeriodLabel(payslip)}
                            </span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span>Pay date: {getPayDateLabel(payslip)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1 text-sm text-gray-600">
                        <span className="text-xs uppercase tracking-wide">Net Pay</span>
                        <span className="text-lg font-semibold text-green-600">
                          {formatCurrency(netPay, currency)}
                        </span>
                        {typeof cryptoAmount === 'number' && payslip.cryptocurrency ? (
                          <span className="text-xs text-gray-500">
                            {cryptoAmount.toFixed(6)} {payslip.cryptocurrency}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>


      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        initialView={walletModalInitialView}
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
});

export default EmployeeHome;