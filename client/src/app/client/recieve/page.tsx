'use client'
import { useState } from 'react';
import { Copy, ChevronLeft, QrCode, Share2 } from 'lucide-react';

export default function ReceivePage() {
  const [copied, setCopied] = useState<string>('');

  const wallets = [
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      address: 'bc1q8p2...dhe5jt',
      fullAddress: 'bc1q8p2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxbcxxxxdhe5jt',
      icon: '₿',
      bgColor: 'bg-orange-500',
      network: 'Bitcoin'
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0xA80D...C28940',
      fullAddress: '0xA80D3DA23AD0Ddd8B872C8D5E456C2C28940',
      icon: '◆',
      bgColor: 'bg-gray-700',
      network: 'Ethereum'
    },
    {
      id: 'sol',
      symbol: 'SOL',
      name: 'Solana',
      address: 'GnxXwUZ...ArEga8',
      fullAddress: 'GnxXwUZU5PELcYsmKfgSrXnwUZjFa8ArEga8',
      icon: '◈',
      bgColor: 'bg-black',
      network: 'Solana',
      accentColor: 'from-cyan-400 to-purple-500'
    },
    {
      id: 'twt',
      symbol: 'TWT',
      name: 'BNB Smart Chain',
      address: '0xA80D...C28940',
      fullAddress: '0xA80D3DA23AD0Ddd8B872C8D5E456C2C28940',
      icon: '🛡️',
      bgColor: 'bg-blue-600',
      network: 'BNB Smart Chain'
    },
    {
      id: 'bnb',
      symbol: 'BNB',
      name: 'BNB Smart Chain',
      address: '0xA80D...C28940',
      fullAddress: '0xA80D3DA23AD0Ddd8B872C8D5E456C2C28940',
      icon: '◉',
      bgColor: 'bg-yellow-500',
      network: 'BNB Smart Chain'
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      name: 'Ethereum',
      address: '0xA80D...C28940',
      fullAddress: '0xA80D3DA23AD0Ddd8B872C8D5E456C2C28940',
      icon: '⊕',
      bgColor: 'bg-teal-600',
      network: 'Ethereum'
    },
    {
      id: 'usdc',
      symbol: 'USDC',
      name: 'Ethereum',
      address: '0xA80D...C28940',
      fullAddress: '0xA80D3DA23AD0Ddd8B872C8D5E456C2C28940',
      icon: '$',
      bgColor: 'bg-blue-500',
      network: 'Ethereum'
    }
  ];

  const copyToClipboard = async (address:string, id:string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <ChevronLeft size={24} className="text-gray-700" />
        <h1 className="text-xl font-bold text-gray-900">Receive</h1>
        <div className="w-6" />
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 ml-2 flex-1 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Network Filter */}
      <div className="px-4 pb-4">
        <button className="flex items-center bg-gray-100 rounded-full px-4 py-2 text-gray-700 font-medium">
          All Networks
          <span className="ml-2">▼</span>
        </button>
      </div>

      {/* Popular Section */}
      <div className="px-4 py-2">
        <h2 className="text-gray-500 text-sm font-semibold mb-4">Popular</h2>
        
        {/* Wallet Items */}
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              {/* Left Side - Icon and Info */}
              <div className="flex items-center flex-1 min-w-0">
                <div className={`w-12 h-12 ${wallet.bgColor} rounded-full flex items-center justify-center text-white text-lg flex-shrink-0`}>
                  {wallet.icon}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{wallet.symbol}</span>
                    <span className="text-gray-500 text-sm">{wallet.name}</span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{wallet.address}</p>
                </div>
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(wallet.fullAddress, wallet.id)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                  title="Copy address"
                >
                  <Copy
                    size={20}
                    className={copied === wallet.id ? 'text-green-500' : 'text-gray-500'}
                  />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition" title="QR Code">
                  <QrCode size={20} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition" title="Share">
                  <Share2 size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Crypto Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h2 className="text-gray-500 text-sm font-semibold">All crypto</h2>
      </div>
    </div>
  );
}