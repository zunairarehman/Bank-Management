'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  status: string;
  reference: string;
  isFraudFlag: boolean;
  createdAt: string;
  fromUserId?: { fullName: string };
  toUserId?: { fullName: string };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const q = filter ? `?status=${filter}` : '';
    api<{ data: { transactions: Transaction[] } }>(`/admin/transactions${q}`)
      .then((res) => setTransactions(res.data.transactions))
      .catch(console.error);
  }, [filter]);

  const flagFraud = async (id: string) => {
    await api(`/admin/transactions/${id}/flag`, { method: 'PATCH' });
    setTransactions((t) =>
      t.map((x) => (x._id === id ? { ...x, isFraudFlag: true, status: 'pending' } : x))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Transaction Management</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-lg border px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
      >
        <option value="">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
      <div className="overflow-hidden rounded-2xl border bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Fraud</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-t dark:border-slate-700">
                <td className="px-6 py-4 font-mono text-xs">{t.reference}</td>
                <td className="px-6 py-4">{formatCurrency(t.amount)}</td>
                <td className="px-6 py-4 capitalize">{t.type}</td>
                <td className="px-6 py-4">{t.status}</td>
                <td className="px-6 py-4">
                  {t.isFraudFlag ? (
                    <span className="text-red-600">Flagged</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-6 py-4">
                  {!t.isFraudFlag && (
                    <button
                      onClick={() => flagFraud(t._id)}
                      className="text-red-600 hover:underline"
                    >
                      Flag Fraud
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
