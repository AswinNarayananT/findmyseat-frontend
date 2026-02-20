import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaTicketAlt,
  FaChartLine,
  FaBus,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const STATS = [
  {
    label: "Total Users",
    value: "12,482",
    change: "+8.2%",
    up: true,
    icon: FaUsers,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    label: "Active Bookings",
    value: "3,291",
    change: "+12.5%",
    up: true,
    icon: FaTicketAlt,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    label: "Total Revenue",
    value: "$84,320",
    change: "+5.1%",
    up: true,
    icon: FaChartLine,
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
    iconColor: "text-primary",
  },
  {
    label: "Active Routes",
    value: "148",
    change: "-2.3%",
    up: false,
    icon: FaBus,
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
];

const USERS = [
  { id: "U-0012", name: "Sarah Johnson", email: "sarah.j@email.com", role: "user", status: "active", bookings: 14, joined: "Jan 2024" },
  { id: "U-0011", name: "Marcus Lee", email: "marcus.l@email.com", role: "user", status: "active", bookings: 9, joined: "Jan 2024" },
  { id: "U-0010", name: "Priya Sharma", email: "priya.s@email.com", role: "user", status: "suspended", bookings: 2, joined: "Dec 2023" },
  { id: "U-0009", name: "Tom Wright", email: "tom.w@email.com", role: "user", status: "active", bookings: 21, joined: "Dec 2023" },
];

const BOOKINGS = [
  { id: "BK-2041", user: "Sarah Johnson", route: "NYC → Boston", date: "Feb 18", seats: 2, amount: "$64", status: "confirmed" },
  { id: "BK-2040", user: "Tom Wright", route: "LA → SF", date: "Feb 17", seats: 1, amount: "$45", status: "confirmed" },
  { id: "BK-2039", user: "Marcus Lee", route: "Chicago → Detroit", date: "Feb 17", seats: 3, amount: "$90", status: "pending" },
  { id: "BK-2038", user: "Priya Sharma", route: "Seattle → Portland", date: "Feb 16", seats: 1, amount: "$28", status: "cancelled" },
];

// ─── Helper Components ──────────────────────────────────────────────────────
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
      <FaShieldAlt className="text-[9px]" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a2030] text-[#9ca6ba] border border-[#282e39]">
      User
    </span>
  );

// ─── Main Component ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <p className="text-[#505a6b] text-sm font-medium">Good morning,</p>
        <h2 className="text-white text-3xl font-black tracking-tight">
          {user?.name || "Admin"}
        </h2>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-xl p-5`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className={`text-xl ${stat.iconColor}`} />
                <span
                  className={`flex items-center gap-1 text-xs font-bold ${
                    stat.up ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {stat.up ? (
                    <FaArrowUp className="text-[10px]" />
                  ) : (
                    <FaArrowDown className="text-[10px]" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-white text-2xl font-black">{stat.value}</p>
              <p className="text-[#9ca6ba] text-xs mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-[#0C1017] border border-[#1a2030] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2030]">
          <h3 className="text-white font-black uppercase tracking-tight">
            Recent Bookings
          </h3>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="text-primary text-xs font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2030]">
                {["Booking ID", "Customer", "Route", "Date", "Amount", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#505a6b]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-[#1a2030]/50 hover:bg-white/[0.02] transition-colors ${
                    i === BOOKINGS.length - 1 ? "border-0" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-primary text-sm font-bold">
                    {b.id}
                  </td>
                  <td className="px-6 py-4 text-white text-sm font-medium">
                    {b.user}
                  </td>
                  <td className="px-6 py-4 text-[#9ca6ba] text-sm">{b.route}</td>
                  <td className="px-6 py-4 text-[#9ca6ba] text-sm">{b.date}</td>
                  <td className="px-6 py-4 text-white text-sm font-bold">
                    {b.amount}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-[#0C1017] border border-[#1a2030] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2030]">
          <h3 className="text-white font-black uppercase tracking-tight">
            Recent Users
          </h3>
          <button
            onClick={() => navigate("/admin/users")}
            className="text-primary text-xs font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2030]">
                {["User", "Role", "Status", "Bookings", "Joined"].map((h) => (
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
              {USERS.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[#1a2030]/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[#0a1628] flex items-center justify-center font-black text-xs flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {u.name}
                        </p>
                        <p className="text-[#505a6b] text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-6 py-4 text-[#9ca6ba] text-sm">
                    {u.bookings}
                  </td>
                  <td className="px-6 py-4 text-[#9ca6ba] text-sm">
                    {u.joined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;