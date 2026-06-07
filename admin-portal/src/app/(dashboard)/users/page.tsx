'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const load = () => {
    api<{ data: { users: User[] } }>(`/admin/users?search=${search}`)
      .then((res) => setUsers(res.data.users))
      .catch(console.error);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">User Management</h1>
      <div className="flex gap-4">
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
        />
        <button onClick={load} className="rounded-lg bg-bank-primary px-4 py-2 text-white">
          Search
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t dark:border-slate-700">
                <td className="px-6 py-4 font-medium">{u.fullName}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      u.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : u.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {u.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(u._id, 'active')}
                      className="text-emerald-600 hover:underline"
                    >
                      Approve
                    </button>
                  )}
                  {u.status === 'active' && (
                    <button
                      onClick={() => updateStatus(u._id, 'suspended')}
                      className="text-amber-600 hover:underline"
                    >
                      Suspend
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
