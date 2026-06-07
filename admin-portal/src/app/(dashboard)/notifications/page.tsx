"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    try {
      const res: any = await api("/admin/notifications");
      setNotifications(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>

      <div className="rounded-xl bg-white p-6 shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">User</th>
              <th className="py-2 text-left">Title</th>
              <th className="py-2 text-left">Type</th>
              <th className="py-2 text-left">Message</th>
              <th className="py-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {notifications.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="py-3">{item.userId?.fullName || "Unknown"}</td>

                <td>{item.title}</td>

                <td>{item.type}</td>

                <td>{item.message}</td>

                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
