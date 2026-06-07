'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface AuditLog {
  _id: string;
  action: string;
  actorType: string;
  severity: string;
  createdAt: string;
}

export default function SecurityPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api<{ data: AuditLog[] }>('/admin/audit-logs')
      .then((res) => setLogs(res.data))
      .catch(() => setLogs([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Security & Audit Logs</h1>
      <div className="rounded-2xl border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Role Management</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Super Admin, Admin, Manager, Support roles with permission-based access control.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Action</th>
              <th className="px-6 py-4 text-left">Actor</th>
              <th className="px-6 py-4 text-left">Severity</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No audit logs yet. Actions will appear here as admins use the system.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l._id} className="border-t dark:border-slate-700">
                  <td className="px-6 py-4">{l.action}</td>
                  <td className="px-6 py-4">{l.actorType}</td>
                  <td className="px-6 py-4">{l.severity}</td>
                  <td className="px-6 py-4">{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
