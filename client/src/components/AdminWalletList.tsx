'use client';

import Image from 'next/image';
import { AdminWallet } from '../types/adminWallet';

interface AdminWalletListProps {
  wallets: AdminWallet[];
  onEdit: (wallet: AdminWallet) => void;
  onDelete: (wallet: AdminWallet) => void;
  loading?: boolean;
}

export default function AdminWalletList({ wallets, onEdit, onDelete, loading }: AdminWalletListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Admin Wallets</h3>
        <p className="text-gray-500">Get started by creating your first admin wallet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-primary">Admin Wallets</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {wallet.logo && (
                  <Image fill
                    src={wallet.logo}
                    alt={`${wallet.currency} logo`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {wallet.currency}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {wallet.currencyAbbreviation} • {wallet.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(wallet)}
                  className="text-primary hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(wallet)}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}