'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '../../../hooks/useTransactions';
import { Transaction } from '../../../types/transaction';
import TransactionList from '../../../components/TransactionList';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

export default function TransactionsPage() {
  const { getAllTransactions, deleteTransaction, loading } = useTransactions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; transaction: Transaction | null }>({
    isOpen: false,
    transaction: null,
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await getAllTransactions();
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">All Transactions</h1>
              <p className="text-gray-600 mt-2">Complete transaction history across all wallets</p>
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