'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">System Settings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-semibold">Banking Limits</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">Daily Transfer Limit (PKR)</label>
            <input
              type="number"
              defaultValue={500000}
              className="w-full rounded-lg border px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-semibold">Notifications</h2>
          <label className="mt-4 flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Enable system alerts
          </label>
          <label className="mt-2 flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Fraud detection alerts
          </label>
        </div>
      </div>
    </div>
  );
}
