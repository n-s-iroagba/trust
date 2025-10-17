'use client';

import { useState, useEffect } from 'react';
import { useAdminWallets } from '../../../hooks/useAdminWallets';
import { AdminWallet, AdminWalletCreationDto, AdminWalletUpdateDto } from '../../../types/adminWallet';
import AdminWalletList from '../../../components/AdminWalletList';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

export default function AdminWalletsPage() {
  const { getAllAdminWallets, createAdminWallet, updateAdminWallet, deleteAdminWallet, loading } = useAdminWallets();
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<AdminWallet | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wallet: AdminWallet | null }>({
    isOpen: false,
    wallet: null,
  });

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const response = await getAllAdminWallets();
      if (response.success && response.data) {
        setWallets(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (err) {
      console.error('Failed to load wallets:', err);
    }
  };

  const handleCreateWallet = async (data: AdminWalletCreationDto) => {
    try {
      await createAdminWallet(data);
      setShowForm(false);
      loadWallets();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleUpdateWallet = async (data: AdminWalletUpdateDto) => {
    if (!editingWallet) return;
    
    try {
      await updateAdminWallet(editingWallet.id, data);
      setEditingWallet(null);
      loadWallets();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleDeleteWallet = async () => {
    if (!deleteModal.wallet) return;

    try {
      await deleteAdminWallet(deleteModal.wallet.id);
      setDeleteModal({ isOpen: false, wallet: null });
      loadWallets();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleEdit = (wallet: AdminWallet) => {
    setEditingWallet(wallet);
    setShowForm(false);
  };

  const handleCreateNew = () => {
    setEditingWallet(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingWallet(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center space-x-2"
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
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    currencyAbbreviation: formData.get('currencyAbbreviation') as string,
                    logo: formData.get('logo') as string,
                    currency: formData.get('currency') as string,
                  };
                  
                  if (editingWallet) {
                    handleUpdateWallet(data);
                  } else {
                    handleCreateWallet(data);
                  }
                }} className="space-y-4">
                  <div>
                    <label htmlFor="currencyAbbreviation" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency Abbreviation *
                    </label>
                    <select
                      id="currencyAbbreviation"
                      name="currencyAbbreviation"
                      defaultValue={editingWallet?.currencyAbbreviation || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Currency</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL *
                    </label>
                    <input
                      type="url"
                      id="logo"
                      name="logo"
                      defaultValue={editingWallet?.logo || ''}
                      required
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency Name *
                    </label>
                    <input
                      type="text"
                      id="currency"
                      name="currency"
                      defaultValue={editingWallet?.currency || ''}
                      required
                      placeholder="US Dollar"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {editingWallet && (
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Wallet Address</h4>
                      <p className="text-sm text-blue-600 font-mono break-all">{editingWallet.address}</p>
                      <p className="text-xs text-blue-500 mt-1">Wallet address is auto-generated and cannot be changed</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving...' : editingWallet ? 'Update Wallet' : 'Create Wallet'}
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
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-primary mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Wallet</h3>
                <p className="text-gray-500 mb-4">Add a new admin wallet to start managing currencies</p>
                <button
                  onClick={handleCreateNew}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
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
          onClose={() => setDeleteModal({ isOpen: false, wallet: null })}
          onConfirm={handleDeleteWallet}
          title="Delete Admin Wallet"
          message={`Are you sure you want to delete the ${deleteModal.wallet?.currency} wallet? This action cannot be undone.`}
          loading={loading}
        />
      </div>
    </div>
  );
}