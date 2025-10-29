'use client';
import { useState, useEffect } from 'react';
import { useAdminWallets } from '../../../hooks/useAdminWallets';
import { AdminWallet, AdminWalletCreationDto, AdminWalletUpdateDto } from '../../../types/adminWallet';
import AdminWalletList from '../../../components/AdminWalletList';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { useCoins } from '@/hooks/useCoins';
import Image from 'next/image';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
}

export default function AdminWalletsPage() {
  const { getAllAdminWallets, createAdminWallet, updateAdminWallet, deleteAdminWallet, loading } = useAdminWallets();
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<AdminWallet | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wallet: AdminWallet | null }>({
    isOpen: false,
    wallet: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [clientReceivingAddress, setClientReceivingAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: coins, loading: coinsLoading } = useCoins();

  useEffect(() => {
    const loadWallets = async () => {
      try {
        setError(null);
        const response = await getAllAdminWallets();
        if (response.success && response.data) {
          setWallets(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          setError(response.message || 'Failed to load admin wallets');
        }
      } catch (err) {
        console.error('Failed to load wallets:', err);
        setError('An unexpected error occurred while loading admin wallets. Please try again.');
      }
    };

    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setError(null);
      const response = await getAllAdminWallets();
      if (response.success && response.data) {
        setWallets(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setError(response.message || 'Failed to load admin wallets');
      }
    } catch (err) {
      console.error('Failed to load wallets:', err);
      setError('An unexpected error occurred while loading admin wallets. Please try again.');
    }
  };

  // Filter coins based on search term
  const filteredCoins = coins?.filter((coin: Coin) => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateWallet = async () => {
    if (!selectedCoin || !clientReceivingAddress.trim()) {
      setFormError('Please select a coin and enter client receiving address');
      return;
    }

    try {
      setFormError(null);
      const walletData: AdminWalletCreationDto = {
        id: 0, // This will be set by backend
        currencyAbbreviation: selectedCoin.symbol.toUpperCase(),
        logo: selectedCoin.image,
        currency: selectedCoin.name,
        clientReceivingAddress: clientReceivingAddress.trim(),
      };

      const response = await createAdminWallet(walletData);
      
      if (response.success) {
        setShowForm(false);
        setSelectedCoin(null);
        setClientReceivingAddress('');
        setSearchTerm(''); // Clear search when form closes
        loadWallets();
      } else {
        setFormError(response.message || 'Failed to create admin wallet');
      }
    } catch (err) {
      console.error('Failed to create wallet:', err);
      setFormError('An unexpected error occurred while creating the admin wallet. Please try again.');
    }
  };

  const handleUpdateWallet = async (data: AdminWalletUpdateDto) => {
    if (!editingWallet) return;
    
    try {
      setFormError(null);
      const response = await updateAdminWallet(editingWallet.id, data);
      
      if (response.success) {
        setEditingWallet(null);
        setSelectedCoin(null);
        setClientReceivingAddress('');
        setSearchTerm(''); // Clear search when form closes
        loadWallets();
      } else {
        setFormError(response.message || 'Failed to update admin wallet');
      }
    } catch (err) {
      console.error('Failed to update wallet:', err);
      setFormError('An unexpected error occurred while updating the admin wallet. Please try again.');
    }
  };

  const handleDeleteWallet = async () => {
    if (!deleteModal.wallet) return;

    try {
      setDeleteError(null);
      const response = await deleteAdminWallet(deleteModal.wallet.id);
      
      if (response.success) {
        setDeleteModal({ isOpen: false, wallet: null });
        loadWallets();
      } else {
        setDeleteError(response.message || 'Failed to delete admin wallet');
      }
    } catch (err) {
      console.error('Failed to delete wallet:', err);
      setDeleteError('An unexpected error occurred while deleting the admin wallet. Please try again.');
    }
  };

  const handleEdit = (wallet: AdminWallet) => {
    setEditingWallet(wallet);
    setShowForm(false);
    setFormError(null);
    // For editing, we don't pre-fill coin selection as it might not be in the coins list
    setSelectedCoin(null);
    setClientReceivingAddress(wallet.clientReceivingAddress || '');
    setSearchTerm(''); // Clear search when switching to edit mode
  };

  const handleCreateNew = () => {
    setEditingWallet(null);
    setShowForm(true);
    setFormError(null);
    setSelectedCoin(null);
    setClientReceivingAddress('');
    setSearchTerm(''); // Clear search when creating new
  };

  const handleCancelForm = () => {
    setEditingWallet(null);
    setShowForm(false);
    setFormError(null);
    setSelectedCoin(null);
    setClientReceivingAddress('');
    setSearchTerm(''); // Clear search when canceling
  };

  const clearError = () => {
    setError(null);
    setFormError(null);
    setDeleteError(null);
  };

  const retryLoadWallets = () => {
    loadWallets();
  };

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    setSearchTerm(''); // Clear search when a coin is selected
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Messages */}
        {(error || formError) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error ? 'Load Error' : 'Form Error'}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error || formError}
                  </p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {error && (
              <div className="mt-3">
                <button
                  onClick={retryLoadWallets}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Wallets</h1>
              <p className="text-gray-600 mt-2">Manage your admin wallets and currencies</p>
            </div>
            {!showForm && !editingWallet && (
              <button
                onClick={handleCreateNew}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 bg-blue-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Wallet</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            {(showForm || editingWallet) ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  {editingWallet ? 'Edit Admin Wallet' : 'Create Admin Wallet'}
                </h2>
                
                {/* Form Error */}
                {formError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-700">{formError}</p>
                    </div>
                  </div>
                )}
                
                {!editingWallet ? (
                  // Create Form with Coin Selection
                  <div className="space-y-4">
                    {/* Coin Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Coin *
                      </label>
                      
                      {/* Search Input */}
                      <div className="relative mb-3">
                        <input
                          type="text"
                          placeholder="Search coins by name or symbol..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {searchTerm && (
                          <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {coinsLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">Loading coins...</p>
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                          {filteredCoins.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              {searchTerm ? 'No coins found matching your search.' : 'No coins available.'}
                            </div>
                          ) : (
                            filteredCoins.map((coin: Coin) => (
                              <div
                                key={coin.id}
                                className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                                  selectedCoin?.id === coin.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                                onClick={() => handleCoinSelect(coin)}
                              >
                                <div className="flex items-center space-x-3">
                                  <Image fill src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-gray-900">{coin.name}</span>
                                      <span className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ${coin.current_price.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Coin Preview */}
                    {selectedCoin && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <h4 className="font-medium text-green-800 mb-2">Selected Coin</h4>
                        <div className="flex items-center space-x-3">
                          <Image fill src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-medium text-green-900">{selectedCoin.name}</p>
                            <p className="text-sm text-green-700">{selectedCoin.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Client Receiving Address */}
                    <div>
                      <label htmlFor="clientReceivingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Client Receiving Address *
                      </label>
                      <input
                        type="text"
                        id="clientReceivingAddress"
                        value={clientReceivingAddress}
                        onChange={(e) => setClientReceivingAddress(e.target.value)}
                        required
                        placeholder="Enter the client receiving address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCreateWallet}
                        disabled={loading || !selectedCoin || !clientReceivingAddress.trim()}
                        className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 bg-blue-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Creating...' : 'Create Wallet'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Edit Form (simplified - only allow updating client receiving address)
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data: AdminWalletUpdateDto = {
                      currencyAbbreviation: editingWallet.currencyAbbreviation,
                      logo: editingWallet.logo,
                      currency: editingWallet.currency,
                      clientReceivingAddress: formData.get('clientReceivingAddress') as string,
                    };
                    handleUpdateWallet(data);
                  }} className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Wallet Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Currency:</span>
                          <span className="text-blue-900 font-medium">{editingWallet.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Symbol:</span>
                          <span className="text-blue-900 font-medium">{editingWallet.currencyAbbreviation}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="clientReceivingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Client Receiving Address *
                      </label>
                      <input
                        type="text"
                        id="clientReceivingAddress"
                        name="clientReceivingAddress"
                        defaultValue={editingWallet.clientReceivingAddress || ''}
                        required
                        placeholder="Enter the client receiving address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 bg-blue-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Updating...' : 'Update Wallet'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-primary mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Wallet</h3>
                <p className="text-gray-500 mb-4">Select from available coins to create a new admin wallet</p>
                <button
                  onClick={handleCreateNew}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 bg-blue-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                  Create Wallet
                </button>
              </div>
            )}
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <AdminWalletList
              wallets={wallets}
              onEdit={handleEdit}
              onDelete={(wallet) => setDeleteModal({ isOpen: true, wallet })}
              loading={loading}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => {
            setDeleteModal({ isOpen: false, wallet: null });
            setDeleteError(null);
          }}
          onConfirm={handleDeleteWallet}
          title="Delete Admin Wallet"
          message={`Are you sure you want to delete the ${deleteModal.wallet?.currency} wallet? This action cannot be undone.`}
          loading={loading}
        />

        {/* Delete Error Modal */}
        {deleteError && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Delete Error</h3>
              </div>
              <p className="text-gray-600 mb-4">{deleteError}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setDeleteError(null)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 bg-blue-400 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}