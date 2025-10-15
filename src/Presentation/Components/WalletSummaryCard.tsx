import React, { useState } from 'react';
import EthereumIcon from './icons/EthereumIcon';
import Skeleton, { SkeletonCircle } from './Skeleton';
import { Loader2, RefreshCw, Plug, Copy, ChevronDown } from 'lucide-react';

const WalletCardBg = '/assets/wallet_bg.png';

type WalletModalInitialView = 'connect' | 'send';

interface Props {
  isWalletConnected: boolean;
  walletAddress?: string | null;
  ethBalance: number | null;
  isFetchingBalance: boolean;
  fetchBalanceError?: string | null;
  conversionCurrency: string;
  convertedBalance: number | null;
  isAutoConverting: boolean;
  isConnecting: boolean;
  onToggleCurrency: () => void;
  onOpenWalletModal: (view: WalletModalInitialView) => void;
  onFetchBalance: () => void;
  onDisconnectClick: () => void;
  onCopyAddress: () => void;
}

const WalletSummaryCard: React.FC<Props> = ({
  isWalletConnected,
  walletAddress,
  ethBalance,
  isFetchingBalance,
  fetchBalanceError,
  conversionCurrency,
  convertedBalance,
  isAutoConverting,
  isConnecting,
  onToggleCurrency,
  onOpenWalletModal,
  onFetchBalance,
  onDisconnectClick,
  onCopyAddress,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="rounded-3xl p-6 text-white shadow-xl mb-6 relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundColor: '#8b5cf6',
        backgroundImage: `linear-gradient(135deg, rgba(168,85,247,0.92), rgba(91,33,182,0.88)), url(${WalletCardBg})`,
        backgroundBlendMode: 'overlay, normal',
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <span className="text-sm font-medium text-purple-100">Current Balance</span>
        <div className="relative">
          <button onClick={() => setIsMenuOpen((p) => !p)} className="p-1 hover:bg-white/20 rounded-full transition-all">
            <span className="sr-only">Toggle menu</span>
            •••
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
                {!isWalletConnected ? (
                  <button
                    onClick={() => {
                      onOpenWalletModal('connect');
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
                        onFetchBalance();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-sm font-medium">Refresh Balance</span>
                    </button>
                    <button
                      onClick={() => {
                        onDisconnectClick();
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
            <p className="text-sm text-purple-100/80">Connect a wallet to see live balances and manage transactions.</p>
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
              <p className="text-xl font-semibold">{conversionCurrency === 'PHP' ? '₱' : '$'}0.00</p>
            </div>
            <button onClick={onToggleCurrency} className="flex items-center gap-1 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-opacity-30 transition-all">
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
                <button onClick={onCopyAddress} className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-opacity-30 transition-all">
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
                    {conversionCurrency === 'PHP' ? '₱' : '$'}
                    {convertedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                ) : (
                  <p className="text-lg text-purple-200">Loading...</p>
                )}
              </div>

              {/* Currency Toggle */}
              <button onClick={onToggleCurrency} className="flex items-center gap-1 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-opacity-30 transition-all">
                <span className="text-sm font-medium">{conversionCurrency}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

          {fetchBalanceError && <p className="text-sm text-red-300 mt-2">{fetchBalanceError}</p>}
        </>
      )}
    </div>
  );
};

export default WalletSummaryCard;
