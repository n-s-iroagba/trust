'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Search, ChevronRight,ArrowUp, ArrowDownUp, TrendingUp, Settings, Copy, QrCode, ArrowRight, Clock, ArrowDown } from 'lucide-react';
import { useClientWallets } from '@/hooks/useClientWallets';
import { ClientWallet } from '@/types/clientWallet';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { useExchangeRates } from '@/hooks/useCoins';

export default function TrustWalletDashboard() {
  const clientId = "1";
  const [selectedTab, setSelectedTab] = useState<'crypto' | 'watchlist' | 'nft'>('crypto');
  const router = useRouter();
  const [topMoversTab, setTopMoversTab] = useState('rwa');
  
  // State for selected wallet
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<ClientWallet | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  
  // State for limiting displayed transactions
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
 
  const { getTransactionsByClientWalletId } = useTransactions();
  const { convertFromUSD} = useExchangeRates();
  
  // Fetch transactions when selected wallet changes
  useEffect(() => {
    if (selectedWalletId) {
      fetchTransactions(selectedWalletId);
    }
  }, [selectedWalletId]);

  const fetchTransactions = async (walletId: number) => {
    try {
      const response = await getTransactionsByClientWalletId(walletId);
      if (response.success && response.data) {
        setTransactions(response.data.transactions);
        // For demo purposes, let's create some mock pending transactions
        // In real app, you would fetch these separately
        setPendingTransactions(response.data.transactions.slice(0, 3).map(tx => ({
          ...tx,
      
          status: TransactionStatus.PENDING
        })));
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const { getClientWalletsByClientId, loading } = useClientWallets();
  const [wallets, setWallets] = useState<ClientWallet[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getClientWalletsByClientId(clientId);
      if (response.success && response.data) {
        const walletsData = Array.isArray(response.data) ? response.data : [response.data];
        setWallets(walletsData);
        
        // Calculate total balance across all wallets
        const balance = walletsData.reduce((sum, wallet) => sum + wallet.amountInUSD, 0);
        setTotalBalance(balance);
        
        // Set first wallet as default selected
        if (walletsData.length > 0) {
          setSelectedWalletId(walletsData[0].id);
          setSelectedWallet(walletsData[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  // Handle wallet selection
  const handleWalletSelect = (wallet: ClientWallet) => {
    setSelectedWalletId(wallet.id);
    setSelectedWallet(wallet);
    // Reset view all states when switching wallets
    setShowAllTransactions(false);
    setShowAllPending(false);
  };

  // Get selected wallet balance
  const getSelectedWalletBalance = () => {
    return selectedWallet ? selectedWallet.amountInUSD : 0;
  };

  // Get converted balance in cryptocurrency
  const getConvertedBalance = () => {
    if (!selectedWallet || !selectedWallet.adminWallet) return 0;
    
    const currencyName = selectedWallet.adminWallet.currencyAbbreviation;
    return convertFromUSD(selectedWallet.amountInUSD, currencyName);
  };

  // Get transactions for selected wallet (limited to 5 unless showAll is true)
  const getDisplayedTransactions = () => {
    if (!selectedWalletId) return [];
    const walletTransactions = transactions.filter(tx => tx.clientWalletId === selectedWalletId);
    return showAllTransactions ? walletTransactions : walletTransactions.slice(0, 5);
  };

  // Get pending transactions for selected wallet (limited to 5 unless showAll is true)
  const getDisplayedPendingTransactions = () => {
    if (!selectedWalletId) return [];
    const walletPendingTransactions = pendingTransactions.filter(tx => {
      // Assuming pending transactions have a status field or some way to identify them
      return tx.status === 'pending'
    });
    return showAllPending ? walletPendingTransactions : walletPendingTransactions.slice(0, 5);
  };

  // Format cryptocurrency amount
  const formatCryptoAmount = (amount: number, currencyAbbreviation: string) => {
    // Determine decimal places based on currency
    const decimalPlaces = ['BTC', 'ETH'].includes(currencyAbbreviation) ? 6 : 
                          ['USDT', 'USDC'].includes(currencyAbbreviation) ? 2 : 4;
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(amount);
  };

  // Get converted transaction amount
  const getConvertedTransactionAmount = (usdAmount: number) => {
    if (!selectedWallet || !selectedWallet.adminWallet) return 0;
    
    const currencyName = selectedWallet.adminWallet.currencyAbbreviation;
    return convertFromUSD(Math.abs(usdAmount), currencyName);
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyAbbreviation: string) => {
    const symbols: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'USDT': '$',
      'USDC': '$',
      'BNB': 'BNB'
    };
    return symbols[currencyAbbreviation] || currencyAbbreviation;
  };

  // Mock data for the UI components
  const topMovers = [
    { name: 'Clearpool', price: '$0.13', mcap: '$109M', vol: '$3.51M', change: '+6.72%', rank: 1 },
    { name: 'Zebec Network', price: '$0.004', mcap: '$374M', vol: '$14.4M', change: '+5.84%', rank: 2 },
    { name: 'Sky', price: '$0.06', mcap: '$1.58B', vol: '$39.7M', change: '+3.41%', rank: 3 },
    { name: 'MANTRA', price: '$0.16', mcap: '$178M', vol: '$37.6M', change: '+0.99%', rank: 4 },
    { name: 'Synthetix', price: '$1.11', mcap: '$381M', vol: '$117M', change: '+0.54%', rank: 5 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getCurrencyLogo = (currency: string) => {
    const logos: { [key: string]: string } = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-gray-800',
      'USDT': 'bg-green-500',
      'USDC': 'bg-blue-500',
      'BNB': 'bg-yellow-500',
      'default': 'bg-gradient-to-br from-blue-600 to-cyan-400'
    };
    return logos[currency] || logos['default'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            
            {/* Desktop Wallet Selector */}
            <div className="hidden lg:block relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="font-semibold">
                  {selectedWallet 
                    ? `${selectedWallet.adminWallet?.currency} Wallet` 
                    : 'Select Wallet'}
                </span>
                <ChevronRight className="w-4 h-4" />
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </button>
              
              {/* Wallet Dropdown */}
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleWalletSelect(wallet)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                        selectedWalletId === wallet.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCurrencyLogo(wallet.adminWallet?.currencyAbbreviation || 'default')}`}>
                          <span className="text-white text-xs font-bold">
                            {wallet.adminWallet?.currencyAbbreviation?.charAt(0) || 'W'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{wallet.adminWallet?.currency}</div>
                          <div className="text-xs text-gray-500">{formatCurrency(wallet.amountInUSD)}</div>
                        </div>
                      </div>
                      {selectedWalletId === wallet.id && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Wallet Selector */}
          <div className="lg:hidden relative">
            <button className="flex items-center gap-2">
              <span className="font-semibold">
                {selectedWallet 
                  ? `${selectedWallet.adminWallet?.currency}` 
                  : 'Select Wallet'}
              </span>
              <ChevronRight className="w-4 h-4" />
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden lg:block">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden lg:block">
              <QrCode className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Copy className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <QrCode className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Section - Show selected wallet balance */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-5xl lg:text-6xl font-bold mb-2">
                {formatCurrency(getSelectedWalletBalance())}
              </div>
              {selectedWallet && selectedWallet.adminWallet && (
                <div className="text-xl text-gray-600 mb-2">
                  {formatCryptoAmount(getConvertedBalance(), selectedWallet.adminWallet.currencyAbbreviation)} {getCurrencySymbol(selectedWallet.adminWallet.currencyAbbreviation)}
                </div>
              )}
              <div className="text-gray-500 mb-2">
                {selectedWallet ? `${selectedWallet.adminWallet?.currency} Balance` : 'Select a Wallet'}
              </div>
              {selectedWallet && (
                <div className="text-sm text-gray-400 mb-6">
                  {selectedWallet.adminWallet?.currencyAbbreviation}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => router.push('/client/send')}
                    className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 mb-2"
                  >
                    <ArrowUp className="w-6 h-6 text-gray-700" />
                  </button>
                  <span className="text-sm font-medium">Send</span>
                </div>
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => router.push('/client/transactions')}
                    className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 mb-2"
                  >
                    <ArrowDownUp className="w-6 h-6 text-gray-700" />
                  </button>
                  <span className="text-sm font-medium">Transactions</span>
                </div>
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => router.push('/recieve')}
                    className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 mb-2"
                  >
                    <ArrowDown className="w-6 h-6 text-gray-700" />
                  </button>
                  <span className="text-sm font-medium">Receive</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white rounded-t-2xl px-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setSelectedTab('crypto')}
                  className={`py-4 font-semibold relative transition-colors ${
                    selectedTab === 'crypto' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Wallets
                  {selectedTab === 'crypto' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedTab('watchlist')}
                  className={`py-4 font-semibold relative transition-colors ${
                    selectedTab === 'watchlist' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Transactions
                  {selectedTab === 'watchlist' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedTab('nft')}
                  className={`py-4 font-semibold relative flex items-center gap-1 transition-colors ${
                    selectedTab === 'nft' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pending Transactions
                  {getDisplayedPendingTransactions().length > 0 && (
                    <div className="w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center text-[10px]">
                      {getDisplayedPendingTransactions().length}
                    </div>
                  )}
                  {selectedTab === 'nft' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-2xl p-4">
              {/* My Wallets Tab */}
              {selectedTab === 'crypto' && (
                <div className="space-y-4">
                  {wallets.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallets</h3>
                      <p className="text-gray-500">You don't have any wallets yet.</p>
                    </div>
                  ) : (
                    wallets.map((wallet) => (
                      <div 
                        key={wallet.id} 
                        onClick={() => handleWalletSelect(wallet)}
                        className={`flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer ${
                          selectedWalletId === wallet.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCurrencyLogo(wallet.adminWallet?.currencyAbbreviation || 'default')}`}>
                            <span className="text-white font-bold text-sm">
                              {wallet.adminWallet?.currencyAbbreviation?.charAt(0) || 'W'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">
                              {wallet.adminWallet?.currency || 'Wallet'} 
                              <span className="text-gray-500 font-normal ml-2">
                                {wallet.adminWallet?.currencyAbbreviation}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Balance: {formatCurrency(wallet.amountInUSD)}
                            </div>
                            {wallet.adminWallet && (
                              <div className="text-xs text-gray-400">
                                {formatCryptoAmount(convertFromUSD(wallet.amountInUSD, wallet.adminWallet.currencyAbbreviation), wallet.adminWallet.currencyAbbreviation)} {getCurrencySymbol(wallet.adminWallet.currencyAbbreviation)}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
                              {wallet.address}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(wallet.amountInUSD)}</div>
                          <div className="text-sm text-gray-500">
                            {wallet.adminWallet?.currencyAbbreviation}
                          </div>
                          {selectedWalletId === wallet.id && (
                            <div className="text-xs text-green-500 font-semibold">Selected</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Transactions Tab - Show transactions for selected wallet */}
              {selectedTab === 'watchlist' && (
                <div className="space-y-4">
                  {!selectedWalletId ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <ArrowRight className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Wallet</h3>
                      <p className="text-gray-500">Please select a wallet to view transactions.</p>
                    </div>
                  ) : getDisplayedTransactions().length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <ArrowRight className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
                      <p className="text-gray-500">You don't have any transactions for this wallet yet.</p>
                    </div>
                  ) : (
                    <>
                      {getDisplayedTransactions().map((tx) => {
                        const convertedAmount = getConvertedTransactionAmount(tx.amountInUSD);
                        const currencyAbbreviation = selectedWallet?.adminWallet?.currencyAbbreviation || '';
                        
                        return (
                          <div key={tx.id} className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-red-100' : 'bg-green-100'}`}>
                                <ArrowUp className={`w-5 h-5 ${tx.type === 'credit' ? 'text-red-600' : 'text-green-600'}`} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {tx.type === 'credit' ? 'Sent' : 'Received'} {selectedWallet?.adminWallet?.currency}
                                </div>
                                <div className="text-sm text-gray-500">{tx.date}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${tx.type === 'credit' ? 'text-red-600' : 'text-green-600'}`}>
                                {tx.type === 'debit' ? '-' : '+'}{formatCurrency(Math.abs(tx.amountInUSD))}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatCryptoAmount(convertedAmount, currencyAbbreviation)} {getCurrencySymbol(currencyAbbreviation)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* View All Button for Transactions */}
                      {transactions.filter(tx => tx.clientWalletId === selectedWalletId).length > 5 && (
                        <button
                          onClick={() => setShowAllTransactions(!showAllTransactions)}
                          className="w-full py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {showAllTransactions ? 'Show Less' : 'View All Transactions'}
                          <ChevronRight className={`w-4 h-4 transition-transform ${showAllTransactions ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Pending Transactions Tab */}
              {selectedTab === 'nft' && (
                <div className="space-y-4">
                  {!selectedWalletId ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <Clock className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Wallet</h3>
                      <p className="text-gray-500">Please select a wallet to view pending transactions.</p>
                    </div>
                  ) : getDisplayedPendingTransactions().length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <Clock className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Transactions</h3>
                      <p className="text-gray-500">You don't have any pending transactions for this wallet.</p>
                    </div>
                  ) : (
                    <>
                      {getDisplayedPendingTransactions().map((tx) => {
                        const convertedAmount = getConvertedTransactionAmount(tx.amountInUSD);
                        const currencyAbbreviation = selectedWallet?.adminWallet?.currencyAbbreviation || '';
                        
                        return (
                          <div key={tx.id} className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-red-100' : 'bg-green-100'}`}>
                                <ArrowUp className={`w-5 h-5 ${tx.type === 'credit' ? 'text-red-600' : 'text-green-600'}`} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {tx.type === 'credit' ? 'Sent' : 'Received'} {selectedWallet?.adminWallet?.currency}
                                </div>
                                <div className="text-sm text-gray-500">{tx.date}</div>
                                <div className="text-xs text-yellow-600 font-semibold">Pending</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${tx.type === 'credit' ? 'text-red-600' : 'text-green-600'}`}>
                                {tx.type === 'debit' ? '-' : '+'}{formatCurrency(Math.abs(tx.amountInUSD))}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatCryptoAmount(convertedAmount, currencyAbbreviation)} {getCurrencySymbol(currencyAbbreviation)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* View All Button for Pending Transactions */}
                      {pendingTransactions.filter(tx => {
                        const isPending = tx.status === 'pending' ;
                        return isPending && tx.clientWalletId === selectedWalletId;
                      }).length > 5 && (
                        <button
                          onClick={() => setShowAllPending(!showAllPending)}
                          className="w-full py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {showAllPending ? 'Show Less' : 'View All Pending Transactions'}
                          <ChevronRight className={`w-4 h-4 transition-transform ${showAllPending ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Show selected wallet details */}
          <div className="hidden lg:block space-y-6">
            {/* Selected Wallet Info */}
            {selectedWallet && (
              <div className="bg-white rounded-2xl p-4">
                <h3 className="text-lg font-bold mb-4">Selected Wallet</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCurrencyLogo(selectedWallet.adminWallet?.currencyAbbreviation || 'default')}`}>
                    <span className="text-white font-bold">
                      {selectedWallet.adminWallet?.currencyAbbreviation?.charAt(0) || 'W'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{selectedWallet.adminWallet?.currency}</div>
                    <div className="text-sm text-gray-500">{selectedWallet.adminWallet?.currencyAbbreviation}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance (USD)</span>
                    <span className="font-semibold">{formatCurrency(selectedWallet.amountInUSD)}</span>
                  </div>
                  {selectedWallet.adminWallet && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balance (Crypto)</span>
                      <span className="font-semibold">
                        {formatCryptoAmount(getConvertedBalance(), selectedWallet.adminWallet.currencyAbbreviation)} {getCurrencySymbol(selectedWallet.adminWallet.currencyAbbreviation)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address</span>
                    <span className="text-xs font-mono truncate max-w-[120px]">{selectedWallet.address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-4">Wallet Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Wallets</span>
                  <span className="font-semibold">{wallets.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Balance</span>
                  <span className="font-semibold">{formatCurrency(totalBalance)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Selected Wallet</span>
                  <span className="font-semibold">
                    {selectedWallet ? selectedWallet.adminWallet?.currency : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">TrustXWallet</div>
                  <div className="text-xs text-gray-600">Secure Digital Wallet</div>
                </div>
              </div>
              <a href="#" className="text-blue-600 text-sm font-semibold">Learn more →</a>
            </div>
          </div>
        </div>

        {/* Mobile Support Section */}
        <div className="lg:hidden space-y-6 mt-6">
          {/* Selected Wallet Info for Mobile */}
          {selectedWallet && (
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-4">Selected Wallet</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCurrencyLogo(selectedWallet.adminWallet?.currencyAbbreviation || 'default')}`}>
                  <span className="text-white font-bold">
                    {selectedWallet.adminWallet?.currencyAbbreviation?.charAt(0) || 'W'}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{selectedWallet.adminWallet?.currency}</div>
                  <div className="text-sm text-gray-500">{selectedWallet.adminWallet?.currencyAbbreviation}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance (USD)</span>
                  <span className="font-semibold">{formatCurrency(selectedWallet.amountInUSD)}</span>
                </div>
                {selectedWallet.adminWallet && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance (Crypto)</span>
                    <span className="font-semibold">
                      {formatCryptoAmount(getConvertedBalance(), selectedWallet.adminWallet.currencyAbbreviation)} {getCurrencySymbol(selectedWallet.adminWallet.currencyAbbreviation)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-lg font-bold mb-4">Wallet Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Wallets</span>
                <span className="font-semibold">{wallets.length}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Balance</span>
                <span className="font-semibold">{formatCurrency(totalBalance)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Selected Wallet</span>
                <span className="font-semibold">
                  {selectedWallet ? selectedWallet.adminWallet?.currency : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Banner */}
        <div className="lg:hidden bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200 flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">Our next era begins.</div>
              <div className="text-xs text-gray-600">Powered by Trust Wallet</div>
              <a href="#" className="text-blue-600 text-sm font-semibold">Read the vision →</a>
            </div>
          </div>
        </div>

        {/* Top Movers Section */}
        <div className="bg-white rounded-2xl p-4 mt-6">
          <h2 className="text-xl font-bold mb-4">Top movers</h2>
          <div className="flex gap-4 mb-4 border-b">
            <button
              onClick={() => setTopMoversTab('rwa')}
              className={`pb-3 font-semibold relative ${topMoversTab === 'rwa' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              RWA Protocols
              {topMoversTab === 'rwa' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setTopMoversTab('ai')}
              className={`pb-3 font-semibold ${topMoversTab === 'ai' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              AI
            </button>
            <button
              onClick={() => setTopMoversTab('memes')}
              className={`pb-3 font-semibold ${topMoversTab === 'memes' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              Memes
            </button>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            Top Real World Assets Protocols (24h % price gain)
          </div>

          <div className="space-y-3">
            {topMovers.map((token) => (
              <div key={token.rank} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-medium w-4">{token.rank}</span>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                  <div>
                    <div className="font-semibold">{token.name}</div>
                    <div className="text-xs text-gray-500">MCap: {token.mcap} · Vol: {token.vol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{token.price}</div>
                  <div className="text-sm text-green-500">{token.change}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 font-semibold hover:bg-gray-50 rounded-lg mt-4">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 py-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg"></div>
            <span className="text-xs font-semibold text-blue-600">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2">
            <TrendingUp className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500">Send</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2">
            <ArrowDownUp className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500">Receive</span>
          </button>
        </div>
      </nav>
    </div>
  );
}