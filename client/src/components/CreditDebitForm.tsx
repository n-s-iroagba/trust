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
}

export default function CreditDebitForm({ walletId, onCredit, onDebit, onCancel, loading }: CreditDebitFormProps) {
  const { getAllAdminWallets } = useAdminWallets();
  const [adminWallets, setAdminWallets] = useState<AdminWallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [formData, setFormData] = useState<CreditDebitDto>({
    amountInUSD: 0,
    adminWalletId: 0,
  });
  const [operation, setOperation] = useState<'credit' | 'debit'>('credit');

  useEffect(() => {
    const fetchAdminWallets = async () => {
      try {
        setWalletsLoading(true);
        const response = await getAllAdminWallets();
        if (response.success && response.data) {
          const wallets = Array.isArray(response.data) ? response.data : [response.data];
          setAdminWallets(wallets);
          // Set the first admin wallet as default if available
          if (wallets.length > 0 && formData.adminWalletId === 0) {
            setFormData(prev => ({ ...prev, adminWalletId: wallets[0].id }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch admin wallets:', error);
      } finally {
        setWalletsLoading(false);
      }
    };

    fetchAdminWallets();
  }, [getAllAdminWallets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (operation === 'credit') {
        await onCredit(walletId, formData);
      } else {
        await onDebit(walletId, formData);
      }
      setFormData({ amountInUSD: 0, adminWalletId: adminWallets[0]?.id || 0 });
    } catch (err) {
      // Error handled by parent
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amountInUSD' ? parseFloat(value) || 0 : parseInt(value) || 0 
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {operation === 'credit' ? 'Credit Wallet' : 'Debit Wallet'}
      </h2>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setOperation('credit')}
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
          onClick={() => setOperation('debit')}
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