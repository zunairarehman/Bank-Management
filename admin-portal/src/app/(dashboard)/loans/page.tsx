"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface LoanApplication {
  _id: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  emi: number;
  status: string;
  createdAt: string;
  userId?: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export default function LoansPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState({
    open: false,
    title: "",
    message: "",
    type: "success",
  });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const loadApplications = async () => {
    try {
      const res: any = await api("/admin/loan-applications");
      setApplications(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const approveLoan = async (id: string) => {
    try {
      await api(`/admin/loan-applications/${id}/approve`, {
        method: "PUT",
      });

      setPopup({
        open: true,
        title: "Success",
        message: "Loan approved successfully.",
        type: "success",
      });

      loadApplications();
    } catch (error: any) {
      setPopup({
        open: true,
        title: "Error",
        message: error.message,
        type: "error",
      });
    }
  };

  const rejectLoan = (id: string) => {
    setSelectedLoanId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };
  const confirmRejectLoan = async () => {
    try {
      await api(`/admin/loan-applications/${selectedLoanId}/reject`, {
        method: "PUT",
        body: JSON.stringify({
          reason: rejectReason || "Rejected by admin",
        }),
      });

      setPopup({
        open: true,
        title: "Rejected",
        message: "Loan application rejected successfully.",
        type: "success",
      });

      setShowRejectModal(false);
      loadApplications();
    } catch (error: any) {
      setPopup({
        open: true,
        title: "Error",
        message: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const pending = applications.filter((x) => x.status === "pending").length;

  const approved = applications.filter((x) => x.status === "approved").length;

  const rejected = applications.filter((x) => x.status === "rejected").length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Loan Management</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2>Pending Applications</h2>
          <p className="text-4xl font-bold mt-2">{pending}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2>Approved Loans</h2>
          <p className="text-4xl font-bold mt-2">{approved}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2>Rejected Loans</h2>
          <p className="text-4xl font-bold mt-2">{rejected}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2>Total Applications</h2>
          <p className="text-4xl font-bold mt-2">{applications.length}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Loan Applications</h2>

        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Applicant</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Purpose</th>
                <th className="text-left py-2">EMI</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b">
                  <td className="py-3">{app.userId?.fullName || "Unknown"}</td>

                  <td>PKR {app.amount.toLocaleString()}</td>

                  <td>{app.purpose}</td>

                  <td>PKR {app.emi.toLocaleString()}</td>

                  <td>{app.status.toUpperCase()}</td>

                  <td>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveLoan(app._id)}
                          className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectLoan(app._id)}
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[500px] rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Reject Loan Application
              </h2>

              <p className="mb-4 text-gray-500">
                Enter the reason for rejecting this application.
              </p>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="mb-4 h-32 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-red-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmRejectLoan}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Reject Loan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Popup */}
        {popup.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
            <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
              <h2
                className={`mb-3 text-xl font-bold ${
                  popup.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {popup.title}
              </h2>

              <p className="mb-5 text-gray-600">{popup.message}</p>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    setPopup({
                      open: false,
                      title: "",
                      message: "",
                      type: "success",
                    })
                  }
                  className="rounded-lg bg-bank-primary px-5 py-2 text-white"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
