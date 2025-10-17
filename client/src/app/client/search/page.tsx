import { useState } from 'react';
import { ChevronLeft, Star } from 'lucide-react';

export default function CryptoSearchList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(['btc', 'eth', 'bnb']);
  const [networkFilter, setNetworkFilter] = useState('All Networks');

  const cryptos = [
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      description: 'Bitcoin',
      network: 'Bitcoin',
      icon: '₿',
      bgColor: 'bg-orange-500',
      isFavorite: true
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      description: 'Ethereum',
      network: 'Ethereum',
      icon: '◆',
      bgColor: 'bg-gray-700',
      isFavorite: true
    },
    {
      id: 'numi',
      symbol: 'NUMI',
      name: 'Numine',
      description: 'NUMINE',
      network: 'Ethereum',
      icon: 'Ν',
      bgColor: 'bg-yellow-600',
      isFavorite: false
    },
    {
      id: 'xrp',
      symbol: 'XRP',
      name: 'XRP',
      description: 'XRP',
      network: 'XRP',
      icon: '✕',
      bgColor: 'bg-gray-800',
      isFavorite: false
    },
    {
      id: 'bnb',
      symbol: 'BNB',
      name: 'BNB Smart Chain',
      description: 'BNB Smart Chain',
      network: 'BNB Smart Chain',
      icon: '◉',
      bgColor: 'bg-yellow-500',
      isFavorite: true
    },
    {
      id: 'wod',
      symbol: 'WoD',
      name: 'World of Dypians',
      description: 'World of Dypians',
      network: 'BNB Smart Chain',
      icon: 'D',
      bgColor: 'bg-blue-500',
      isFavorite: false
    },
    {
      id: 'zeus',
      symbol: 'ZEUS',
      name: 'Zeus Network',
      description: 'Zeus Network',
      network: 'BNB Smart Chain',
      icon: '⚡',
      bgColor: 'bg-gray-900',
      isFavorite: false
    },
    {
      id: 'aleo',
      symbol: 'ALEO',
      name: 'Aleo',
      description: 'Aleo',
      network: 'BNB Smart Chain',
      icon: 'A',
      bgColor: 'bg-white text-gray-900 border border-gray-300',
      isFavorite: false
    }
  ];

  const toggleFavorite = (id:string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const filteredCryptos = cryptos.filter(crypto => {
    const matchesSearch = crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          crypto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNetwork = networkFilter === 'All Networks' || crypto.network === networkFilter;
    return matchesSearch && matchesNetwork;
  });

  const networks = ['All Networks', ...new Set(cryptos.map(c => c.network))];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <ChevronLeft size={24} className="text-gray-700" />
        <h1 className="text-xl font-bold text-gray-900">Search</h1>
        <div className="w-6" />
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
          <span className="text-gray-400 mr-2">🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 flex-1 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Network Filter */}
      <div className="px-4 pb-4">
        <select
          value={networkFilter}
          onChange={(e) => setNetworkFilter(e.target.value)}
          className="flex items-center bg-gray-100 rounded-full px-4 py-2 text-gray-700 font-medium outline-none cursor-pointer"
        >
          {networks.map(network => (
            <option key={network} value={network}>
              {network}
            </option>
          ))}
        </select>
      </div>

      {/* Crypto List */}
      <div className="space-y-0">
        {filteredCryptos.map((crypto) => (
          <div
            key={crypto.id}
            className="flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            {/* Left Side - Icon and Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-12 h-12 ${crypto.bgColor} rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
                {crypto.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{crypto.symbol}</span>
                  <span className="text-gray-500 text-sm">{crypto.name}</span>
                </div>
                <p className="text-gray-500 text-sm">{crypto.description}</p>
              </div>
            </div>

            {/* Right Side - Favorite Star */}
            <button
              onClick={() => toggleFavorite(crypto.id)}
              className="ml-3 flex-shrink-0 transition hover:scale-110"
            >
              <Star
                size={24}
                className={favorites.includes(crypto.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-300'}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCryptos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-4xl mb-3">🔍</span>
          <p className="text-gray-500">No cryptos found</p>
        </div>
      )}
    </div>
  );
}