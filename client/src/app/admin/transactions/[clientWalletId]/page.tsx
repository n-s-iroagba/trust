'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { AdminWallet, ClientWalletWithAssociations, Transaction, TransactionCreationDto, TransactionStatus, TransactionType } from '@/types';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { ApiService } from '@/services/apiService';
import { API_ROUTES } from '@/lib/api-routes';
import { useClientWallets } from '@/hooks/useClientWallets';

export default function TransactionsPage() {
  const { clientWalletId } = useParams<{ clientWalletId: string }>();
  const {
    getTransactionsByClientWalletId,
    updateTransaction,
    updateTransactionStatus,
    deleteTransaction,
    loading,
  } = useTransactions();

  const {getClientWalletById} = useClientWallets()


  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [data, setData] = useState<ClientWalletWithAssociations | null>(null);
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; transaction: Transaction | null }>({
    isOpen: false,
    transaction: null,
  });

  // ✅ Load all transactions
  const loadTransactions = async () => {
    try {
      setError(null);
      const response = await getTransactionsByClientWalletId(Number(clientWalletId));

      const clientData = await getClientWalletById(Number(clientWalletId))
      if (clientData.data) setData(clientData.data)
      
      if (response.success && response.data) {
        setTransactions (response.data as Transaction[]);
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
    let filtered = data?.transactions || [];
    if (statusFilter !== 'all') filtered = filtered.filter((t) => t.status === statusFilter);
    if (typeFilter !== 'all') filtered = filtered.filter((t) => t.type === typeFilter);
    return filtered;
  }, [data, statusFilter, typeFilter]);

  // ✅ Create or Update transaction
  const handleSubmit = async (transactionData: Transaction) => {
    try {
      setFormError(null);
      
      if (editTransaction) {
        // Update existing transaction
        const updateData = {
          amountInUSD: transactionData.amountInUSD,
          recipientAddress : transactionData.recipientAddress ,
          type: transactionData.type,
          status: transactionData.status,
     
          fee: transactionData.fee,
        };
        
        const response = await updateTransaction(editTransaction.id, updateData);
        if (response.success) {
          setShowForm(false);
          setEditTransaction(null);
          await loadTransactions();
        } else {
          setFormError(response.message || 'Failed to update transaction');
        }
      } else {
        // Create new transaction
        const createData: TransactionCreationDto = {
          amountInUSD: transactionData.amountInUSD,
          clientWalletId: Number(clientWalletId),
          recipientAddress : transactionData.recipientAddress ,
          type: transactionData.type,
          status: transactionData.status,
     
          fee: transactionData.fee,
          isAdminCreated: true,
        };
        
        const response = await ApiService.post(API_ROUTES.CLIENT_WALLETS.CREDIT(clientWalletId),createData);
        if (response.success) {
          setShowForm(false);
          await loadTransactions();
        } else {
          setFormError(response.message || 'Failed to create transaction');
        }
      }
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setFormError('An unexpected error occurred while saving the transaction.');
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
      setError('An unexpected error occurred while deleting transaction.');
    }
  };

  // ✅ Handle status updates (Approve/Reject)
  const handleStatusUpdate = async (transaction: Transaction, newStatus: TransactionStatus) => {
    try {
      const updateData = {
        status: newStatus,
      };
      
      const response = await updateTransactionStatus(transaction.id, updateData);
      if (response.success) {
        await loadTransactions();
      } else {
        setError(response.message || `Failed to ${newStatus.toLowerCase()} transaction`);
      }
    } catch (err) {
      console.error('Failed to update transaction status:', err);
      setError(`An unexpected error occurred while updating transaction status to ${newStatus.toLowerCase()}.`);
    }
  };

  // ✅ Reset form when opening/closing
  const handleOpenForm = () => {
    setEditTransaction(null);
    setFormError(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTransaction(null);
    setFormError(null);
  };

  const handleEdit = (transaction: Transaction) => {
    if (transaction.isAdminCreated) {
      setEditTransaction(transaction);
      setFormError(null);
      setShowForm(true);
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
              Viewing all transactions for <strong>{data?.client.firstName + ' ' + data?.client?.lastName}</strong>
            </p>
            <p className="text-gray-600 mt-1">
              <strong>{data?.adminWallet.currency} Wallet</strong>
            </p>
          </div>

          <button
            onClick={handleOpenForm}
            className="bg-primary  px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Transaction</span>
          </button>
        </div>

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
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Status Filters */}
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
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </button>
            )
          )}
          
          {/* Type Filters */}
          {['all', TransactionType.CREDIT, TransactionType.DEBIT].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as TransactionType | 'all')}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                typeFilter === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onApprove={(tx: Transaction) => {
            if (tx.status === TransactionStatus.PENDING) {
              handleStatusUpdate(tx, TransactionStatus.SUCCESSFUL);
            }
          }}
          onReject={(tx: Transaction) => {
            if (tx.status === TransactionStatus.PENDING) {
              handleStatusUpdate(tx, TransactionStatus.FAILED);
            }
          }}
          onEdit={handleEdit}
          onDelete={(tx) => {
            if (tx.isAdminCreated) {
              setDeleteModal({ isOpen: true, transaction: tx });
            }
          }}
          loading={loading}
        />

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editTransaction ? 'Edit Transaction' : 'Create Transaction'}
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
                  initialData={editTransaction || undefined}
                  mode={editTransaction ? 'edit' : 'create'}
                  onSubmit={handleSubmit}
                />
              </div>
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