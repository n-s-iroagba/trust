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
      // Error handled by hook
    }
  };

  const handleCreateSuccess = () => {
    setShowForm(false);
    loadWallets();
  };

  const handleDelete = async () => {
    if (!deleteModal.wallet) return;

    try {
      await deleteAdminWallet(deleteModal.wallet.id);
      setDeleteModal({ isOpen: false, wallet: null });
      loadWallets();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              onDelete={(wallet) => setDeleteModal({ isOpen: true, wallet })}
              loading={loading}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, wallet: null })}
          onConfirm={handleDelete}
          title="Delete Admin Wallet"
          message={`Are you sure you want to delete the ${deleteModal.wallet?.currency} wallet? This action cannot be undone.`}
          loading={loading}
        />
      </div>
    </div>
  );
}