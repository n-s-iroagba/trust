'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClientWalletWithAssociations, Transaction, TransactionCreationDto} from '@/types';
import { useClientWallets } from '@/hooks/useClientWallets';
import TransactionForm from '@/components/TransactionForm';
import { API_ROUTES } from '@/lib/api-routes';
import { ApiService } from '@/services/apiService';

export default function ClientWalletTransactionsPage() {
  const params = useParams();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const clientWalletId = parseInt(params.clientWalletId as string);

  const { getClientWalletById } = useClientWallets();
  const [wallet, setWallet] = useState<ClientWalletWithAssociations | null>(null);
  const transactions = wallet?.transactions || [];
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        setError(null);
        const response = await getClientWalletById(clientWalletId);
        if (response.success && response.data) {
          setWallet(response.data);
        } else {
          setError(response.message || 'Failed to load transactions');
        }
      } catch (err) {
        console.error('Failed to load transactions:', err);
        setError('An unexpected error occurred while loading transactions. Please try again.');
      }
    };

    if (clientWalletId) {
      loadWallets();
    }
  }, [clientWalletId]);

  const handleBack = () => {
    router.back();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormError(null);
  };

  const clearError = () => {
    setError(null);
    setDeleteError(null);
  };

  const handleSubmit = async (transactionData: Transaction) => {
    try {
      setFormError(null);
      
      // Create new transaction
      const createData: TransactionCreationDto = {
        amountInUSD: transactionData.amountInUSD,
        clientWalletId: Number(clientWalletId),
        recipientAddress: transactionData.recipientAddress,
        type: transactionData.type,
        status: transactionData.status,
        fee: transactionData.fee,
        isAdminCreated: true,
      };
      
      const response = await ApiService.post(API_ROUTES.CLIENT_WALLETS.CREDIT(String(clientWalletId)), createData);
      if (response.success) {
        setShowForm(false);
        window.location.reload();
      } else {
        setFormError(response.message || 'Failed to create transaction');
      }
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setFormError('An unexpected error occurred while saving the transaction.');
    }
  };

  if (isNaN(clientWalletId)) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Invalid Client Wallet ID</h1>
            <p className="text-gray-600 mt-2">The provided client wallet ID is invalid.</p>
            <button
              onClick={handleBack}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Messages */}
        {error && (
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
                    Load Error
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
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
            <div className="mt-3">
              <button
                onClick={() => window.location.reload()}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary">Transactions</h1>
                <p className="text-gray-600 mt-2">
                  {wallet?.client.firstName} {wallet?.client.lastName}
                </p>
                <p className="text-gray-600 mt-2">
                  {wallet?.adminWallet?.currencyAbbreviation}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
              {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Make Transaction
          </button>
          
          <button
            onClick={() => router.push(`/transactions/${clientWalletId}`)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Transactions
          </button>
        </div>

        {/* Summary Card */}
        {transactions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Credits</p>
                  <p className="text-2xl font-bold text-pastel-green mt-1">
                    +$
                    {transactions
                      .filter(t => t.amountInUSD > 0)
                      .reduce((sum, t) => sum + t.amountInUSD, 0)
                      }
                  </p>
                </div>
                <div className="text-pastel-green">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Debits</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">
                    -$
                    {Math.abs(transactions
                      .filter(t => t.amountInUSD < 0)
                      .reduce((sum, t) => sum + t.amountInUSD, 0))
                      }
                  </p>
                </div>
                <div className="text-red-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Balance</p>
                  <p className={`text-2xl font-bold mt-1 ${
                    transactions.reduce((sum, t) => sum + t.amountInUSD, 0) >= 0 
                      ? 'text-primary' 
                      : 'text-red-500'
                  }`}>
                    $
                    {transactions
                      .reduce((sum, t) => sum + t.amountInUSD, 0)
                      }
                  </p>
                </div>
                <div className="text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {transactions.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first transaction.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Make Your First Transaction
            </button>
          </div>
        )}

      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Transaction
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

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

              <TransactionForm
                clientWalletId={Number(clientWalletId)}
                initialData={undefined}
                mode={'create'}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}