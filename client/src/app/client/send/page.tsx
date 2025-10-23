'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { useClientWallets } from '@/hooks/useClientWallets';
import { ClientWallet } from '@/types';
import { useCoins } from '@/hooks/useCoins';

// Reusable exchange rate hook
const useExchangeRates = () => {
  const { data: coins, loading: coinsLoading } = useCoins();

  const getExchangeRate = useCallback((currencyName: string): number => {
    if (!coins) return 1;
    
    const coin = coins.find(c => 
      c.name.toLowerCase() === currencyName.toLowerCase() ||
      c.symbol.toLowerCase() === currencyName.toLowerCase()
    );
    
    return coin?.current_price || 1;
  }, [coins]);

  const convertToUSD = useCallback((amount: number, currencyName: string): number => {
    const rate = getExchangeRate(currencyName);
    return amount * rate;
  }, [getExchangeRate]);

  const convertFromUSD = useCallback((usdAmount: number, currencyName: string): number => {
    const rate = getExchangeRate(currencyName);
    return rate > 0 ? usdAmount / rate : 0;
  }, [getExchangeRate]);

  return {
    getExchangeRate,
    convertToUSD,
    convertFromUSD,
    coinsLoading,
    coins
  };
};

export default function SendForm() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientWallets, setClientWallets] = useState<ClientWallet[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<{
    amount: string;
    currency: string;
    address: string;
    usdValue: number;
  } | null>(null);
  
  const { getClientWalletsByClientId, loading, error } = useClientWallets();
  const { convertToUSD, convertFromUSD, coinsLoading } = useExchangeRates();
  const router = useRouter();

  // Fetch client wallets on component mount
  useEffect(() => {
    const fetchClientWallets = async () => {
      try {
        // You'll need to get the clientId from your auth context or props
        const clientId = '1'; // Replace with actual client ID
        const response = await getClientWalletsByClientId(clientId);
        
        if (response.success && response.data) {
          const wallets = Array.isArray(response.data) ? response.data : [response.data];
          setClientWallets(wallets);
          
          // Set default selected crypto to first wallet
          if (wallets.length > 0) {
            setSelectedCrypto(wallets[0].adminWallet.currencyAbbreviation.toLowerCase());
          }
        }
      } catch (err) {
        console.error('Failed to fetch client wallets:', err);
      }
    };

    fetchClientWallets();
  }, []);

  const currentWallet = clientWallets.find(
    wallet => wallet.adminWallet.currencyAbbreviation.toLowerCase() === selectedCrypto
  );

  const currentAdminWallet = currentWallet?.adminWallet;

  // Calculate USD value based on crypto amount using real exchange rates
  const calculateUsdValue = useCallback((cryptoAmount: string): number => {
    if (!cryptoAmount || !currentAdminWallet) return 0;
    const amountNum = parseFloat(cryptoAmount);
    return convertToUSD(amountNum, currentAdminWallet.currency);
  }, [currentAdminWallet, convertToUSD]);

  // Update USD value when crypto amount changes
  useEffect(() => {
    if (cryptoAmount && currentAdminWallet) {
      const usdValue = calculateUsdValue(cryptoAmount);
      setAmount(usdValue.toFixed(2));
    } else {
      setAmount('');
    }
  }, [cryptoAmount, currentAdminWallet, calculateUsdValue]);

  // Update crypto amount when USD amount changes
  useEffect(() => {
    if (amount && currentAdminWallet) {
      const usdAmount = parseFloat(amount);
      const cryptoValue = convertFromUSD(usdAmount, currentAdminWallet.currency);
      setCryptoAmount(cryptoValue.toFixed(8));
    } else {
      setCryptoAmount('');
    }
  }, [amount, currentAdminWallet, convertFromUSD]);

  const usdValue = calculateUsdValue(cryptoAmount);

  const handleMax = () => {
    if (currentWallet) {
      // Set maximum amount in USD
      setAmount(currentWallet.amountInUSD.toString());
      // Crypto amount will be automatically calculated via useEffect
    }
  };

  const handleCryptoAmountChange = (value: string) => {
    setCryptoAmount(value);
    // USD amount will be automatically calculated via useEffect
  };

  const handleUsdAmountChange = (value: string) => {
    setAmount(value);
    // Crypto amount will be automatically calculated via useEffect
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleNext = async () => {
    if (!address.trim() || !cryptoAmount) {
      alert('Please enter both address and amount');
      return;
    }

    if (!currentWallet) {
      alert('Please select a valid cryptocurrency');
      return;
    }

    // Validate amount doesn't exceed balance
    const usdAmountNum = parseFloat(amount);
    if (usdAmountNum > currentWallet.amountInUSD) {
      alert(`Amount exceeds available balance of $${currentWallet.amountInUSD} USD`);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call to send transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically call your actual send transaction API
      console.log('Sending transaction:', {
        walletId: currentWallet.id,
        toAddress: address,
        cryptoAmount: parseFloat(cryptoAmount),
        usdAmount: usdAmountNum,
        currency: currentAdminWallet?.currencyAbbreviation,
        amountInUSD: usdValue
      });

      // Store transaction details for success modal
      setTransactionDetails({
        amount: cryptoAmount,
        currency: currentAdminWallet?.currencyAbbreviation || '',
        address: address,
        usdValue: usdValue
      });

      // Show success modal
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Failed to send transaction:', err);
      alert('Failed to send transaction. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate to /client after a brief delay to show the success message
    setTimeout(() => {
      router.push('/client');
    }, 500);
  };

  const handleBack = () => {
    router.back();
  };

  const getCryptoIcon = (symbol: string): string => {
    const iconMap: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': '◆',
      'SOL': '◈',
      'BNB': '◉',
      'USDT': '⊕',
      'USDC': '$',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return iconMap[symbol] || '◊';
  };

  const getCryptoColor = (symbol: string): string => {
    const colorMap: { [key: string]: string } = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-gray-700',
      'SOL': 'bg-purple-600',
      'BNB': 'bg-yellow-500',
      'USDT': 'bg-teal-600',
      'USDC': 'bg-blue-500',
      'USD': 'bg-green-500',
      'EUR': 'bg-blue-400',
      'GBP': 'bg-red-500'
    };
    return colorMap[symbol] || 'bg-gray-500';
  };

  const getMaxCryptoAmount = (): string => {
    if (!currentWallet || !currentAdminWallet) return '0';
    const maxCrypto = convertFromUSD(currentWallet.amountInUSD, currentAdminWallet.currency);
    return maxCrypto.toFixed(8);
  };

  if ((loading || coinsLoading) && clientWallets.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-4">Loading wallets and exchange rates...</p>
      </div>
    );
  }

  if (error && clientWallets.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-center">
          <h2 className="text-lg font-bold mb-2">Error Loading Wallets</h2>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={handleBack}>
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          Send {currentAdminWallet?.currencyAbbreviation || 'Crypto'}
        </h1>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 space-y-6">
        
        {/* Address Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            Address 
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
          </div>
        </div>

        {/* Amount Section */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            Amount
          </label>
          
          {/* Crypto Amount Input */}
          <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3 bg-white hover:border-gray-400 transition mb-3">
            <input
              type="number"
              placeholder="0.00000000"
              value={cryptoAmount}
              onChange={(e) => handleCryptoAmountChange(e.target.value)}
              className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-lg"
              step="any"
              min="0"
            />
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition font-semibold"
              >
                {currentAdminWallet && (
                  <>
                    <div 
                      className={`w-6 h-6 ${getCryptoColor(currentAdminWallet.currencyAbbreviation)} rounded-full flex items-center justify-center text-white text-sm`}
                    >
                      {getCryptoIcon(currentAdminWallet.currencyAbbreviation)}
                    </div>
                    {currentAdminWallet.currencyAbbreviation}
                  </>
                )}
              </button>
              <button
                onClick={handleMax}
                className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition"
              >
                Max
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 w-64 max-h-64 overflow-y-auto">
                  {clientWallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => {
                        setSelectedCrypto(wallet.adminWallet.currencyAbbreviation.toLowerCase());
                        setShowDropdown(false);
                        setCryptoAmount('');
                        setAmount('');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition border-b border-gray-100 last:border-b-0"
                    >
                      <div 
                        className={`w-8 h-8 ${getCryptoColor(wallet.adminWallet.currencyAbbreviation)} rounded-full flex items-center justify-center text-white text-sm`}
                      >
                        {getCryptoIcon(wallet.adminWallet.currencyAbbreviation)}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-gray-900">
                          {wallet.adminWallet.currencyAbbreviation}
                        </div>
                        <div className="text-xs text-gray-500">
                          {wallet.adminWallet.currency}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {wallet.amountInUSD.toFixed(2)} USD
                        </div>
                        <div className="text-xs text-gray-500">
                          Balance
                        </div>
                      </div>
                      {selectedCrypto === wallet.adminWallet.currencyAbbreviation.toLowerCase() && (
                        <div className="ml-2 text-blue-500">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* USD Amount Input */}
          <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3 bg-white hover:border-gray-400 transition">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleUsdAmountChange(e.target.value)}
              className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-lg"
              step="0.01"
              min="0"
            />
            <div className="text-gray-500 font-semibold">
              USD
            </div>
          </div>

          {/* Exchange Rate Info */}
          {currentAdminWallet && cryptoAmount && (
            <div className="mt-2 text-sm text-gray-500">
              ≈ {cryptoAmount} {currentAdminWallet.currencyAbbreviation} = ${usdValue.toFixed(2)} USD
            </div>
          )}

          {/* Max Balance */}
          {currentWallet && currentAdminWallet && (
            <div className="mt-3 text-xs text-gray-400">
              Max available: {getMaxCryptoAmount()} {currentAdminWallet.currencyAbbreviation} (${currentWallet.amountInUSD.toFixed(2)} USD)
            </div>
          )}
        </div>

        {/* Wallet Details */}
        {currentWallet && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-900">Wallet Details</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Your Address:</span>
              <span className="text-gray-900 font-mono text-xs">
                {currentWallet.address}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Network:</span>
              <span className="text-gray-900">
                {currentAdminWallet?.currency} Network
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Balance:</span>
              <span className="text-gray-900 font-semibold">
                {currentWallet.amountInUSD.toFixed(2)} USD
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="px-4 py-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          disabled={!address.trim() || !cryptoAmount || isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 rounded-full transition shadow-lg disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Next'
          )}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && transactionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600 mb-6">
              Your transaction is been processed.
            </p>
            
            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Sent:</span>
                  <span className="font-semibold">
                    {transactionDetails.amount} {transactionDetails.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">USD Value:</span>
                  <span className="font-semibold">
                    ${transactionDetails.usdValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To Address:</span>
                  <span className="font-mono text-xs text-gray-900 truncate ml-2 max-w-[120px]">
                    {transactionDetails.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-semibold">Processing</span>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={handleSuccessModalClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-full transition shadow-lg hover:from-blue-600 hover:to-purple-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}