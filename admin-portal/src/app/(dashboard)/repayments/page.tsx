"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RepaymentsPage() {
  const [repayments, setRepayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRepayments = async () => {
    try {
      const res: any = await api("/admin/loan-repayments");
      setRepayments(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepayments();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Repayment Tracking</h1>

      <div className="rounded-xl bg-white p-6 shadow">
        {loading ? (
          <p>Loading...</p>
        ) : repayments.length === 0 ? (
          <p>No repayments found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Customer</th>
                <th className="py-3 text-left">Installment</th>
                <th className="py-3 text-left">Amount</th>
                <th className="py-3 text-left">Due Date</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {repayments.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="py-3">{item.userId?.fullName || "Unknown"}</td>

                  <td>#{item.installmentNo}</td>

                  <td>PKR {item.amount?.toLocaleString()}</td>

                  <td>{new Date(item.dueDate).toLocaleDateString()}</td>

                  <td>{item.status?.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
