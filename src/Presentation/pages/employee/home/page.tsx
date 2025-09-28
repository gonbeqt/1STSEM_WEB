// src/Presentation/pages/employee/home/page.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Bell, RotateCcw, Loader2, Wifi, Clipboard } from 'lucide-react';
import { useWallet } from '../../../hooks/useWallet';
import WalletModal from '../../../components/WalletModal';
import EthereumIcon from '../../../components/icons/EthereumIcon';

type WalletModalInitialView = 'connect' | 'send';

const EmployeeHome = observer(() => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalInitialView, setWalletModalInitialView] = useState<WalletModalInitialView>('connect');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  
  const { isWalletConnected, walletAddress, ethBalance, isFetchingBalance, fetchBalanceError, successMessage, clearSuccessMessage, isReconnecting, fetchWalletBalance, rates, fiatCurrency } = useWallet();
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
      <div className="bg-gradient-to-b from-purple-700/70 to-purple-800/70 rounded-2xl border border-gray-300/20 p-3 px-8 flex justify-between items-center text-gray-800 shadow-lg backdrop-blur-sm mb-6">
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-white/90">Current Wallet</span>
            {isWalletConnected && (
              <div className="flex items-center gap-1 text-green-400">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium">Connected</span>
              </div>
            )}
            {isReconnecting && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium">Connecting...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <EthereumIcon className="w-6 h-6 text-white" />
              <span className="text-3xl font-bold text-white">
                {isFetchingBalance ? (
                  <Loader2 className="w-6 h-6 animate-spin inline" />
                ) : ethBalance !== null ? (
                  `${ethBalance.toFixed(4)} ETH`
                ) : (
                  <span className="text-gray-400">0 ETH</span>
                )}
              </span>
            </div>
            
            {walletAddress && (
              <div className="flex items-center gap-2 text-sm text-white/80 mb-1">
                <span>Wallet: {walletAddress}</span>
                <button onClick={handleCopyAddress} className="bg-transparent border-none text-white hover:text-purple-300 transition-colors">
                  <Clipboard size={16} />
                </button>
                {copiedMessage && <span className="text-xs text-green-300">{copiedMessage}</span>}
              </div>
            )}
            
            <div className="text-lg text-white/70 font-medium">
              {isFetchingBalance ? (
                <span>Fetching...</span>
              ) : fetchBalanceError ? (
                <span className="text-red-300">Error fetching balance</span>
              ) : ethBalance !== null ? (
                `${(ethBalance * usd).toFixed(2)} USD`
              ) : walletAddress ? (
                <span className="font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              ) : (
                <span className="text-gray-400">Wallet Not Connected</span>
              )}
            </div>
          </div>

          {!isWalletConnected && !isReconnecting && (
            <button
              className="bg-purple-600 text-white border-none rounded-lg px-6 py-2.5 text-sm font-semibold ml-2 shadow-lg shadow-purple-600/30 cursor-pointer mt-4 self-start hover:bg-purple-700 transition-colors"
              onClick={() => handleOpenWalletModal('connect')}
            >
              Connect Wallet
            </button>
          )}
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