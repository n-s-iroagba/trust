'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { AdminWallet, ClientWalletWithAssociations, Transaction, TransactionCreationDto, TransactionStatus, TransactionType } from '@/types';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { Client } from '@/types/client';

export default function TransactionsPage() {
  const { clientWalletId } = useParams<{ clientWalletId: string }>();
  const {
    getTransactionsByClientWalletId,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
  } = useTransactions();

  const [data,setData] = useState<ClientWalletWithAssociations|null>(null);


  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; transaction: Transaction | null }>({
    isOpen: false,
    transaction: null,
  });

  // ✅ Load all transactions
  const loadTransactions = async () => {
    try {
      setError(null);
      const response = await getTransactionsByClientWalletId(Number(clientWalletId));
      if (response.success && response.data) {
     
        setData(response?.data);
      } else {
        setError(response.message || 'Failed to load transactions');
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('An unexpected error occurred while loading transactions.');
    }
  };

  useEffect(() => {
    if (clientWalletId) loadTransactions();
  }, [clientWalletId]);

  // ✅ Apply filters
  const filteredTransactions = useMemo(() => {
    let filtered = data?.transactions||[];
    if (statusFilter !== 'all') filtered = filtered.filter((t) => t.status === statusFilter);
    if (typeFilter !== 'all') filtered = filtered.filter((t) => t.type === typeFilter);
    return filtered;
  }, [data, statusFilter, typeFilter]);

  // ✅ Create or Update transaction
  const handleSubmit = async (formData: Partial<Transaction>) => {
    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, formData);
      } else {
        await createTransaction(formData as TransactionCreationDto);
      }
      setShowForm(false);
      setEditTransaction(null);
      await loadTransactions();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setError('Unexpected error while saving transaction.');
    }
  };

  // ✅ Handle Delete
  const handleDelete = async () => {
    if (!deleteModal.transaction) return;
    try {
      const response = await deleteTransaction(deleteModal.transaction.id);
      if (response.success) {
        setDeleteModal({ isOpen: false, transaction: null });
        await loadTransactions();
      } else {
        setError(response.message || 'Failed to delete transaction');
      }
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setError('Unexpected error while deleting transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Transactions</h1>
            <p className="text-gray-600 mt-1">
              Viewing all transactions for <strong>{data?.client.firstName + ' ' +data?.client?.lastName}</strong>

            </p>
                 <p className="text-gray-600 mt-1">
       <strong>{data?.adminWallet.currency} Wallet</strong>
            </p>
          </div>

          <button
            onClick={() => {
              setEditTransaction(null);
              setShowForm(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + New Transaction
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', TransactionStatus.PENDING, TransactionStatus.SUCCESSFUL, TransactionStatus.FAILED].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as TransactionStatus | 'all')}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
          {['all', 'credit', 'debit'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as TransactionType | 'all')}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                typeFilter === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onApprove={(tx:Transaction) =>{
            if(tx.status===TransactionStatus.PENDING) return handleSubmit({...tx, status: TransactionStatus.SUCCESSFUL })}
            
            }
          onReject={(tx:Transaction) => {
            if(tx.status===TransactionStatus.PENDING) return handleSubmit({ ...tx, status: TransactionStatus.FAILED })}
          }
          onEdit={(tx:Transaction) => {
            if(tx.isAdminCreated){
            setEditTransaction(tx);
            setShowForm(true);
            }
          }}
          onDelete={(tx) =>{ 
            if(tx.isAdminCreated){
            setDeleteModal({ isOpen: true, transaction: tx })}
          }
          }
          loading={loading}
        />

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <TransactionForm
                clientWalletId={Number(clientWalletId)}
                initialData={editTransaction || undefined}
                mode={editTransaction ? 'edit' : 'create'}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, transaction: null })}
          onConfirm={handleDelete}
          title="Delete Transaction"
          message={`Are you sure you want to delete transaction #${deleteModal.transaction?.id}? This action cannot be undone.`}
          loading={loading}
        />
      </div>
    </div>
  );
}
