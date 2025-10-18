'use client'
import { useState } from 'react';
import { ChevronLeft, Zap, QrCode } from 'lucide-react';

export default function SendForm() {
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const cryptos = [
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      bgColor: 'bg-orange-500',
      network: 'Bitcoin',
      maxBalance: 0.5,
      decimals: 8
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '◆',
      bgColor: 'bg-gray-700',
      network: 'Ethereum',
      maxBalance: 5.2,
      decimals: 18
    },
    {
      id: 'sol',
      symbol: 'SOL',
      name: 'Solana',
      icon: '◈',
      bgColor: 'bg-black',
      network: 'Solana',
      maxBalance: 50,
      decimals: 9
    },
    {
      id: 'bnb',
      symbol: 'BNB',
      name: 'BNB Smart Chain',
      icon: '◉',
      bgColor: 'bg-yellow-500',
      network: 'BNB Smart Chain',
      maxBalance: 2.5,
      decimals: 18
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      name: 'Tether',
      icon: '⊕',
      bgColor: 'bg-teal-600',
      network: 'Ethereum',
      maxBalance: 1000,
      decimals: 6
    },
    {
      id: 'usdc',
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '$',
      bgColor: 'bg-blue-500',
      network: 'Ethereum',
      maxBalance: 500,
      decimals: 6
    }
  ];

  const currentCrypto = cryptos.find(c => c.id === selectedCrypto);
 
  const usdValue = 0
  const handleMax = () => {
    setAmount(currentCrypto?.maxBalance.toString()||'0');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleScan = () => {
    alert('QR Scanner would open here');
  };

  const handleNext = () => {
    if (!address.trim() || !amount) {
      alert('Please enter both address and amount');
      return;
    }
    alert(`Sending ${amount} ${currentCrypto?.symbol} to ${address}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <ChevronLeft size={24} className="text-gray-700" />
        <h1 className="text-xl font-bold text-gray-900">
          Send {currentCrypto?.symbol}
        </h1>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 space-y-6">
        
        {/* Address Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            Address or Domain Name
          </label>
          <div className="flex items-center gap-2 border-2 border-blue-500 rounded-2xl px-4 py-3 bg-white focus-within:shadow-lg transition">
            <input
              type="text"
              placeholder="Search or Enter"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={handlePaste}
              className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition"
            >
              Paste
            </button>
            <button
              onClick={handleScan}
              className="p-1.5 hover:bg-blue-50 rounded-lg transition"
              title="Scan QR"
            >
              <QrCode size={20} className="text-blue-500" />
            </button>
            <button
              onClick={handleScan}
              className="p-1.5 hover:bg-blue-50 rounded-lg transition"
              title="Scanner"
            >
              <Zap size={20} className="text-blue-500" />
            </button>
          </div>
        </div>

        {/* Amount Section */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            Amount
          </label>
          
          {/* Crypto Selector and Amount Input */}
          <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3 bg-white hover:border-gray-400 transition">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-lg"
              step="any"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition font-semibold"
              >
                <div className={`w-6 h-6 ${currentCrypto?.bgColor} rounded-full flex items-center justify-center text-white text-sm`}>
                  {currentCrypto?.icon}
                </div>
                {currentCrypto?.symbol}
              </button>
              <button
                onClick={handleMax}
                className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition"
              >
                Max
              </button>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 w-64 max-h-64 overflow-y-auto">
              {cryptos.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => {
                    setSelectedCrypto(crypto.id);
                    setShowDropdown(false);
                    setAmount('');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition border-b border-gray-100 last:border-b-0"
                >
                  <div className={`w-8 h-8 ${crypto.bgColor} rounded-full flex items-center justify-center text-white text-sm`}>
                    {crypto.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{crypto.symbol}</div>
                    <div className="text-xs text-gray-500">{crypto.name}</div>
                  </div>
                  {selectedCrypto === crypto.id && (
                    <div className="ml-auto text-blue-500">✓</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* USD Value */}
          <div className="mt-2 text-sm text-gray-500">
            ≈ ${usdValue.toFixed(2)}
          </div>

          {/* Max Balance */}
          <div className="mt-3 text-xs text-gray-400">
            Max available: {currentCrypto?.maxBalance} {currentCrypto?.symbol}
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="px-4 py-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-full transition shadow-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}