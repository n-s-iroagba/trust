'use client';

import { useState, useEffect } from 'react';
import { useTransactionRequests } from '../../../hooks/useTransactionRequests';
import { TransactionRequest, TransactionRequestStatus } from '../../../types/transactionRequest';
import TransactionRequestList from '../../../components/TransactionRequestList';
import StatusUpdateModal from '../../../components/StatusUpdateModal';

export default function TransactionRequestsPage() {
  const { 
    getTransactionRequestsByStatus, 
    updateTransactionRequestStatus, 
    loading 
  } = useTransactionRequests();
  
  const [requests, setRequests] = useState<TransactionRequest[]>([]);
  const [filter, setFilter] = useState<TransactionRequestStatus>('pending');
  const [statusModal, setStatusModal] = useState<{ 
    isOpen: boolean; 
    request: TransactionRequest | null;
    newStatus: TransactionRequestStatus;
  }>({
    isOpen: false,
    request: null,
    newStatus: 'pending'
  });

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      const response = await getTransactionRequestsByStatus(filter);
      if (response.success && response.data) {
        const requestsData = Array.isArray(response.data) ? response.data : [response.data];
        setRequests(requestsData);
      }
    } catch (err) {
      console.error('Failed to load transaction requests:', err);
    }
  };

  const handleStatusUpdate = async (requestId: number, status: TransactionRequestStatus) => {
    try {
      await updateTransactionRequestStatus(requestId, { status });
      setStatusModal({ isOpen: false, request: null, newStatus: 'pending' });
      loadRequests();
    } catch (err) {
      // Error handled by hook
    }
  };

  const openStatusModal = (request: TransactionRequest, newStatus: TransactionRequestStatus) => {
    setStatusModal({
      isOpen: true,
      request,
      newStatus
    });
  };

  const closeStatusModal = () => {
    setStatusModal({
      isOpen: false,
      request: null,
      newStatus: 'pending'
    });
  };

  const getStatusCounts = async () => {
    const statuses: TransactionRequestStatus[] = ['pending', 'successful', 'failed'];
    const counts: { [key in TransactionRequestStatus]: number } = {
      pending: 0,
      successful: 0,
      failed: 0
    };

    // In a real app, you might want to fetch all counts at once
    // For now, we'll just show the current filter count
    return counts;
  };

  const getStatusColor = (status: TransactionRequestStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'successful': return 'bg-pastel-green bg-opacity-20 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: TransactionRequestStatus) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'successful':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Transaction Requests</h1>
              <p className="text-gray-600 mt-2">Review and manage client transaction requests</p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {(['pending', 'successful', 'failed'] as TransactionRequestStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center space-x-2 ${
                  filter === status
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {getStatusIcon(status)}
                <span className="capitalize">{status}</span>
                {filter === status && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {requests.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="text-yellow-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful Requests</p>
                <p className="text-2xl font-bold text-pastel-green mt-1">
                  {requests.filter(r => r.status === 'successful').length}
                </p>
              </div>
              <div className="text-pastel-green">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Requests</p>
                <p className="text-2xl font-bold text-red-500 mt-1">
                  {requests.filter(r => r.status === 'failed').length}
                </p>
              </div>
              <div className="text-red-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Requests List */}
        <div className="bg-white rounded-lg shadow-lg">
          <TransactionRequestList
            requests={requests}
            onApprove={(request) => openStatusModal(request, 'successful')}
            onReject={(request) => openStatusModal(request, 'failed')}
            loading={loading}
          />
        </div>

        {/* Status Update Modal */}
        <StatusUpdateModal
          isOpen={statusModal.isOpen}
          onClose={closeStatusModal}
          onConfirm={() => {
            if (statusModal.request) {
              handleStatusUpdate(statusModal.request.id, statusModal.newStatus);
            }
          }}
          request={statusModal.request}
          newStatus={statusModal.newStatus}
          loading={loading}
        />
      </div>
    </div>
  );
}