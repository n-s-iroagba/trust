'use client';

import { TransactionRequest } from '../types/transactionRequest';
import Image from 'next/image';
interface TransactionRequestListProps {
  requests: TransactionRequest[];
  onApprove: (request: TransactionRequest) => void;
  onReject: (request: TransactionRequest) => void;
  loading?: boolean;
}

export default function TransactionRequestList({ 
  requests, 
  onApprove, 
  onReject, 
  loading 
}: TransactionRequestListProps) {
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

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Transaction Requests</h3>
        <p className="text-gray-500">No transaction requests found for the selected status.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'successful': return 'bg-pastel-green bg-opacity-20 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'successful':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">Transaction Requests</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'}
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {requests.map((request) => (
          <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-primary">
                      ${request.amountInUSD.toFixed(2)}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {request.clientWallet && (
                    <div>
                      <span className="font-medium text-gray-700">Client Information:</span>
                      <div className="mt-1">
                        <p className="font-semibold">ID: {request.clientWallet.clientId}</p>
                        <p className="font-mono text-xs text-gray-500 break-all mt-1">
                          {request.clientWallet.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.clientWallet?.adminWallet && (
                    <div>
                      <span className="font-medium text-gray-700">Admin Wallet:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {request.clientWallet.adminWallet.logo && (
                          <Image fill
                     
                            src={request.clientWallet.adminWallet.logo}
                            alt={request.clientWallet.adminWallet.currency}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span className="text-sm">
                          {request.clientWallet.adminWallet.currency} ({request.clientWallet.adminWallet.currencyAbbreviation})
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono truncate mt-1">
                        {request.clientWallet.adminWallet.address}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Request ID: {request.id}</span>
                    <span>
                      Updated: {new Date(request.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => onApprove(request)}
                    className="bg-pastel-green text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-pastel-green focus:ring-offset-2 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onReject(request)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Reject</span>
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