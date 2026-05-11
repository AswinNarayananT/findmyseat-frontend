import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaTicketAlt,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import { fetchAdminFinanceDashboard } from "../../store/admin/adminAuthThunks";

const StatusBadge = ({ status }) => {
  const cfg = {
    active: { cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: FaCheckCircle, label: "Active" },
    confirmed: { cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: FaCheckCircle, label: "Confirmed" },
    suspended: { cls: "bg-red-500/15 text-red-400 border-red-500/20", icon: FaTimesCircle, label: "Suspended" },
    cancelled: { cls: "bg-red-500/15 text-red-400 border-red-500/20", icon: FaTimesCircle, label: "Cancelled" },
    pending: { cls: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: FaClock, label: "Pending" },
  }[status] || { cls: "bg-[#1E1E1E] text-[#9ca6ba] border-[#282e39]", icon: FaClock, label: status };

  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
      <Icon className="text-[10px]" /> {cfg.label}
    </span>
  );
};

const RoleBadge = ({ role }) =>
  role === "admin" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
      <FaShieldAlt className="text-[9px]" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a2030] text-[#9ca6ba] border border-[#282e39]">
      {role}
    </span>
  );

function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const result = await dispatch(fetchAdminFinanceDashboard(filters)).unwrap();
        setDashboardData(result);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [dispatch, filters]);

  const STATS = [
    {
      label: "Platform Gross",
      value: `₹${dashboardData?.summary?.total_platform_gross?.toLocaleString() || 0}`,
      icon: FaChartLine,
      color: "from-indigo-500/20 to-indigo-600/5",
      border: "border-indigo-500/20",
      iconColor: "text-indigo-400",
    },
    {
      label: "Admin Commission",
      value: `₹${dashboardData?.summary?.total_admin_commission?.toLocaleString() || 0}`,
      icon: FaShieldAlt,
      color: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      label: "Tickets Sold",
      value: dashboardData?.summary?.total_tickets_sold || 0,
      icon: FaTicketAlt,
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Active Events",
      value: dashboardData?.summary?.active_events_count || 0,
      icon: FaUsers,
      color: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[#505a6b] text-sm font-medium">System Overview,</p>
          <h2 className="text-white text-3xl font-black tracking-tight">
            {user?.name || "Administrator"}
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-[#0C1017] p-2 rounded-xl border border-[#1a2030]">
          <div className="flex items-center gap-2 px-3">
            <FaCalendarAlt className="text-indigo-500 text-xs" />
            <select 
              value={filters.month} 
              onChange={(e) => setFilters({...filters, month: parseInt(e.target.value)})}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
            >
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={i+1} className="bg-slate-900">{new Date(0, i).toLocaleString('en', {month: 'long'})}</option>
              ))}
            </select>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <select 
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: parseInt(e.target.value)})}
            className="bg-transparent text-white text-xs font-bold px-3 outline-none cursor-pointer"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y} className="bg-slate-900">{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-6 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-black/20 ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-white text-2xl font-black tracking-tight">{stat.value}</p>
              <p className="text-[#9ca6ba] text-[10px] uppercase font-black tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0C1017] border border-[#1a2030] rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2030]">
            <h3 className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2">
              <FaTicketAlt className="text-indigo-500" /> Recent Show Revenue
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02]">
                  {["Event / Organizer", "Tickets", "Gross", "Platform Fee", "Status"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[#505a6b]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2030]/50">
                {dashboardData?.shows?.map((show) => (
                  <tr key={show.show_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-black truncate max-w-[200px]">{show.event_title}</p>
                      <p className="text-[#505a6b] text-[10px] font-bold uppercase">{show.organizer_name}</p>
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-medium">{show.tickets_sold}</td>
                    <td className="px-6 py-4 text-emerald-400 text-sm font-black">₹{show.gross_revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-indigo-400 text-sm font-black">₹{show.admin_commission.toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={show.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#1a2030] flex justify-center gap-2">
            {Array.from({length: dashboardData?.total_pages || 1}, (_, i) => (
              <button
                key={i+1}
                onClick={() => setFilters({...filters, page: i+1})}
                className={`size-8 rounded-lg text-xs font-black transition-all ${filters.page === i+1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
              >
                {i+1}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0C1017] border border-[#1a2030] rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-[#1a2030]">
            <h3 className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2">
              <FaChartLine className="text-purple-500" /> Monthly Growth
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {dashboardData?.monthly_breakdown?.map((m) => (
              <div key={m.month} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                  <span className="text-white">{m.month}</span>
                  <span className="text-indigo-400">₹{m.gross_revenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${Math.min((m.gross_revenue / (dashboardData.summary.total_platform_gross || 1)) * 100 * 5, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[9px] text-[#505a6b] font-bold uppercase tracking-widest">
                  {m.show_count} Shows • Platform: ₹{m.commission.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;