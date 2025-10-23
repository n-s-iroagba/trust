'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, ChevronLeft, QrCode, Share2, Search } from 'lucide-react';
import { useClientWallets } from '@/hooks/useClientWallets';
import { ClientWallet } from '@/types';

export default function ReceivePage() {
  const [copied, setCopied] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ALL');
  const [clientWallets, setClientWallets] = useState<ClientWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState<string | null>(null);
  
  const { getClientWalletsByClientId } = useClientWallets();
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
        }
      } catch (err) {
        console.error('Failed to fetch client wallets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientWallets();
  }, []);

  // Get unique networks from client wallets
  const networks = ['ALL', ...new Set(clientWallets.map(wallet => wallet.adminWallet.currency))];

  // Filter wallets based on search and network
  const filteredWallets = clientWallets.filter(wallet => {
    const matchesSearch = wallet.adminWallet.currencyAbbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.adminWallet.currency.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNetwork = selectedNetwork === 'ALL' || wallet.adminWallet.currency === selectedNetwork;
    
    return matchesSearch && matchesNetwork;
  });

  // Group wallets by popularity (you can define your own logic here)
  const popularWallets = filteredWallets.slice(0, 3); // First 3 as popular
  const otherWallets = filteredWallets.slice(3);

  const copyToClipboard = async (receivingAddress: string, walletId: string) => {
    try {
      await navigator.clipboard.writeText(receivingAddress);
      setCopied(walletId);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareAddress = async (receivingAddress: string, symbol: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My ${symbol} Receiving Address`,
          text: `Here is my ${symbol} address for receiving payments: ${receivingAddress}`,
        });
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard(receivingAddress, 'share');
        alert('Address copied to clipboard for sharing');
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
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

  const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4): string => {
    if (address.length <= startLength + endLength) return address;
    return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-4">Loading wallets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={handleBack} className="flex items-center">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Receive</h1>
        <div className="w-6" />
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search cryptocurrency"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 ml-2 flex-1 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Network Filter */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {networks.map((network) => (
            <button
              key={network}
              onClick={() => setSelectedNetwork(network)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedNetwork === network
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {network}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet List */}
      <div className="px-4 pb-4">
        {/* Popular Section - Show if we have wallets and search is not active */}
        {popularWallets.length > 0 && searchTerm === '' && selectedNetwork === 'ALL' && (
          <>
            <h2 className="text-gray-500 text-sm font-semibold mb-4">Popular</h2>
            <div className="space-y-3 mb-6">
              {popularWallets.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  copied={copied}
                  onCopy={copyToClipboard}
                  onShare={shareAddress}
                  onShowQR={setShowQR}
                  getCryptoIcon={getCryptoIcon}
                  getCryptoColor={getCryptoColor}
                  truncateAddress={truncateAddress}
                />
              ))}
            </div>
          </>
        )}

        {/* All Crypto Section */}
        {(otherWallets.length > 0 || filteredWallets.length > 0) && (
          <>
            <h2 className="text-gray-500 text-sm font-semibold mb-4">
              {searchTerm || selectedNetwork !== 'ALL' ? 'Search Results' : 'All Crypto'}
            </h2>
            <div className="space-y-3">
              {(searchTerm || selectedNetwork !== 'ALL' ? filteredWallets : otherWallets).map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  copied={copied}
                  onCopy={copyToClipboard}
                  onShare={shareAddress}
                  onShowQR={setShowQR}
                  getCryptoIcon={getCryptoIcon}
                  getCryptoColor={getCryptoColor}
                  truncateAddress={truncateAddress}
                />
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {filteredWallets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedNetwork !== 'ALL' 
                ? 'Try adjusting your search or filter criteria'
                : 'No wallets available for receiving'}
            </p>
          </div>
        )}
      </div>

  
    </div>
  );
}

// Separate component for wallet card for better organization
interface WalletCardProps {
  wallet: ClientWallet;
  copied: string;
  onCopy: (receivingAddress: string, walletId: string) => void;
  onShare: (receivingAddress: string, symbol: string) => void;
  onShowQR: (walletId: string) => void;
  getCryptoIcon: (symbol: string) => string;
  getCryptoColor: (symbol: string) => string;
  truncateAddress: (address: string, startLength?: number, endLength?: number) => string;
}

function WalletCard({ 
  wallet, 
  copied, 
  onCopy, 
  getCryptoIcon, 
  getCryptoColor, 
  truncateAddress 
}: WalletCardProps) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
      {/* Left Side - Icon and Info */}
      <div className="flex items-center flex-1 min-w-0">
        <div className={`w-12 h-12 ${getCryptoColor(wallet.adminWallet.currencyAbbreviation)} rounded-full flex items-center justify-center text-white text-lg flex-shrink-0`}>
          {getCryptoIcon(wallet.adminWallet.currencyAbbreviation)}
        </div>
        <div className="ml-3 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{wallet.adminWallet.currencyAbbreviation}</span>
            <span className="text-gray-500 text-sm">{wallet.adminWallet.currency}</span>
          </div>
          <p className="text-gray-400 text-sm truncate">
            {truncateAddress(wallet.adminWallet.clientReceivingAddress)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Balance: ${wallet.amountInUSD.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
        <button
          onClick={() => onCopy(wallet.adminWallet.clientReceivingAddress, wallet.id.toString())}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
          title="Copy receiving address"
        >
          <Copy
            size={20}
            className={copied === wallet.id.toString() ? 'text-green-500' : 'text-gray-500'}
          />
        </button>
      </div>
    </div>
  );
}

