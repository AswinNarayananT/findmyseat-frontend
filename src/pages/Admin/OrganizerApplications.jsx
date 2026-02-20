import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaEye, FaCheck, FaTimes, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const APPLICATIONS = [
  {
    id: "APP-0012",
    orgName: "Alex Movies",
    contactName: "Anuraj",
    email: "anuraj@gmail.com",
    phone: "9856985698",
    status: "pending",
    submittedDate: "Feb 20, 2024",
    bankName: "State Bank of India",
    accountNumber: "****7890",
  },
  {
    id: "APP-0011",
    orgName: "EventHub Productions",
    contactName: "Sarah Mitchell",
    email: "sarah@eventhub.com",
    phone: "9123456789",
    status: "approved",
    submittedDate: "Feb 18, 2024",
    bankName: "HDFC Bank",
    accountNumber: "****4521",
  },
  {
    id: "APP-0010",
    orgName: "Star Entertainment",
    contactName: "Raj Kumar",
    email: "raj@starent.com",
    phone: "9876543210",
    status: "rejected",
    submittedDate: "Feb 15, 2024",
    bankName: "ICICI Bank",
    accountNumber: "****8963",
  },
  {
    id: "APP-0009",
    orgName: "Metro Events",
    contactName: "Priya Sharma",
    email: "priya@metroevents.com",
    phone: "9988776655",
    status: "pending",
    submittedDate: "Feb 19, 2024",
    bankName: "Axis Bank",
    accountNumber: "****3214",
  },
];

// ─── Helper Component ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    pending: { cls: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: FaClock, label: "Pending" },
    approved: { cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: FaCheckCircle, label: "Approved" },
    rejected: { cls: "bg-red-500/15 text-red-400 border-red-500/20", icon: FaTimesCircle, label: "Rejected" },
  }[status] || { cls: "bg-[#1E1E1E] text-[#9ca6ba] border-[#282e39]", icon: FaClock, label: status };

  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
      <Icon className="text-[10px]" /> {cfg.label}
    </span>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
function OrganizerApplications() {
  const { search } = useOutletContext();
  const [filter, setFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApplications = APPLICATIONS.filter((app) => {
    const matchesSearch =
      app.orgName.toLowerCase().includes(search.toLowerCase()) ||
      app.contactName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || app.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id) => {
    console.log("Approving application:", id);
    // Add your approve logic here
  };

  const handleReject = (id) => {
    console.log("Rejecting application:", id);
    // Add your reject logic here
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl font-black tracking-tight">
            Organizer Applications
          </h2>
          <p className="text-[#505a6b] text-sm mt-1">
            {filteredApplications.length} applications found
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-[#1a2030] text-[#9ca6ba] hover:text-white border border-[#283039]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[#0C1017] border border-[#1a2030] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2030]">
                {[
                  "ID",
                  "Organization",
                  "Contact Person",
                  "Email",
                  "Phone",
                  "Bank",
                  "Submitted",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#505a6b]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-[#1a2030]/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-[#505a6b] text-xs font-mono">
                    {app.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm font-semibold">
                      {app.orgName}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-white text-sm">
                    {app.contactName}
                  </td>
                  <td className="px-6 py-4 text-[#9ca6ba] text-sm">
                    {app.email}
                  </td>
                  <td className="px-6 py-4 text-[#9ca6ba] text-sm">
                    {app.phone}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">{app.bankName}</p>
                    <p className="text-[#505a6b] text-xs">{app.accountNumber}</p>
                  </td>
                  <td className="px-6 py-4 text-[#9ca6ba] text-sm">
                    {app.submittedDate}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* View Details */}
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-1.5 rounded bg-[#1a2030] border border-[#283039] text-[#9ca6ba] hover:text-white hover:border-primary/50 transition-all"
                        title="View Details"
                      >
                        <FaEye className="text-xs" />
                      </button>

                      {/* Approve (only for pending) */}
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                            title="Approve"
                          >
                            <FaCheck className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                            title="Reject"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#0C1017] border border-[#1a2030] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-black uppercase tracking-tight">
                Application Details
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-[#9ca6ba] hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-6">
              {/* Organization Details */}
              <div>
                <h4 className="text-primary text-xs font-black uppercase tracking-widest mb-3">
                  Organization Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Organization Name</p>
                    <p className="text-white font-semibold">{selectedApp.orgName}</p>
                  </div>
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Application ID</p>
                    <p className="text-white font-mono">{selectedApp.id}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h4 className="text-primary text-xs font-black uppercase tracking-widest mb-3">
                  Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Contact Name</p>
                    <p className="text-white font-semibold">{selectedApp.contactName}</p>
                  </div>
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Email</p>
                    <p className="text-white">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Phone</p>
                    <p className="text-white">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Status</p>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h4 className="text-primary text-xs font-black uppercase tracking-widest mb-3">
                  Bank Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Bank Name</p>
                    <p className="text-white font-semibold">{selectedApp.bankName}</p>
                  </div>
                  <div>
                    <p className="text-[#505a6b] text-xs mb-1">Account Number</p>
                    <p className="text-white font-mono">{selectedApp.accountNumber}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedApp.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-[#1a2030]">
                  <button
                    onClick={() => {
                      handleApprove(selectedApp.id);
                      setSelectedApp(null);
                    }}
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Approve Application
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedApp.id);
                      setSelectedApp(null);
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerApplications;