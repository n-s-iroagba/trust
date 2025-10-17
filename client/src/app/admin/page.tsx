'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminWallets } from '../../hooks/useAdminWallets';
import { useClientWallets } from '../../hooks/useClientWallets';
import { useTransactionRequests } from '../../hooks/useTransactionRequests';
import { useTransactions } from '../../hooks/useTransactions';
import { AdminWallet } from '../../types/adminWallet';
import { ClientWallet } from '../../types/clientWallet';
import { TransactionRequest } from '../../types/transactionRequest';
import { Transaction } from '../../types/transaction';

interface DashboardStats {
  totalAdminWallets: number;
  totalClientWallets: number;
  totalPendingRequests: number;
  totalTransactions: number;
  totalClientBalance: number;
  totalPendingAmount: number;
  recentTransactions: Transaction[];
  recentRequests: TransactionRequest[];
}

export default function AdminDashboard() {
  const { getAllAdminWallets } = useAdminWallets();
  const { getAllClientWallets } = useClientWallets();
  const { getTransactionRequestsByStatus } = useTransactionRequests();
  const { getAllTransactions } = useTransactions();

  const [stats, setStats] = useState<DashboardStats>({
    totalAdminWallets: 0,
    totalClientWallets: 0,
    totalPendingRequests: 0,
    totalTransactions: 0,
    totalClientBalance: 0,
    totalPendingAmount: 0,
    recentTransactions: [],
    recentRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        adminWalletsRes,
        clientWalletsRes,
        pendingRequestsRes,
        transactionsRes
      ] = await Promise.all([
        getAllAdminWallets(),
        getAllClientWallets(),
        getTransactionRequestsByStatus('pending'),
        getAllTransactions()
      ]);

      const adminWallets: AdminWallet[] = adminWalletsRes.success && adminWalletsRes.data 
        ? (Array.isArray(adminWalletsRes.data) ? adminWalletsRes.data : [adminWalletsRes.data])
        : [];

      const clientWallets: ClientWallet[] = clientWalletsRes.success && clientWalletsRes.data 
        ? (Array.isArray(clientWalletsRes.data) ? clientWalletsRes.data : [clientWalletsRes.data])
        : [];

      const pendingRequests: TransactionRequest[] = pendingRequestsRes.success && pendingRequestsRes.data 
        ? (Array.isArray(pendingRequestsRes.data) ? pendingRequestsRes.data : [pendingRequestsRes.data])
        : [];

      const transactions: Transaction[] = transactionsRes.success && transactionsRes.data 
        ? (Array.isArray(transactionsRes.data) ? transactionsRes.data : [transactionsRes.data])
        : [];

      const totalClientBalance = clientWallets.reduce((sum, wallet) => sum + wallet.amountInUSD, 0);
      const totalPendingAmount = pendingRequests.reduce((sum, request) => sum + request.amountInUSD, 0);

      // Get recent transactions (last 5)
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // Get recent pending requests (last 5)
      const recentRequests = pendingRequests
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalAdminWallets: adminWallets.length,
        totalClientWallets: clientWallets.length,
        totalPendingRequests: pendingRequests.length,
        totalTransactions: transactions.length,
        totalClientBalance,
        totalPendingAmount,
        recentTransactions,
        recentRequests
      });

    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon, color, href }: any) => (
    <Link href={href} className="block group">
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-200 group-hover:border-primary">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                <span className="text-xl">{icon}</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                </dd>
                {change && (
                  <dd className="text-sm text-gray-500 mt-1">{change}</dd>
                )}
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-primary font-medium group-hover:text-blue-700 transition-colors">
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${
          transaction.amountInUSD >= 0 
            ? 'bg-pastel-green bg-opacity-20 text-pastel-green' 
            : 'bg-red-500 bg-opacity-20 text-red-500'
        }`}>
          {transaction.amountInUSD >= 0 ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {transaction.amountInUSD >= 0 ? '+' : ''}${transaction.amountInUSD.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {transaction.clientWallet?.clientId || 'Unknown Client'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(transaction.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );

  const RequestItem = ({ request }: { request: TransactionRequest }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            ${request.amountInUSD.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {request.clientWallet?.clientId || 'Unknown Client'}
          </p>
        </div>
      </div>
      <Link
        href="/transaction-requests"
        className="bg-primary text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
      >
        Review
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="ml-5 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error loading dashboard</h3>
                <p className="text-red-700 mt-2">{error}</p>
                <button
                  onClick={loadDashboardData}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your TrustXWallet system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Admin Wallets"
            value={stats.totalAdminWallets}
            change={`${stats.totalAdminWallets} currencies`}
            icon="👛"
            color="bg-blue-100 text-blue-600"
            href="/admin-wallets"
          />
          <StatCard
            title="Client Wallets"
            value={stats.totalClientWallets}
            change={`$${stats.totalClientBalance.toFixed(2)} total balance`}
            icon="👥"
            color="bg-green-100 text-green-600"
            href="/client-wallets"
          />
          <StatCard
            title="Pending Requests"
            value={stats.totalPendingRequests}
            change={`$${stats.totalPendingAmount.toFixed(2)} pending`}
            icon="📋"
            color="bg-yellow-100 text-yellow-600"
            href="/transaction-requests"
          />
          <StatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            change="View transaction history"
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
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-primary group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-xl">👛</span>
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
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-pastel-green group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 text-xl">👥</span>
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
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-yellow-500 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <span className="text-yellow-600 text-xl">📋</span>
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

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <Link 
                  href="/transactions" 
                  className="text-primary hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
                  <p className="text-gray-500">Transaction history will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Pending Requests */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
                <Link 
                  href="/transaction-requests" 
                  className="text-primary hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                  <p className="text-gray-500">All requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentRequests.map((request) => (
                    <RequestItem key={request.id} request={request} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}