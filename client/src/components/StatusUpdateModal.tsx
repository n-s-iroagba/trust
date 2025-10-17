'use client';

import { TransactionRequest, TransactionRequestStatus } from '../types/transactionRequest';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  request: TransactionRequest | null;
  newStatus: TransactionRequestStatus;
  loading?: boolean;
}

export default function StatusUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  request,
  newStatus,
  loading = false,
}: StatusUpdateModalProps) {
  if (!isOpen || !request) return null;

  const getStatusConfig = (status: TransactionRequestStatus) => {
    switch (status) {
      case 'successful':
        return {
          title: 'Approve Transaction Request',
          message: 'Are you sure you want to approve this transaction request? This will credit the client wallet.',
          icon: '✅',
          confirmText: 'Approve',
          confirmColor: 'bg-pastel-green hover:bg-green-600'
        };
      case 'failed':
        return {
          title: 'Reject Transaction Request',
          message: 'Are you sure you want to reject this transaction request? This action cannot be undone.',
          icon: '❌',
          confirmText: 'Reject',
          confirmColor: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {
          title: 'Update Status',
          message: 'Are you sure you want to update the status of this transaction request?',
          icon: '⚠️',
          confirmText: 'Update',
          confirmColor: 'bg-primary hover:bg-blue-700'
        };
    }
  };

  const config = getStatusConfig(newStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">{config.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-lg font-bold text-primary">${request.amountInUSD.toFixed(2)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Client:</span>
                <p className="font-semibold">{request.clientWallet?.clientId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Current Status:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'successful' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">New Status:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize ${
                  newStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  newStatus === 'successful' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {newStatus}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{config.message}</p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${config.confirmColor}`}
            >
              {loading ? 'Processing...' : config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}