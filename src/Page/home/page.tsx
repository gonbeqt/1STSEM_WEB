import React, { useState, useEffect } from 'react';
import TransactionHistory from '../../Components/TransactionHistory';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Home: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) setWalletAddress(accounts[0]);
        } catch (err) {
          setError('Failed to check wallet connection');
        }
      }
    }
    checkConnection();
  }, []);

  const connectWallet = async () => {
    setError(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err: any) {
        setError(err.message || 'Connection failed');
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  useEffect(() => {
    async function fetchBalance() {
      if (walletAddress && window.ethereum) {
        try {
          const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [walletAddress, 'latest'],
          });
          const balanceEth = parseInt(balanceHex, 16) / 1e18;
          setBalance(balanceEth.toFixed(4));
        } catch {
          setBalance(null);
        }
      }
    }
    fetchBalance();
  }, [walletAddress]);

  return (
    <>
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">Wallet Information</h2>
        {!walletAddress ? (
          <>
            <button onClick={connectWallet} className="btn btn-primary">
              Connect MetaMask Wallet
            </button>
            {error && <div className="mt-4 text-red-500">{error}</div>}
          </>
        ) : (
          <div className="wallet-info">
            <div className="form-group">
              <label className="form-label">Wallet Address</label>
              <p className="wallet-address">{walletAddress}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Balance</label>
              <p>{balance !== null ? `${balance} ETH` : 'Loading...'}</p>
            </div>
          </div>
        )}
      </div>
      <TransactionHistory />
    </>
  );
};

export default Home;




