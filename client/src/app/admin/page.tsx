'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminWallets } from '../../hooks/useAdminWallets';
import { useClientWallets } from '../../hooks/useClientWallets';
import { useTransactionRequests } from '../../hooks/useTransactionRequests';
import { AdminWallet } from '../../types/adminWallet';
import { ClientWallet } from '../../types/clientWallet';
import { Transaction } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';


export default function AdminDashboard() {
  const { getAllAdminWallets } = useAdminWallets();
  const { getAllClientWallets } = useClientWallets();
  const {getPendingTransactions} = useTransactions()

  const [adminWallets, setAdminWallets] = useState<AdminWallet[]>([]);
  const [clientWallets, setClientWallets] = useState<ClientWallet[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [adminWalletsRes, clientWalletsRes, pendingRequestsRes] = await Promise.all([
          getAllAdminWallets(),
          getAllClientWallets(),
          getPendingTransactions()
        ]);

        // Handle admin wallets response
        if (adminWalletsRes.success && adminWalletsRes.data) {
          setAdminWallets(Array.isArray(adminWalletsRes.data) ? adminWalletsRes.data : [adminWalletsRes.data]);
        } else {
          throw new Error(adminWalletsRes.message || 'Failed to load admin wallets');
        }

        // Handle client wallets response
        if (clientWalletsRes.success && clientWalletsRes.data) {
          setClientWallets(Array.isArray(clientWalletsRes.data) ? clientWalletsRes.data : [clientWalletsRes.data]);
        } else {
          throw new Error(clientWalletsRes.message || 'Failed to load client wallets');
        }

        // Handle pending requests response
        if (pendingRequestsRes.success && pendingRequestsRes.data) {
          setPendingRequests(Array.isArray(pendingRequestsRes.data) ? pendingRequestsRes.data : [pendingRequestsRes.data]);
        } else {
          throw new Error(pendingRequestsRes.message || 'Failed to load pending requests');
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const retryLoadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [adminWalletsRes, clientWalletsRes, pendingRequestsRes] = await Promise.all([
        getAllAdminWallets(),
        getAllClientWallets(),
        getPendingTransactions
      ]);

      if (adminWalletsRes.success && adminWalletsRes.data) {
        setAdminWallets(Array.isArray(adminWalletsRes.data) ? adminWalletsRes.data : [adminWalletsRes.data]);
      }

      if (clientWalletsRes.success && clientWalletsRes.data) {
        setClientWallets(Array.isArray(clientWalletsRes.data) ? clientWalletsRes.data : [clientWalletsRes.data]);
      }

    
    } catch (error) {
      console.error('Failed to retry loading dashboard data:', error);
      setError('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalClientBalance = clientWallets.reduce((sum, wallet) => sum + wallet.amountInUSD, 0);
  const totalPendingAmount = pendingRequests.reduce((sum, request) => sum + request.amountInUSD, 0);

  const StatCard = ({ title, value, change, icon, color, href }: any) => (
    <Link href={href} className="block">
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
                <span className="text-xl">{icon}</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">{value}</div>
                </dd>
                {change && (
                  <dd className="text-sm text-gray-500">{change}</dd>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  // Error state display
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-red-800">Unable to Load Dashboard</h3>
                <p className="text-red-700 mt-2">{error}</p>
                <div className="mt-4">
                  <button
                    onClick={retryLoadData}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fallback minimal dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, Admin! Some data may not be available.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Admin Wallets"
              value="N/A"
              change="Data unavailable"
              icon="👛"
              color="bg-gray-100 text-gray-600"
              href="/admin-wallets"
            />
            <StatCard
              title="Client Wallets"
              value="N/A"
              change="Data unavailable"
              icon="👥"
              color="bg-gray-100 text-gray-600"
              href="/client-wallets"
            />
            <StatCard
              title="Pending Requests"
              value="N/A"
              change="Data unavailable"
              icon="📋"
              color="bg-gray-100 text-gray-600"
              href="/transaction-requests"
            />
            <StatCard
              title="Transactions"
              value="N/A"
              change="Data unavailable"
              icon="💸"
              color="bg-gray-100 text-gray-600"
              href="/transactions"
            />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, Admin! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Admin Wallets"
            value={adminWallets.length}
            change={`${adminWallets.length} currencies`}
            icon="👛"
            color="bg-blue-100 text-blue-600"
            href="/admin-wallets"
          />
          <StatCard
            title="Client Wallets"
            value={clientWallets.length}
            change={`$${totalClientBalance.toFixed(2)} total`}
            icon="👥"
            color="bg-green-100 text-green-600"
            href="/client-wallets"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            change={`$${totalPendingAmount.toFixed(2)} pending`}
            icon="📋"
            color="bg-yellow-100 text-yellow-600"
            href="/transaction-requests"
          />
          <StatCard
            title="Total Transactions"
            value="0"
            change="View all transactions"
            icon="💸"
            color="bg-purple-100 text-purple-600"
            href="/transactions"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin-wallets"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-primary"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-lg">👛</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Manage Admin Wallets</h3>
                  <p className="text-sm text-gray-500">Create and manage currency wallets</p>
                </div>
              </div>
            </Link>

            <Link
              href="/client-wallets"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-pastel-green"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Client Wallets</h3>
                  <p className="text-sm text-gray-500">Manage client accounts and balances</p>
                </div>
              </div>
            </Link>

            <Link
              href="/transaction-requests"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-yellow-500"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">📋</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Transaction Requests</h3>
                  <p className="text-sm text-gray-500">Review pending requests</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Pending Requests</h2>
          </div>
          <div className="p-6">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                <p className="text-gray-500">All transaction requests have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          ${request.amountInUSD.toFixed(2)} Request
                        </p>
                        <p className="text-sm text-gray-500">
                          Client: {request.clientWallet?.clientId}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/transaction-requests"
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Review
                    </Link>
                  </div>
                ))}
                {pendingRequests.length > 5 && (
                  <div className="text-center pt-4">
                    <Link
                      href="/transaction-requests"
                      className="text-primary hover:text-blue-700 font-medium"
                    >
                      View all {pendingRequests.length} requests
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}