'use client';

import { useState, useEffect } from 'react';
import { CreditDebitDto } from '../types/clientWallet';
import { AdminWallet } from '../types/adminWallet';
import { useAdminWallets } from '../hooks/useAdminWallets';

interface CreditDebitFormProps {
  walletId: number;
  onCredit: (walletId: number, data: CreditDebitDto) => Promise<void>;
  onDebit: (walletId: number, data: CreditDebitDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function CreditDebitForm({ 
  walletId, 
  onCredit, 
  onDebit, 
  onCancel, 
  loading,
  error: parentError 
}: CreditDebitFormProps) {
  const { getAllAdminWallets } = useAdminWallets();
  const [adminWallets, setAdminWallets] = useState<AdminWallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [walletsError, setWalletsError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreditDebitDto>({
    amountInUSD: 0,
    adminWalletId: 0,
  });
  const [operation, setOperation] = useState<'credit' | 'debit'>('credit');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminWallets = async () => {
      try {
        setWalletsLoading(true);
        setWalletsError(null);
        const response = await getAllAdminWallets();
        if (response.success && response.data) {
          const wallets = Array.isArray(response.data) ? response.data : [response.data];
          setAdminWallets(wallets);
          // Set the first admin wallet as default if available
          if (wallets.length > 0 && formData.adminWalletId === 0) {
            setFormData(prev => ({ ...prev, adminWalletId: wallets[0].id }));
          }
        } else {
          setWalletsError(response.message || 'Failed to load admin wallets. Please try again.');
        }
      } catch (error) {
        console.error('Failed to fetch admin wallets:', error);
        setWalletsError('An unexpected error occurred while loading admin wallets. Please try again.');
      } finally {
        setWalletsLoading(false);
      }
    };

    fetchAdminWallets();
  }, [getAllAdminWallets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (formData.amountInUSD <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }

    if (formData.adminWalletId === 0) {
      setFormError('Please select an admin wallet.');
      return;
    }

    try {
      setFormError(null);
      if (operation === 'credit') {
        await onCredit(walletId, formData);
      } else {
        await onDebit(walletId, formData);
      }
      setFormData({ amountInUSD: 0, adminWalletId: adminWallets[0]?.id || 0 });
    } catch (err) {
      // Error handled by parent
      console.error('Form submission error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amountInUSD' ? parseFloat(value) || 0 : parseInt(value) || 0 
    }));
    
    // Clear form errors when user starts typing
    if (formError) {
      setFormError(null);
    }
  };

  const handleOperationChange = (newOperation: 'credit' | 'debit') => {
    setOperation(newOperation);
    // Clear errors when switching operations
    setFormError(null);
  };

  const clearError = () => {
    setFormError(null);
    setWalletsError(null);
  };

  const retryLoadWallets = () => {
    const fetchAdminWallets = async () => {
      try {
        setWalletsLoading(true);
        setWalletsError(null);
        const response = await getAllAdminWallets();
        if (response.success && response.data) {
          const wallets = Array.isArray(response.data) ? response.data : [response.data];
          setAdminWallets(wallets);
          if (wallets.length > 0 && formData.adminWalletId === 0) {
            setFormData(prev => ({ ...prev, adminWalletId: wallets[0].id }));
          }
        } else {
          setWalletsError(response.message || 'Failed to load admin wallets. Please try again.');
        }
      } catch (error) {
        console.error('Failed to fetch admin wallets:', error);
        setWalletsError('An unexpected error occurred while loading admin wallets. Please try again.');
      } finally {
        setWalletsLoading(false);
      }
    };

    fetchAdminWallets();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {operation === 'credit' ? 'Credit Wallet' : 'Debit Wallet'}
      </h2>

      {/* Error Messages */}
      {(parentError || formError || walletsError) && (
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
                  {walletsError ? 'Load Error' : parentError ? 'Transaction Error' : 'Form Error'}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {walletsError || parentError || formError}
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
          {walletsError && (
            <div className="mt-3">
              <button
                onClick={retryLoadWallets}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                Retry Loading Wallets
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleOperationChange('credit')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            operation === 'credit'
              ? 'bg-pastel-green text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Credit
        </button>
        <button
          type="button"
          onClick={() => handleOperationChange('debit')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            operation === 'debit'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Debit
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amountInUSD" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD) *
          </label>
          <input
            type="number"
            id="amountInUSD"
            name="amountInUSD"
            value={formData.amountInUSD}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="adminWalletId" className="block text-sm font-medium text-gray-700 mb-1">
            Admin Wallet *
          </label>
          {walletsLoading ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 animate-pulse">
              Loading admin wallets...
            </div>
          ) : adminWallets.length === 0 ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              No admin wallets available. Please create an admin wallet first.
            </div>
          ) : (
            <select
              id="adminWalletId"
              name="adminWalletId"
              value={formData.adminWalletId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Admin Wallet</option>
              {adminWallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.currency} ({wallet.currencyAbbreviation}) - {wallet.address}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || walletsLoading || adminWallets.length === 0}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              operation === 'credit'
                ? 'bg-pastel-green hover:bg-green-600 focus:ring-pastel-green'
                : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
            }`}
          >
            {loading ? 'Processing...' : operation === 'credit' ? 'Credit Wallet' : 'Debit Wallet'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}