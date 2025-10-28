'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClientService } from '../../../services/clientService';
import { Client } from '../../../types/client';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

export default function ClientListPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; client: Client | null }>({
    isOpen: false,
    client: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ClientService.getAllClients();
      
      if (response.success && response.data) {
        setClients(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setError(response.message || 'Failed to load clients');
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('An unexpected error occurred while loading clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalWallets = (client: Client) => {
    return client.clientWallets?.length || 0;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRetry = () => {
    loadClients();
  };

  const handleDeleteClick = (client: Client) => {
    setDeleteModal({ isOpen: true, client });
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.client) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      const response = await ClientService.deleteClient(deleteModal.client.id);
      
      if (response.success) {
        setDeleteModal({ isOpen: false, client: null });
        // Remove the deleted client from the local state
        setClients(prevClients => prevClients.filter(client => client.id !== deleteModal.client?.id));
      } else {
        setDeleteError(response.message || 'Failed to delete client');
      }
    } catch (err) {
      console.error('Failed to delete client:', err);
      setDeleteError('An unexpected error occurred while deleting the client. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, client: null });
    setDeleteError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
              <p className="text-gray-600 mt-2">Manage and view client information and their wallets</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Load Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Clients Grid */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Clients Found</h3>
                <p className="text-gray-500">There are no clients in the system yet.</p>
              </div>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {/* Client Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white line-clamp-1">
                          {client.firstName} {client.lastName}
                        </h3>
                        <p className="text-blue-100 text-sm mt-1">ID: {client.id}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-full p-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Client Details */}
                  <div className="p-6">
                    {/* Basic Info */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Sign-in Code:</span>
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                          {client.signInCode}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Total Wallets:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getTotalWallets(client) > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getTotalWallets(client)} wallet{getTotalWallets(client) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>


                    {/* Dates */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 block">Created:</span>
                          <p className="text-gray-700 font-medium mt-1">{formatDate(client.createdAt)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Updated:</span>
                          <p className="text-gray-700 font-medium mt-1">{formatDate(client.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
                      >
                        View Wallets
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(client)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats Summary */}
        {clients.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
                <div className="text-sm text-gray-500 mt-1">Total Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {clients.reduce((total, client) => total + getTotalWallets(client), 0)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Total Wallets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {clients.filter(client => getTotalWallets(client) > 0).length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Clients with Wallets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {clients.filter(client => getTotalWallets(client) === 0).length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Clients without Wallets</div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Client"
          message={`Are you sure you want to delete ${deleteModal.client?.firstName} ${deleteModal.client?.lastName}? This action cannot be undone and will remove all associated data.`}
          loading={deleteLoading}
        />

        {/* Delete Error Modal */}
        {deleteError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Delete Error</h3>
              </div>
              <p className="text-gray-600 mb-4">{deleteError}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setDeleteError(null)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}