'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Account {
  _id: string;
  accountNumber: string;
  balance: number;
  accountType: string;
  status: string;
  userId?: { fullName: string; email: string };
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    api<{ data: Account[] }>('/admin/accounts')
      .then((res) => setAccounts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Account Management</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a) => (
          <div
            key={a._id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="font-mono text-sm text-slate-500">{a.accountNumber}</p>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(a.balance)}</p>
            <p className="mt-1 text-sm capitalize text-slate-600">{a.accountType} · {a.status}</p>
            {a.userId && (
              <p className="mt-3 border-t pt-3 text-sm dark:border-slate-700">
                {a.userId.fullName} — {a.userId.email}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
