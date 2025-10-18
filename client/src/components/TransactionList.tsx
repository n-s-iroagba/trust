'use client';
import Image from 'next/image';

import { Transaction } from '../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (transaction: Transaction) => void;
  loading?: boolean;
}

export default function TransactionList({ transactions, onDelete, loading }: TransactionListProps) {
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

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
        <p className="text-gray-500">No transactions found for this criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-primary">Transactions</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-lg font-bold ${
                    transaction.amountInUSD >= 0 ? 'text-pastel-green' : 'text-red-500'
                  }`}>
                    {transaction.amountInUSD >= 0 ? '+' : ''}${transaction.amountInUSD.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {transaction.clientWallet && (
                    <div>
                      <span className="font-medium">Client Wallet:</span>
                      <div>
                        <p>Client: {transaction.clientWallet.clientId}</p>
                        <p className="font-mono text-xs truncate">
                          {transaction.clientWallet.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {transaction.adminWallet && (
                    <div>
                      <span className="font-medium">Admin Wallet:</span>
                      <div className="flex items-center space-x-2">
                        {transaction.adminWallet.logo && (
                          <Image
                            fill
                            src={transaction.adminWallet.logo}
                            alt={transaction.adminWallet.currency}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span>
                          {transaction.adminWallet.currency} ({transaction.adminWallet.currencyAbbreviation})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {onDelete && (
                <div className="ml-4">
                  <button
                    onClick={() => onDelete(transaction)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}