'use client';
import Image from 'next/image';
import { ClientWallet } from '../types/clientWallet';
import Link from 'next/link';

interface ClientWalletListProps {
  wallets: ClientWallet[];
  onCreditDebit: (wallet: ClientWallet) => void;
  loading?: boolean;
}

export default function ClientWalletList({ wallets, onCreditDebit, loading }: ClientWalletListProps) {
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Client Wallets</h3>
        <p className="text-gray-500">No client wallets found. Create your first client wallet to get started.</p>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">Client Wallets</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'}
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Client: {wallet.clientId}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Wallet ID: {wallet.id}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    ${wallet.amountInUSD.toFixed(2)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Wallet Address:</span>
                    <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded mt-1">
                      {wallet.address}
                    </p>
                  </div>
                  
                  {wallet.adminWallet && (
                    <div>
                      <span className="font-medium">Admin Wallet:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {wallet.adminWallet.logo && (
                          <Image fill
                            src={wallet.adminWallet.logo}
                            alt={wallet.adminWallet.currency}
                            width={16}
                            height={16}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span className="text-sm">
                          {wallet.adminWallet.currency} ({wallet.adminWallet.currencyAbbreviation})
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono truncate mt-1">
                        {wallet.adminWallet.address}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>
                    Created: {new Date(wallet.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {new Date(wallet.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="ml-4 flex flex-col space-y-2">
                <button
                  onClick={() => onCreditDebit(wallet)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Manage</span>
                </button>
                <Link
                  href={`/transactions/client-wallet/${wallet.id}`}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 text-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Transactions</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}