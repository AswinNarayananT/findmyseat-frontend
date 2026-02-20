import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import {
  FaUsers,
  FaTicketAlt,
  FaShieldAlt,
  FaBus,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaSearch,
  FaBell,
  FaFileAlt,
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "overview", path: "/admin/dashboard", icon: FaTachometerAlt, label: "Overview" },
  { id: "applications", path: "/admin/organizer-applications", icon: FaFileAlt, label: "Applications" },
  { id: "settings", path: "/admin/settings", icon: FaCog, label: "Settings" },
];

function AdminBase() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  // Get current active page
  const currentPath = location.pathname;
  const currentPage = NAV_ITEMS.find(item => item.path === currentPath);

  return (
    <div className="min-h-screen bg-[#080B10] text-white flex">

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SIDEBAR */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } transition-all duration-300 flex-shrink-0 border-r border-[#1a2030] bg-[#0C1017] flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-[#1a2030] gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <FaShieldAlt className="text-white text-sm" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tight leading-none">
                FindMySeat
              </p>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest">
                Admin
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-[#505a6b] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="flex-shrink-0 text-base" />
                {sidebarOpen && (
                  <span className="text-sm font-semibold">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-[#1a2030] p-3">
          {sidebarOpen && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[#505a6b] text-xs truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#505a6b] hover:text-red-400 hover:bg-red-500/5 transition-all w-full ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-[#1a2030] bg-[#0C1017]/80 backdrop-blur-md flex items-center justify-between px-6 gap-4 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#505a6b] hover:text-white transition-colors p-1"
            >
              <div className="flex flex-col gap-1">
                <span className="block w-5 h-0.5 bg-current" />
                <span className="block w-5 h-0.5 bg-current" />
                <span className="block w-5 h-0.5 bg-current" />
              </div>
            </button>
            
            {/* Page Title */}
            <h1 className="text-white font-black text-lg uppercase tracking-tight">
              {currentPage?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#505a6b] text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-[#0D1117] border border-[#1e2837] rounded-lg h-9 pl-8 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 w-56 placeholder:text-[#2a3545]"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-lg bg-[#1a2030] border border-[#283039] flex items-center justify-center text-[#9ca6ba] hover:text-white transition-colors">
              <FaBell className="text-sm" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[9px] font-black flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Avatar */}
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-black text-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page Content - Rendered via Outlet */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
}

export default AdminBase;