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
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setError(null);
        const response = await getTransactionRequestsByStatus(filter);
        if (response.success && response.data) {
          const requestsData = Array.isArray(response.data) ? response.data : [response.data];
          setRequests(requestsData);
        } else {
          setError(response.message || `Failed to load ${filter} transaction requests`);
        }
      } catch (err) {
        console.error('Failed to load transaction requests:', err);
        setError('An unexpected error occurred while loading transaction requests. Please try again.');
      }
    };
    
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setError(null);
      const response = await getTransactionRequestsByStatus(filter);
      if (response.success && response.data) {
        const requestsData = Array.isArray(response.data) ? response.data : [response.data];
        setRequests(requestsData);
      } else {
        setError(response.message || `Failed to load ${filter} transaction requests`);
      }
    } catch (err) {
      console.error('Failed to load transaction requests:', err);
      setError('An unexpected error occurred while loading transaction requests. Please try again.');
    }
  };

  const handleStatusUpdate = async (requestId: number, status: TransactionRequestStatus) => {
    try {
      setUpdateError(null);
      const response = await updateTransactionRequestStatus(requestId, { status });
      
      if (response.success) {
        setStatusModal({ isOpen: false, request: null, newStatus: 'pending' });
        loadRequests();
      } else {
        setUpdateError(response.message || `Failed to update transaction request status to ${status}`);
      }
    } catch (err) {
      console.error('Failed to update transaction request:', err);
      setUpdateError('An unexpected error occurred while updating the transaction request. Please try again.');
    }
  };

  const openStatusModal = (request: TransactionRequest, newStatus: TransactionRequestStatus) => {
    setUpdateError(null);
    setStatusModal({
      isOpen: true,
      request,
      newStatus
    });
  };

  const closeStatusModal = () => {
    setUpdateError(null);
    setStatusModal({
      isOpen: false,
      request: null,
      newStatus: 'pending'
    });
  };

  const clearError = () => {
    setError(null);
    setUpdateError(null);
  };

  const retryLoadRequests = () => {
    loadRequests();
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
        {/* Error Messages */}
        {(error || updateError) && (
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
                    {error ? 'Load Error' : 'Update Error'}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error || updateError}
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
            {error && (
              <div className="mt-3">
                <button
                  onClick={retryLoadRequests}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            )}
          </div>
        )}

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