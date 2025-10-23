'use client';
import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCoins, useExchangeRates } from '@/hooks/useCoins';
import { Transaction, TransactionStatus, TransactionType } from '@/types/transaction';

interface GroupedTransactions {
  [currency: string]: Transaction[];
}

// Reusable exchange rate hook


export default function TransactionsPage() {
  const clientId = '1'
  const { getTransactionsByClientId, loading, error } = useTransactions();
  const { getCoinData, coinsLoading } = useExchangeRates();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'ALL'>('ALL');
  const [groupedTransactions, setGroupedTransactions] = useState<GroupedTransactions>({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterAndGroupTransactions();
  }, [transactions, selectedStatus]);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactionsByClientId(Number(clientId));
      if (response.success && response.data) {
        const transactionsData = Array.isArray(response.data) ? response.data : [response.data];
        setTransactions(transactionsData);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const filterAndGroupTransactions = () => {
    let filtered = transactions;

    // Filter by status
    if (selectedStatus !== 'ALL') {
      filtered = transactions.filter(transaction => transaction.status === selectedStatus);
    }

    setFilteredTransactions(filtered);

    // Group by currency
    const grouped: GroupedTransactions = {};
    
    filtered.forEach(transaction => {
      const currency = transaction.clientWallet?.adminWallet?.currencyAbbreviation || 'Unknown';
      
      if (!grouped[currency]) {
        grouped[currency] = [];
      }
      
      grouped[currency].push(transaction);
    });

    setGroupedTransactions(grouped);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESSFUL:
        return 'bg-green-100 text-green-800';
      case TransactionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TransactionStatus.FAILED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.CREDIT:
        return 'text-green-600';
      case TransactionType.DEBIT:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.CREDIT:
        return '⬇️';
      case TransactionType.DEBIT:
        return '⬆️';
      default:
        return '⚡';
    }
  };

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.CREDIT:
        return 'Deposit';
      case TransactionType.DEBIT:
        return 'Withdrawal';
      default:
        return 'Transaction';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Calculate real-time USD value for transactions
  const calculateRealTimeUsdValue = (transaction: Transaction): number => {
    if (!transaction.clientWallet?.adminWallet) return transaction.amountInUSD;
    
    const coinData = getCoinData(transaction.clientWallet.adminWallet.currency);
    if (coinData && transaction.amount) {
      const cryptoAmount = parseFloat(transaction.amount);
      return cryptoAmount * coinData.current_price;
    }
    
    return transaction.amountInUSD;
  };

  // Get current price for a currency
  const getCurrentPrice = (currency: string): number => {
    const coinData = getCoinData(currency);
    return coinData?.current_price || 0;
  };

  // Get 24h price change for a currency
  const getPriceChange = (currency: string): number => {
    const coinData = getCoinData(currency);
    // For demonstration - in real implementation, you'd calculate the actual change
    return coinData ? (coinData.current_price * 0.02) : 0; // 2% change for demo
  };

  if ((loading || coinsLoading) && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading transactions and market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
              <p className="text-gray-600 mt-2">View and manage all transactions with real-time market data</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredTransactions.length} transactions
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchTransactions}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === 'ALL'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Transactions
            </button>
            {Object.values(TransactionStatus).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions by Currency */}
        <div className="space-y-6">
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">
                {selectedStatus === 'ALL' 
                  ? 'There are no transactions to display.' 
                  : `No ${selectedStatus.toLowerCase()} transactions found.`}
              </p>
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([currency, currencyTransactions]) => {
              const coinData = getCoinData(currency);
              const currentPrice = getCurrentPrice(currency);
              const priceChange = getPriceChange(currency);
              const isPositiveChange = priceChange >= 0;

              return (
                <div key={currency} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Currency Header with Market Data */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {coinData?.image ? (
                          <img 
                            src={coinData.image} 
                            alt={currency}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className={`w-10 h-10 ${getCryptoColor(currency)} rounded-full flex items-center justify-center text-white`}>
                            <span className="text-lg font-semibold">
                              {getCryptoIcon(currency)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{currency}</h3>
                          <p className="text-sm text-gray-500">
                            {coinData?.name || currency} • {currencyTransactions.length} transactions
                          </p>
                        </div>
                      </div>
                      
                      {/* Market Data */}
                      <div className="text-right space-y-1">
                        {coinData && (
                          <>
                            <p className="text-sm font-semibold text-gray-900">
                              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </p>
                            <p className={`text-xs ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositiveChange ? '↗' : '↘'} {Math.abs(priceChange).toFixed(2)}%
                            </p>
                          </>
                        )}
                        <p className="text-sm text-gray-500">Total Volume</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${currencyTransactions.reduce((sum, t) => sum + calculateRealTimeUsdValue(t), 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transactions List */}
                  <div className="divide-y divide-gray-200">
                    {currencyTransactions.map((transaction) => {
                      const realTimeUsdValue = calculateRealTimeUsdValue(transaction);
                      const originalUsdValue = transaction.amountInUSD;
                      const valueDifference = realTimeUsdValue - originalUsdValue;
                      const hasValueChange = Math.abs(valueDifference) > 0.01;

                      return (
                        <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {/* Type Icon */}
                              <div className={`w-12 h-12 ${
                                transaction.type === TransactionType.CREDIT ? 'bg-green-100' : 'bg-red-100'
                              } rounded-full flex items-center justify-center`}>
                                <span className="text-xl">
                                  {getTypeIcon(transaction.type)}
                                </span>
                              </div>

                              {/* Transaction Details */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
                                    {getTypeLabel(transaction.type)}
                                  </span>
                                  <span className="text-sm text-gray-500">•</span>
                                  <span className="text-sm text-gray-600">
                                    {formatDate(transaction.date)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {transaction.type === TransactionType.DEBIT ? 'To: ' : 'From: '}
                                  <span className="font-mono text-xs">{transaction.reciepientAddress}</span>
                                </p>
                                {transaction.clientWallet?.client && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Client: {transaction.clientWallet.client.firstName} {transaction.clientWallet.client.lastName}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Amount and Status */}
                            <div className="text-right">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="text-lg font-bold text-gray-900">
                                    {transaction.amount} {currency}
                                  </p>
                                  <div className="text-sm space-y-1">
                                    <p className="text-gray-900 font-semibold">
                                      ${realTimeUsdValue.toFixed(2)}
                                    </p>
                                    {hasValueChange && (
                                      <p className={`text-xs ${valueDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {valueDifference > 0 ? '+' : ''}{valueDifference.toFixed(2)} USD
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                  {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                                </span>
                              </div>
                              {transaction.fee && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Fee: {transaction.fee} {currency}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Volume</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${filteredTransactions.reduce((sum, t) => sum + calculateRealTimeUsdValue(t), 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Real-time value</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Currencies</h3>
              <p className="text-2xl font-bold text-green-600">
                {Object.keys(groupedTransactions).length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Active currencies</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
              <p className="text-2xl font-bold text-purple-600">
                {((filteredTransactions.filter(t => t.status === TransactionStatus.SUCCESSFUL).length / filteredTransactions.length) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Successful transactions</p>
            </div>
          </div>
        )}

        {/* Loading overlay for updates */}
        {(loading || coinsLoading) && transactions.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm">Updating market data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}