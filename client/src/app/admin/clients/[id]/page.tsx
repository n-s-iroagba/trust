'use client';

import ClientWalletList from "@/components/ClientWalletList";
import CreditDebitForm from "@/components/CreditDebitForm";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useAdminWallets } from "@/hooks/useAdminWallets";
import { useClientWallets } from "@/hooks/useClientWallets";
import { ClientWallet, AdminWallet, ClientWalletCreationDto, CreditDebitDto } from "@/types";
import { useState, useEffect } from "react";


export default function ClientWalletsPage() {
 
  const clientId = 1
  const { 
    getClientWalletsByClientId, 
    createClientWallet, 
    creditWallet, 
    debitWallet, 
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

  const handleCreateWallet = async (data: ClientWalletCreationDto) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await createClientWallet(data);
      
      if (response.success) {
        setSuccess('Wallet created successfully!');
        setShowCreateForm(false);
        await loadWallets();
      } else {
        setError(response.message || 'Failed to create wallet');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      setError(errorMessage);
      console.error('Failed to create wallet:', err);
    }
  };

  const handleCredit = async (walletId: number, data: CreditDebitDto) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await creditWallet(walletId, data);
      
      if (response.success) {
        setSuccess('Wallet credited successfully!');
        setShowCreditDebitModal(false);
        setSelectedWallet(null);
        await loadWallets();
      } else {
        setError(response.message || 'Failed to credit wallet');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to credit wallet';
      setError(errorMessage);
      console.error('Failed to credit wallet:', err);
    }
  };

  const handleDebit = async (walletId: number, data: CreditDebitDto) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await debitWallet(walletId, data);
      
      if (response.success) {
        setSuccess('Wallet debited successfully!');
        setShowCreditDebitModal(false);
        setSelectedWallet(null);
        await loadWallets();
      } else {
        setError(response.message || 'Failed to debit wallet');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to debit wallet';
      setError(errorMessage);
      console.error('Failed to debit wallet:', err);
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

  const handleCancelCreate = () => {
    setShowCreateForm(false);
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
            {!showCreateForm && !showCreditDebitModal && (
              <button
                onClick={() => setShowCreateForm(true)}
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
            {showCreateForm ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-primary mb-6">Create Client Wallet</h2>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data: ClientWalletCreationDto = {
                    adminWalletId: parseInt(formData.get('adminWalletId') as string),
                    clientId: String(clientId),
                  };
                  handleCreateWallet(data);
                }} className="space-y-4">
                  

                  <div>
                    <label htmlFor="adminWalletId" className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Wallet *
                    </label>
                    {adminWallets.length === 0 ? (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                        No admin wallets available. Please create an admin wallet first.
                      </div>
                    ) : (
                      <select
                        id="adminWalletId"
                        name="adminWalletId"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select Admin Wallet</option>
                        {adminWallets.map((wallet) => (
                          <option key={wallet.id} value={wallet.id}>
                            {wallet.currency} ({wallet.currencyAbbreviation})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading || adminWallets.length === 0}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Creating...' : 'Create Wallet'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCreate}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Client Wallets</h3>
                <p className="text-gray-500 mb-4">
                  {showCreditDebitModal 
                    ? `Manage ${selectedWallet?.clientId}'s wallet` 
                    : 'Create new client wallets or manage existing ones'
                  }
                </p>
                {!showCreditDebitModal && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  >
                    Create Wallet
                  </button>
                )}
              </div>
            )}
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

        {/* Credit/Debit Modal */}
        {showCreditDebitModal && selectedWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary">
                    Manage {selectedWallet.clientId}&apos;s Wallet
                  </h3>
                  <button
                    onClick={handleCancelManage}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Wallet Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Current Balance:</span>
                      <p className="text-lg font-bold text-primary">${selectedWallet.amountInUSD.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Wallet Address:</span>
                      <p className="font-mono text-xs break-all">{selectedWallet.address}</p>
                    </div>
                  </div>
                </div>

                <CreditDebitForm
                  walletId={selectedWallet.id}
                  onCredit={handleCredit}
                  onDebit={handleDebit}
                  onCancel={handleCancelManage}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
}