'use client';

import ClientWalletList from "@/components/ClientWalletList";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useAdminWallets } from "@/hooks/useAdminWallets";
import { useClientWallets } from "@/hooks/useClientWallets";
import { ClientWallet, AdminWallet, ClientWalletCreationDto, CreditDebitDto } from "@/types";
import { useState, useEffect } from "react";


export default function ClientWalletsPage() {
 
  const clientId = 7
  const { 
    getClientWalletsByClientId, 

 
    loading 
  } = useClientWallets();
  
  const { getAllAdminWallets } = useAdminWallets();
  
  const [wallets, setWallets] = useState<ClientWallet[]>([]);
  const [adminWallets, setAdminWallets] = useState<AdminWallet[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<ClientWallet | null>(null);
  const [showCreditDebitModal, setShowCreditDebitModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wallet: ClientWallet | null }>({
    isOpen: false,
    wallet: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadData = async () => {
    try {
      setError(null);
      await Promise.all([loadWallets(), loadAdminWallets()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadWallets = async () => {
    try {
      setError(null);
      const response = await getClientWalletsByClientId(String(clientId));
      if (response.success && response.data) {
        const walletsData = Array.isArray(response.data) ? response.data : [response.data];
        setWallets(walletsData);
      } else {
        setError(response.message || 'Failed to load wallets');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load wallets';
      setError(errorMessage);
      console.error('Failed to load wallets:', err);
    }
  };

  const loadAdminWallets = async () => {
    try {
      setError(null);
      const response = await getAllAdminWallets();
      if (response.success && response.data) {
        const adminWalletsData = Array.isArray(response.data) ? response.data : [response.data];
        setAdminWallets(adminWalletsData);
      } else {
        setError(response.message || 'Failed to load admin wallets');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load admin wallets';
      setError(errorMessage);
      console.error('Failed to load admin wallets:', err);
    }
  };






  const handleManageWallet = (wallet: ClientWallet) => {
    setSelectedWallet(wallet);
    setShowCreditDebitModal(true);
  };

  const handleCancelManage = () => {
    setShowCreditDebitModal(false);
    setSelectedWallet(null);
  };


  const dismissError = () => {
    setError(null);
  };

  const dismissSuccess = () => {
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">Error: {error}</span>
              </div>
              <button
                onClick={dismissError}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium">Success: {success}</span>
              </div>
              <button
                onClick={dismissSuccess}
                className="text-green-400 hover:text-green-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Client Wallets</h1>
              <p className="text-gray-600 mt-2">Manage client wallets and transactions</p>
            </div>
      
          </div>
        </div>



          {/* List Section */}
          <div className="lg:col-span-2">
            <ClientWalletList
              wallets={wallets}
              onCreditDebit={handleManageWallet}
              loading={loading}
            />
          </div>
        </div>


        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, wallet: null })}
          onConfirm={() => {}}
          title="Delete Client Wallet"
          message={`Are you sure you want to delete this client wallet? This action cannot be undone.`}
          loading={loading}
        />
      </div>

  );
}