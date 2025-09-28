// src/Presentation/pages/employee/home/page.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Bell, RotateCcw, Loader2, Wifi, Clipboard, WifiOff } from 'lucide-react';
import { useWallet } from '../../../hooks/useWallet';
import WalletModal from '../../../components/WalletModal';
import EthereumIcon from '../../../components/icons/EthereumIcon';

type WalletModalInitialView = 'connect' | 'send';

const EmployeeHome = observer(() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  
  const { isWalletConnected,
    walletAddress,
    ethBalance,
    isFetchingBalance,
    fetchBalanceError,
    successMessage,
    clearSuccessMessage,
    isReconnecting,
    reconnectError,
    fetchWalletBalance
  } = useWallet();;
  const usd = 4469.44;
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
  
 
  const getNextMonthFirstDay = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopiedMessage('Copied!');
        setTimeout(() => setCopiedMessage(null), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        setCopiedMessage('Failed to copy');
        setTimeout(() => setCopiedMessage(null), 2000);
      }
    }
  };

 const handleOpenWalletModal = (view: WalletModalInitialView) => {
    setWalletModalInitialView(view);
    setIsWalletModalOpen(true);
  };

 return (
    <div className="w-full h-screen max-w-full mx-auto text-gray-800 font-sans p-4 box-border bg-gray-50 animate-[slideIn_0.3s_ease-out]">
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

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        initialView={walletModalInitialView}
      />
    </div>
  );
});

export default EmployeeHome;