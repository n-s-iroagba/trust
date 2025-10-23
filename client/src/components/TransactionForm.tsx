'use client';

import { useState, FormEvent } from 'react';
import { TransactionType, TransactionStatus, Transaction } from '../types/transaction';

interface TransactionFormProps {
  clientWalletId: number;
  initialData?: Partial<Transaction>;
  mode?: 'create' | 'edit';
  onSubmit: (data: Transaction) => void;
}

export default function TransactionForm({
  clientWalletId,
  initialData,
  mode = 'create',
  onSubmit,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    id:initialData?.id,
    amountInUSD: initialData?.amountInUSD ?? 0,
    clientWalletId,
    reciepientAddress: initialData?.reciepientAddress ?? '',
    type: initialData?.type ?? TransactionType.DEBIT,
    amount: initialData?.amount ?? '',
    status: initialData?.status ?? TransactionStatus.PENDING,
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    fee: initialData?.fee ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amountInUSD' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Transaction);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-5 max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {mode === 'edit' ? 'Edit Transaction' : 'Create Transaction'}
      </h2>

      {/* Amount in USD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (USD)
        </label>
        <input
          type="number"
          name="amountInUSD"
          value={formData.amountInUSD}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Recipient Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Address
        </label>
        <input
          type="text"
          name="reciepientAddress"
          value={formData.reciepientAddress}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(TransactionType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(TransactionStatus).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="text"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fee
        </label>
        <input
          type="text"
          name="fee"
          value={formData.fee}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {mode === 'edit' ? 'Update Transaction' : 'Create Transaction'}
      </button>
    </form>
  );
}
