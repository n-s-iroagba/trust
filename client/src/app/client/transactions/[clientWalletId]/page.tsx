'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { useCoins } from '@/hooks/useCoins';
import { ClientWalletWithAssociations, Transaction, TransactionStatus, TransactionType } from '@/types';
import { useClientWallets } from '@/hooks/useClientWallets';
import Image from 'next/image';

// Reusable exchange rate hook
const useExchangeRates = () => {
  const { data: coins, loading: coinsLoading } = useCoins();

  const getExchangeRate = (currencyName: string): number => {
    if (!coins) return 1;
    
    const coin = coins.find(c => 
      c.name.toLowerCase() === currencyName.toLowerCase() ||
      c.symbol.toLowerCase() === currencyName.toLowerCase()
    );
    
    return coin?.current_price || 1;
  };

  const convertToUSD = (amount: number, currencyName: string): number => {
    const rate = getExchangeRate(currencyName);
    return amount * rate;
  };

  const getCoinData = (currencyName: string) => {
    if (!coins) return null;
    
    return coins.find(c => 
      c.name.toLowerCase() === currencyName.toLowerCase() ||
      c.symbol.toLowerCase() === currencyName.toLowerCase()
    );
  };

  return {
    getExchangeRate,
    convertToUSD,
    getCoinData,
    coinsLoading,
    coins
  };
};

export default function TransactionsPage() {
  const { clientWalletId } = useParams<{ clientWalletId: string }>();
  const {
    getTransactionsByClientWalletId,
    loading: transactionsLoading,
  } = useTransactions();

  const { getClientWalletById, loading: clientWalletLoading } = useClientWallets();
  const { convertToUSD, getCoinData, coinsLoading } = useExchangeRates();

  const [clientWallet, setClientWallet] = useState<ClientWalletWithAssociations | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [error, setError] = useState<string | null>(null);


  // ✅ Load client wallet data
  const loadClientWallet = async () => {
    try {
      setError(null);
      const response = await getClientWalletById(Number(clientWalletId));
      if (response.success && response.data) {
        setClientWallet(response.data);
      } else {
        setError(response.message || 'Failed to load wallet data');
      }
    } catch (err) {
      console.error('Failed to load client wallet:', err);
      setError('An unexpected error occurred while loading wallet data.');
    }
  };

  // ✅ Load transactions
  const loadTransactions = async () => {
    try {
      setError(null);
      const response = await getTransactionsByClientWalletId(Number(clientWalletId));
      if (response.success && response.data) {
        setTransactions(response.data as Transaction[]);
      } else {
        setError(response.message || 'Failed to load transactions');
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('An unexpected error occurred while loading transactions.');
    }
  };

  // Load both client wallet and transactions
  useEffect(() => {
    if (clientWalletId) {
      loadClientWallet();
      loadTransactions();
    }
  }, [clientWalletId]);

  // Filter and enhance transactions with real-time prices
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    if (!clientWallet?.adminWallet?.currency) return transactions;

    let filtered = transactions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Enhance transactions with real-time USD values
    return filtered.map(transaction => ({
      ...transaction,
      amountInUSD: convertToUSD(parseFloat(transaction.amount), clientWallet.adminWallet.currency),
      currentPrice: getCoinData(clientWallet.adminWallet.currency)?.current_price || 0
    }));
  }, [transactions, clientWallet, statusFilter, typeFilter, convertToUSD, getCoinData]);

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

  const loading = clientWalletLoading || transactionsLoading;

  if ((loading || coinsLoading) && !clientWallet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading transactions and market data...</p>
        </div>
      </div>
    );
  }

  if (error && !clientWallet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
            <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                loadClientWallet();
                loadTransactions();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  console.log('client wallet',clientWallet)

  const coinData = clientWallet ? getCoinData(clientWallet.adminWallet.currency) : null;
  const currentPrice = coinData?.current_price || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Transactions</h1>
              <p className="text-gray-600 mt-1">
                Viewing all transactions for your <strong>{clientWallet?.adminWallet.currency} Wallet</strong>
              </p>
              <p className="text-gray-600 mt-1">
                Total Balance: <strong>${clientWallet?.amountInUSD}</strong>
              </p>
            </div>
            
            {/* Current Price Display */}
            {coinData && (
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {coinData.image && (
                    <Image fill  src={coinData.image} alt='Crypto logo' className="w-8 h-8 rounded-full" />
                  )}
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Current {clientWallet?.adminWallet.currency} Price
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', TransactionStatus.PENDING, TransactionStatus.SUCCESSFUL, TransactionStatus.FAILED].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as TransactionStatus | 'all')}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
          {['all', TransactionType.CREDIT, TransactionType.DEBIT].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as TransactionType | 'all')}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                typeFilter === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === TransactionType.CREDIT ? 'Deposit' : type === TransactionType.DEBIT ? 'Withdrawal' : 'All Types'}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">
                {statusFilter === 'all' && typeFilter === 'all' 
                  ? 'There are no transactions for this wallet.' 
                  : `No transactions match your current filters.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const valueDifference = transaction.amountInUSD - transaction.amountInUSD;
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
                              {transaction.type === TransactionType.CREDIT ? 'Deposit' : 'Withdrawal'}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-600">
                              {formatDate(transaction.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {transaction.type === TransactionType.DEBIT ? 'To: ' : 'From: '}
                            <span className="font-mono text-xs">{transaction.recipientAddress}</span>
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
                          <div className="text-right">
                            {/* Crypto Amount */}
                            <p className="text-lg font-bold text-gray-900">
                              {transaction.amount} {clientWallet?.adminWallet.currencyAbbreviation}
                            </p>
                            
                            {/* Original USD Value */}
                            <p className="text-sm text-gray-500 line-through">
                              ${transaction.amountInUSD}
                            </p>
                            
                            {/* Real-time USD Value */}
                            <p className="text-sm font-semibold text-green-600">
                              ${transaction.amountInUSD}
                            </p>
                            
                            {/* Value Change */}
                            {hasValueChange && (
                              <p className={`text-xs ${valueDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {valueDifference > 0 ? '+' : ''}{valueDifference} USD
                              </p>
                            )}
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                        
                        {/* Fee */}
                        {transaction.fee && (
                          <p className="text-xs text-gray-500 mt-1">
                            Fee: {transaction.fee} {clientWallet?.adminWallet.currencyAbbreviation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        {filteredTransactions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
              <p className="text-2xl font-bold text-primary">{filteredTransactions.length}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
              <p className="text-2xl font-bold text-green-600">
                ${filteredTransactions.reduce((sum, t) => sum + t.amountInUSD, 0)}
              </p>
              <p className="text-xs text-gray-500">Real-time value</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Deposits</h3>
              <p className="text-2xl font-bold text-green-600">
                {filteredTransactions.filter(t => t.type === TransactionType.CREDIT).length}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Withdrawals</h3>
              <p className="text-2xl font-bold text-red-600">
                {filteredTransactions.filter(t => t.type === TransactionType.DEBIT).length}
              </p>
            </div>
          </div>
        )}

        {/* Loading overlay for updates */}
        {(loading || coinsLoading) && clientWallet && (
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