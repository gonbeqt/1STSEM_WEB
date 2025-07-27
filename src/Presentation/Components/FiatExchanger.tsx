import React, { useState, useEffect } from 'react';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const FiatExchanger: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.result === 'success') {
          setExchangeRates(data.conversion_rates);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (exchangeRates) {
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      setConvertedAmount(amount * rate);
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-center">Fiat Exchanger</h2>
      <div className="form-group">
        <label className="form-label">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">From</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange} className="form-input">
          {exchangeRates && Object.keys(exchangeRates).map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">To</label>
        <select value={toCurrency} onChange={handleToCurrencyChange} className="form-input">
          {exchangeRates && Object.keys(exchangeRates).map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      {convertedAmount !== null && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Converted Amount</h3>
          <p>{convertedAmount.toFixed(2)} {toCurrency}</p>
        </div>
      )}
    </div>
  );
};

export default FiatExchanger;
