'use client';

import Image from 'next/image';
import { Transaction, TransactionStatus, TransactionType } from '../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onReject?: (transaction: Transaction) => void;
  onApprove?:(transaction:Transaction) => void
  loading?: boolean;
}

export default function TransactionList({ transactions, onDelete, onReject, onApprove, loading,onEdit }: TransactionListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
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
            <div className="flex items-start justify-between">
              {/* Left section */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`text-lg font-bold ${
                      transaction.type === TransactionType.CREDIT ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {transaction.type === TransactionType.CREDIT ? '+' : '-'}${transaction.amountInUSD}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.createdAt ?? transaction.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Recipient Address:</span>
                    <p className="font-mono text-xs truncate">{transaction.recipientAddress }</p>
                  </div>

                  <div>
                    <span className="font-medium">Fee:</span> ${transaction.fee}
                  </div>

                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        transaction.status === TransactionStatus.SUCCESSFUL
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === TransactionStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>

                  {transaction.clientWallet && (
                    <div>
                      <span className="font-medium">Client:</span>
                  <p>{`${transaction.clientWallet.client?.firstName ?? ''} ${transaction.clientWallet.client?.lastName ?? ''}`.trim() || 'N/A'}</p>
                      <p className="font-mono text-xs truncate">{transaction.clientWallet.address}</p>
                    </div>
                  )}

                  {transaction.clientWallet?.adminWallet && (
                    <div>
                      <span className="font-medium">Admin Wallet:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {transaction.clientWallet.adminWallet.logo && (
                          <Image
                            src={transaction.clientWallet.adminWallet.logo}
                            alt={transaction.clientWallet.adminWallet.currency}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                        <span>
                          {transaction.clientWallet.adminWallet.currency} (
                          {transaction.clientWallet.adminWallet.currencyAbbreviation})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                  
               {onEdit &&<div className="ml-4">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>
        }
              {onApprove && (
                <div className="ml-4">
                  <button
                    onClick={() => onApprove(transaction)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              )}
                
              {onReject && (
                <div className="ml-4">
                  <button
                    onClick={() => onReject(transaction)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
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
