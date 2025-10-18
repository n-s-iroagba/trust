'use client'
import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

interface Transaction {
  id: number;
  to: string;
  amount: string;
  token: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  fee: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | undefined;
  onClose: () => void;
}

// Component 1: Transaction Request List (View Only)
function TransactionRequestList() {
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      to: '0xA80D3DA23AD0Ddd8B872C8D5E456C2C28940',
      amount: '0.5',
      token: 'BTC',
      description: 'Payment for services',
      status: 'pending',
      date: '2024-01-15',
      fee: '0.001'
    },
    {
      id: 2,
      to: '0x742d35Cc6634C0532925a3b844Bc5e8475f89Fe1',
      amount: '2.5',
      token: 'ETH',
      description: 'Investment',
      status: 'approved',
      date: '2024-01-14',
      fee: '0.05'
    },
    {
      id: 3,
      to: 'GnxXwUZU5PELcYsmKfgSrXnwUZjFa8ArEga8',
      amount: '100',
      token: 'SOL',
      description: 'NFT Purchase',
      status: 'rejected',
      date: '2024-01-13',
      fee: '0.00025'
    }
  ]);

  const [selectedView, setSelectedView] = useState<number | null>(null);

  const getStatusColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedTransaction = transactions.find(t => t.id === selectedView);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <button onClick={() => window.history.back()}>
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Transaction Requests</h1>
      </div>

      {/* List */}
      <div className="space-y-3 p-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
            {/* View Mode Only */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{tx.amount} {tx.token}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(tx.status)}`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tx.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  To: {tx.to.slice(0, 10)}...{tx.to.slice(-8)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedView(tx.id)}
              className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              <Eye size={16} /> View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal - Transaction Details */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedView(null)}
        />
      )}
    </div>
  );
}

// Component 2: Transaction Details Modal (Trust Wallet Theme)
function TransactionDetailsModal({ transaction, onClose }: TransactionDetailsModalProps) {
  const [showAddress, setShowAddress] = useState(false);

  // Early return if transaction is undefined
  if (!transaction) {
    return null;
  }

  const truncateAddress = (addr: string, show: boolean = false): string => {
    if (show) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="w-full max-w-md bg-gradient-to-b from-blue-600 to-blue-900 rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Handle Bar */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-10 h-1 bg-white bg-opacity-30 rounded-full" />
        </div>

        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 text-white space-y-6">
          {/* Amount Display */}
          <div className="text-center py-6">
            <p className="text-sm text-blue-200 mb-2">You Send</p>
            <p className="text-5xl font-bold">{transaction.amount}</p>
            <p className="text-2xl text-blue-200 mt-2">{transaction.token}</p>
          </div>

          {/* Details Section */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 space-y-4 backdrop-blur">
            {/* To Address */}
            <div>
              <p className="text-sm text-blue-200 mb-2">To</p>
              <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
                <p className="font-mono text-sm break-all pr-2">
                  {truncateAddress(transaction.to, showAddress)}
                </p>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="flex-shrink-0 ml-2"
                >
                  {showAddress ? (
                    <EyeOff size={18} className="text-blue-200" />
                  ) : (
                    <Eye size={18} className="text-blue-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-blue-200 mb-2">Description</p>
              <p className="bg-white bg-opacity-10 rounded-lg p-3 text-sm">
                {transaction.description}
              </p>
            </div>

            {/* Fee */}
            <div>
              <p className="text-sm text-blue-200 mb-2">Network Fee</p>
              <p className="text-lg font-semibold">{transaction.fee} {transaction.token}</p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-blue-200 mb-2">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  transaction.status === 'approved' ? 'bg-green-400' :
                  transaction.status === 'pending' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
                <p className="font-semibold capitalize">{transaction.status}</p>
              </div>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-blue-200 mb-2">Date</p>
              <p className="font-semibold">{transaction.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Export
export default function TransactionApp() {
  return <TransactionRequestList />;
}