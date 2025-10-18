'use client';

import { useState, useEffect } from 'react';
import { useAdminWallets } from '../hooks/useAdminWallets';
import { AdminWallet } from '../types/adminWallet';
import AdminWalletForm from './AdminWalletForm';
import AdminWalletList from './AdminWalletList';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function AdminWalletPage() {
  const { getAllAdminWallets, deleteAdminWallet, loading } = useAdminWallets();
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wallet: AdminWallet | null }>({
    isOpen: false,
    wallet: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setError(null);
      const response = await getAllAdminWallets();
      if (response.success && response.data) {
        setWallets(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setError(response.message || 'Failed to load admin wallets. Please try again.');
      }
    } catch (err) {
      console.error('Failed to load wallets:', err);
      setError('An unexpected error occurred while loading admin wallets. Please try again.');
    }
  };

  const handleCreateSuccess = () => {
    setShowForm(false);
    loadWallets();
  };

  const handleDelete = async () => {
    if (!deleteModal.wallet) return;

    try {
      setDeleteError(null);
      const response = await deleteAdminWallet(deleteModal.wallet.id);
      
      if (response.success) {
        setDeleteModal({ isOpen: false, wallet: null });
        loadWallets();
      } else {
        setDeleteError(response.message || 'Failed to delete admin wallet. Please try again.');
      }
    } catch (err) {
      console.error('Failed to delete wallet:', err);
      setDeleteError('An unexpected error occurred while deleting the admin wallet. Please try again.');
    }
  };

  const clearError = () => {
    setError(null);
    setDeleteError(null);
  };

  const retryLoadWallets = () => {
    loadWallets();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Messages */}
        {(error || deleteError) && (
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
                    {error ? 'Load Error' : 'Delete Error'}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error || deleteError}
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Wallets</h1>
          <p className="text-gray-600 mt-2">Manage your admin wallets and currencies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            {showForm ? (
              <AdminWalletForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowForm(false)}
              />
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
                  onClick={() => setShowForm(true)}
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
              onEdit={(wallet) => {
                // Implement edit functionality
                console.log('Edit wallet:', wallet);
              }}
              onDelete={(wallet) => {
                setDeleteError(null);
                setDeleteModal({ isOpen: true, wallet });
              }}
              loading={loading}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => {
            setDeleteError(null);
            setDeleteModal({ isOpen: false, wallet: null });
          }}
          onConfirm={handleDelete}
          title="Delete Admin Wallet"
          message={`Are you sure you want to delete the ${deleteModal.wallet?.currency} wallet? This action cannot be undone.`}
          loading={loading}
   
        />
      </div>
    </div>
  );
}