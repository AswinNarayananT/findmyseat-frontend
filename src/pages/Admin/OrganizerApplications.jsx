import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

import { fetchOrganizerApplications } from "../../store/admin/adminAuthThunks";

const StatusBadge = ({ status }) => {
  const cfg = {
    pending: { cls: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: FaClock, label: "Pending" },
    approved: { cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: FaCheckCircle, label: "Approved" },
    rejected: { cls: "bg-red-500/15 text-red-400 border-red-500/20", icon: FaTimesCircle, label: "Rejected" },
    permanently_rejected: { cls: "bg-red-900/30 text-red-600 border-red-900/50", icon: FaTimesCircle, label: "Banned" },
  }[status];

  const Icon = cfg?.icon || FaClock;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg?.cls || "bg-[#1E1E1E] text-[#9ca6ba] border-[#282e39]"}`}>
      <Icon /> {cfg?.label || status}
    </span>
  );
};

function OrganizerApplications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search: navbarSearch = "" } = useOutletContext() || {};

  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const { applications, listLoading } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    const params = {
      status_filter: statusFilter === "All" ? null : statusFilter.toLowerCase(),
      search: navbarSearch || null,
      skip: currentPage * itemsPerPage,
      limit: itemsPerPage,
    };
    dispatch(fetchOrganizerApplications(params));
  }, [dispatch, statusFilter, navbarSearch, currentPage]);

  const handlePageChange = (direction) => {
    if (direction === "next") setCurrentPage((prev) => prev + 1);
    if (direction === "prev" && currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl font-black tracking-tight">Organizer Applications</h2>
          <p className="text-[#505a6b] text-sm mt-1">Review and manage organization verification requests</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0C1017] border border-[#1a2030] p-1 rounded-lg">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(0); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === s ? "bg-[#1a2030] text-white shadow-lg" : "text-[#505a6b] hover:text-[#9ca6ba]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0C1017] border border-[#1a2030] rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#11161f] border-b border-[#1a2030]">
              <th className="px-6 py-4 text-[10px] font-black uppercase text-[#505a6b] tracking-widest">Organization</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-[#505a6b] tracking-widest">Contact Person</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-[#505a6b] tracking-widest">Attempts</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-[#505a6b] tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-[#505a6b] tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2030]/50">
            {listLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-6 bg-white/[0.01]"></td>
                </tr>
              ))
            ) : applications?.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{app.organization_name}</div>
                    <div className="text-[10px] text-[#505a6b] mt-0.5 font-mono uppercase">{app.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#9ca6ba]">{app.contact_name}</div>
                    <div className="text-xs text-[#505a6b]">{app.contact_email}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-[#505a6b]">{app.rejection_count + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/organizer-applications/${app.id}`)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a2030] border border-[#283039] text-[#9ca6ba] hover:text-white hover:border-blue-500/50 transition-all text-xs font-bold"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-[#505a6b] text-sm italic">
                  No applications found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="bg-[#11161f] px-6 py-4 border-t border-[#1a2030] flex items-center justify-between">
          <div className="text-xs text-[#505a6b]">
            Showing <span className="text-white font-bold">{applications?.length || 0}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 0 || listLoading}
              className="p-2 rounded-lg bg-[#1a2030] border border-[#283039] text-[#9ca6ba] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => handlePageChange("next")}
              disabled={applications?.length < itemsPerPage || listLoading}
              className="p-2 rounded-lg bg-[#1a2030] border border-[#283039] text-[#9ca6ba] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerApplications;