'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTransactions } from '../../../../../hooks/useTransactions';
import { Transaction } from '../../../../../types/transaction';
import TransactionList from '../../../../../components/TransactionList';
import DeleteConfirmationModal from '../../../../../components/DeleteConfirmationModal';

export default function ClientWalletTransactionsPage() {
  const params = useParams();
  const router = useRouter();
  const clientWalletId = parseInt(params.clientWalletId as string);
  
  const { getTransactionsByClientWalletId, deleteTransaction, loading } = useTransactions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; transaction: Transaction | null }>({
    isOpen: false,
    transaction: null,
  });

  useEffect(() => {
    if (clientWalletId) {
      loadTransactions();
    }
  }, [clientWalletId]);

  const loadTransactions = async () => {
    try {
      const response = await getTransactionsByClientWalletId(clientWalletId);
      if (response.success && response.data) {
        const transactionsData = Array.isArray(response.data) ? response.data : [response.data];
        setTransactions(transactionsData);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deleteModal.transaction) return;

    try {
      await deleteTransaction(deleteModal.transaction.id);
      setDeleteModal({ isOpen: false, transaction: null });
      loadTransactions();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleBack = () => {
    router.back();
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
                  Client Wallet ID: {clientWalletId}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
              {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-lg">
          <TransactionList
            transactions={transactions}
            onDelete={(transaction) => setDeleteModal({ isOpen: true, transaction })}
            loading={loading}
          />
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
                      .toFixed(2)}
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
                      .toFixed(2)}
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
                      .toFixed(2)}
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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, transaction: null })}
          onConfirm={handleDeleteTransaction}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This will also adjust the client wallet balance and cannot be undone."
          loading={loading}
        />
      </div>
    </div>
  );
}