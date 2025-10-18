
'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Search, ChevronDown, ChevronRight, X, ArrowUp, ArrowDownUp, Gem, TrendingUp, Settings, Copy, QrCode } from 'lucide-react';
import { useClientWallets } from '@/hooks/useClientWallets';
import { ClientWallet } from '@/types/clientWallet';

export default function TrustWalletDashboard() {

  const clientId = "1"; // You can make this dynamic based on authentication

  const [selectedTab, setSelectedTab] = useState<'crypto' | 'watchlist' | 'nft'>('crypto');


  const [topMoversTab, setTopMoversTab] = useState('rwa');
  const [popularTokensTab, setPopularTokensTab] = useState('top');
  
  const { 
    getClientWalletsByClientId,
    loading 
  } = useClientWallets();

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
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  // Mock data for the UI components
  const topMovers = [
    { name: 'Clearpool', price: '$0.13', mcap: '$109M', vol: '$3.51M', change: '+6.72%', rank: 1 },
    { name: 'Zebec Network', price: '$0.004', mcap: '$374M', vol: '$14.4M', change: '+5.84%', rank: 2 },
    { name: 'Sky', price: '$0.06', mcap: '$1.58B', vol: '$39.7M', change: '+3.41%', rank: 3 },
    { name: 'MANTRA', price: '$0.16', mcap: '$178M', vol: '$37.6M', change: '+0.99%', rank: 4 },
    { name: 'Synthetix', price: '$1.11', mcap: '$381M', vol: '$117M', change: '+0.54%', rank: 5 },
  ];

  const popularTokens = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$114,430', mcap: '$2.28T', vol: '$57B', change: '-0.04%', rank: 1 },
    { name: 'Ethereum', symbol: 'ETH', price: '$4,146', mcap: '$500B', vol: '$37.2B', change: '-1.36%', rank: 2 },
    { name: 'BNB', symbol: 'BNB', price: '$1,006', mcap: '$140B', vol: '$2.99B', change: '-1.8%', rank: 3 },
    { name: 'TRON', symbol: 'TRX', price: '$0.33', mcap: '$31.5B', vol: '$626M', change: '-1.04%', rank: 4 },
    { name: 'Avalanche', symbol: 'AVAX', price: '$29.8', mcap: '$12.6B', vol: '$910M', change: '-0.28%', rank: 5 },
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
            <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span className="font-semibold">TrustX Wallet</span>
              <ChevronDown className="w-4 h-4" />
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </button>
          </div>

          {/* Mobile Wallet Selector */}
          <button className="lg:hidden flex items-center gap-2">
            <span className="font-semibold">TrustX Wallet</span>
            <ChevronDown className="w-4 h-4" />
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </button>

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
            
            {/* Mobile Menu - Only on small screens */}
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
          {/* Main Content - Left Side (Mobile: Full Width, Desktop: 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Section */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-5xl lg:text-6xl font-bold mb-2">
                {formatCurrency(totalBalance)}
              </div>
              <div className="text-gray-500 mb-6">Total Balance</div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="flex flex-col items-center">
                  <button className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 mb-2">
                    <ArrowUp className="w-6 h-6 text-gray-700" />
                  </button>
                  <span className="text-sm font-medium">Send</span>
                </div>
                <div className="flex flex-col items-center">
                  <button className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 mb-2">
                    <ArrowDownUp className="w-6 h-6 text-gray-700" />
                  </button>
                  <span className="text-sm font-medium">Swap</span>
                </div>
              </div>
            </div>

      

            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white rounded-t-2xl px-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setSelectedTab('crypto')}
                  className={`py-4 font-semibold relative ${selectedTab === 'crypto' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  My Wallets
                  {selectedTab === 'crypto' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedTab('watchlist')}
                  className={`py-4 font-semibold ${selectedTab === 'watchlist' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setSelectedTab('nft')}
                  className={`py-4 font-semibold flex items-center gap-1 ${selectedTab === 'nft' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  Requests
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </button>
              </div>
              <button className="p-2">
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

            {/* Wallet Holdings */}
            <div className="bg-white rounded-b-2xl p-4">
              {loading ? (
                // Loading skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between py-4 border-b animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : wallets.length === 0 ? (
                // Empty state
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallets</h3>
                  <p className="text-gray-500">You don&apos;t have any wallets yet.</p>
                </div>
              ) : (
                // Wallet list
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors">
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button className="w-full py-4 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg mt-4">
                View all wallets
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                {wallets.slice(0, 3).map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCurrencyLogo(wallet.adminWallet?.currencyAbbreviation || 'default')}`}>
                        <span className="text-white text-xs font-bold">
                          {wallet.adminWallet?.currencyAbbreviation?.charAt(0) || 'W'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{wallet.adminWallet?.currency}</div>
                        <div className="text-xs text-gray-500">Last updated</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{formatCurrency(wallet.amountInUSD)}</div>
                      <div className="text-xs text-gray-500">Balance</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 font-semibold hover:bg-gray-50 rounded-lg mt-4">
                View all activity <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sidebar - Right Side (Desktop Only) */}
          <div className="hidden lg:block space-y-6">
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
                  <span className="text-gray-600">Currencies</span>
                  <span className="font-semibold">
                    {new Set(wallets.map(w => w.adminWallet?.currencyAbbreviation)).size}
                  </span>
                </div>
              </div>
            </div>

      
          </div>
        </div>

        {/* Mobile Support Section */}
        <div className="lg:hidden space-y-6 mt-6">
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
                <span className="text-gray-600">Currencies</span>
                <span className="font-semibold">
                  {new Set(wallets.map(w => w.adminWallet?.currencyAbbreviation)).size}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="lg:hidden bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Our next era begins.</div>
                  <div className="text-xs text-gray-600">Powered by TWT</div>
                  <a href="#" className="text-blue-600 text-sm font-semibold">Read the vision →</a>
                </div>
              </div>
              <button className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white rounded-t-2xl px-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setSelectedTab('crypto')}
                  className={`py-4 font-semibold relative ${selectedTab === 'crypto' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  Crypto
                  {selectedTab === 'crypto' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedTab('watchlist')}
                  className={`py-4 font-semibold ${selectedTab === 'watchlist' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  Watchlist
                </button>
                <button
                  onClick={() => setSelectedTab('nft')}
                  className={`py-4 font-semibold flex items-center gap-1 ${selectedTab === 'nft' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  NFT
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </button>
              </div>
              <button className="p-2">
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

            {/* Crypto Holdings */}
            <div className="bg-white rounded-b-2xl p-4">
              <div className="flex items-center justify-between py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="font-semibold">ETH <span className="text-gray-500 font-normal">Ethereum</span></div>
                    <div className="text-sm text-gray-500">$4,146.82 <span className="text-red-500">-1.36%</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">0</div>
                  <div className="text-sm text-gray-500">$0.00</div>
                </div>
              </div>
              
              <button className="w-full py-4 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg mt-4">
                Manage crypto
              </button>
            </div>

            {/* Top Movers */}
            <div className="bg-white rounded-2xl p-4">
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

            {/* Popular Tokens */}
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-xl font-bold mb-4">Popular tokens</h2>
              
              <div className="flex gap-4 mb-4 border-b overflow-x-auto">
                <button
                  onClick={() => setPopularTokensTab('top')}
                  className={`pb-3 font-semibold relative whitespace-nowrap ${popularTokensTab === 'top' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  Top
                  {popularTokensTab === 'top' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setPopularTokensTab('bnb')}
                  className={`pb-3 font-semibold whitespace-nowrap ${popularTokensTab === 'bnb' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  BNB
                </button>
                <button
                  onClick={() => setPopularTokensTab('eth')}
                  className={`pb-3 font-semibold whitespace-nowrap ${popularTokensTab === 'eth' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  ETH
                </button>
                <button
                  onClick={() => setPopularTokensTab('sol')}
                  className={`pb-3 font-semibold whitespace-nowrap ${popularTokensTab === 'sol' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  SOL
                </button>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Top tokens by total market cap
              </div>

              <div className="space-y-3">
                {popularTokens.map((token) => (
                  <div key={token.rank} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-medium w-4">{token.rank}</span>
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full"></div>
                      <div>
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-xs text-gray-500">MCap: {token.mcap} · Vol: {token.vol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{token.price}</div>
                      <div className={`text-sm ${token.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                        {token.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 font-semibold hover:bg-gray-50 rounded-lg mt-4">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Alpha Tokens */}
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-xl font-bold mb-4">Alpha tokens</h2>
              
              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="bg-gray-50 rounded-2xl p-4 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-bold">A</div>
                    <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="font-semibold mb-1">ALEO</div>
                  <div className="text-sm text-gray-500 mb-1">$2.72B</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">$0.22</span>
                    <span className="text-sm text-green-500">+3.02%</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-4 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-bold">N</div>
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                  </div>
                  <div className="font-semibold mb-1">NUM</div>
                  <div className="text-sm text-gray-500 mb-1">$1.45B</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">$0.18</span>
                    <span className="text-sm text-green-500">+2.15%</span>
                  </div>
                </div>
              </div>
            </div>
          

          {/* Sidebar - Right Side (Desktop Only) */}
          <div className="hidden lg:block space-y-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Our next era begins.</div>
                  <div className="text-xs text-gray-600">Powered by TWT</div>
                </div>
              </div>
              <a href="#" className="text-blue-600 text-sm font-semibold">Read the vision →</a>
            </div>

            {/* Earn Section */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Earn</h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-2">Earn up to</div>
                  <div className="text-2xl font-bold mb-2">
                    <span className="text-blue-600">25.27</span>
                    <span className="text-purple-600">%</span>
                    <span className="text-sm font-normal text-gray-600"> / year</span>
                  </div>
                  <div className="text-sm text-gray-700">on Stargaze</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-2">Earn up to</div>
                  <div className="text-2xl font-bold mb-2">
                    <span className="text-blue-600">22.91</span>
                    <span className="text-purple-600">%</span>
                    <span className="text-sm font-normal text-gray-600"> / year</span>
                  </div>
                  <div className="text-sm text-gray-700">on Juno</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mt-2"></div>
                </div>
              </div>
            </div>

            {/* Quests */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-4">Quests</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <div className="font-semibold mb-1">Complete quests</div>
                    <div className="text-sm text-gray-600">Earn up to 200 points per day</div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
                  Go
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-gray-500 text-center px-4">
              Past performance is not a reliable indicator of future results. Data source is from CoinMarketCap.{' '}
              <a href="#" className="underline">Subject to our Terms</a>
            </div>
          </div>
        

        {/* Mobile Earn & Quests Section */}
        <div className="lg:hidden space-y-6 mt-6">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Earn</h3>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 min-w-[200px]">
                <div className="text-sm text-gray-600 mb-2">Earn up to</div>
                <div className="text-2xl font-bold mb-2">
                  <span className="text-blue-600">25.27</span>
                  <span className="text-purple-600">%</span>
                  <span className="text-sm font-normal text-gray-600"> / year</span>
                </div>
                <div className="text-sm text-gray-700">on Stargaze</div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mt-2"></div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 min-w-[200px]">
                <div className="text-sm text-gray-600 mb-2">Earn up to</div>
                <div className="text-2xl font-bold mb-2">
                  <span className="text-blue-600">22.91</span>
                  <span className="text-purple-600">%</span>
                  <span className="text-sm font-normal text-gray-600"> / year</span>
                </div>
                <div className="text-sm text-gray-700">on Juno</div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mt-2"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-lg font-bold mb-4">Quests</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎯</div>
                <div>
                  <div className="font-semibold mb-1">Complete quests</div>
                  <div className="text-sm text-gray-600">Earn up to 200 points per day</div>
                </div>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
                Go
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center px-4 pb-20">
            Past performance is not a reliable indicator of future results. Data source is from CoinMarketCap.{' '}
            <a href="#" className="underline">Subject to our Terms</a>
          </div>
        </div>
      

           <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 py-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg"></div>
            <span className="text-xs font-semibold text-blue-600">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2">
            <TrendingUp className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500">Trending</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2">
            <ArrowDownUp className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500">Swap</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 relative">
            <Gem className="w-6 h-6 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Earn</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <span className="text-xs text-gray-500">Discover</span>
          </button>
        </div>
      </nav>
    </div>
  );
}