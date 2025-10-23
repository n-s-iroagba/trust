'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction, TransactionStatus, TransactionType } from '@/types';
import TransactionList from '@/components/TransactionList';

export default function TransactionsPage() {
  const { clientWalletId } = useParams<{ clientWalletId: string }>();
  const {
    getPendingTransactions,
    updateTransaction,
  
    loading,
  } = useTransactions();

  const [transactions,setTransactions] = useState<Transaction[]>([]);


  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
 
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);



  // ✅ Load all transactions
  const loadTransactions = async () => {
    try {
      setError(null);
      const response = await getPendingTransactions();
      if (response.success && response.data) {
     
        setTransactions(response?.data as Transaction[]);
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
    let filtered = transactions;
    if (statusFilter !== 'all') filtered = filtered.filter((t) => t.status === statusFilter);
    if (typeFilter !== 'all') filtered = filtered.filter((t) => t.type === typeFilter);
    return filtered;
  }, [transactions, statusFilter, typeFilter]);

  // ✅ Create or Update transaction
  const handleSubmit = async (formData: Partial<Transaction>) => {
    try {
      if (editTransaction) await updateTransaction(editTransaction.id, formData);
      setEditTransaction(null);
      await loadTransactions();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setError('Unexpected error while saving transaction.');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">View All Pending Transactions</h1>
          </div>
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
          loading={loading}
        />
      </div>
    </div>
  );
}
