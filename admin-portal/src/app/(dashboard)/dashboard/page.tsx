'use client';

import { useEffect, useState } from 'react';
import { Users, Wallet, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import StatCard from '@/components/StatCard';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface DashboardData {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  pendingUsers: number;
  totalDeposits: number;
  fraudAlerts: number;
  dailyTransactions: { _id: string; count: number; volume: number }[];
  monthlyRevenue: { _id: string; revenue: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api<{ data: DashboardData }>('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500">Banking operations overview</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={data.totalUsers} icon={Users} trend="+12% this month" />
        <StatCard title="Active Accounts" value={data.totalAccounts} icon={Wallet} />
        <StatCard
          title="Total Transactions"
          value={data.totalTransactions}
          icon={ArrowLeftRight}
        />
        <StatCard
          title="Fraud Alerts"
          value={data.fraudAlerts}
          icon={AlertTriangle}
          className="border-amber-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold">Daily Transactions</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.dailyTransactions}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0369a1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthlyRevenue.length ? data.monthlyRevenue : [{ _id: 'N/A', revenue: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-bank-primary to-sky-800 p-6 text-white dark:border-slate-700">
        <p className="text-sky-200">Total Deposits in System</p>
        <p className="text-3xl font-bold">{formatCurrency(data.totalDeposits)}</p>
        <p className="mt-2 text-sm text-sky-200">{data.pendingUsers} users pending approval</p>
      </div>
    </div>
  );
}
