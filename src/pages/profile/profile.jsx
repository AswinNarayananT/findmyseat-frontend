import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/auth/authThunks";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PersonalInfo from "../../components/PersonalInfo";
import Security from "../../components/Security";
import Wallet from "../../components/Wallet";
import Bookings from "../../components/Bookings";
import { FaUser, FaShieldAlt, FaWallet, FaTicketAlt } from "react-icons/fa";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("personal");

  const menuItems = [
    { id: "personal", icon: FaUser, label: "Personal Info" },
    { id: "bookings", icon: FaTicketAlt, label: "Your Bookings" },
    { id: "wallet", icon: FaWallet, label: "Wallet" },
    { id: "change password", icon: FaShieldAlt, label: "Security" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "personal": return <PersonalInfo />;
      case "bookings": return <Bookings />;
      case "wallet": return <Wallet />;
      case "change password": return <Security />;
      default: return null;
    }
  };

  return (
    <div className="dark bg-[#0a0f14] min-h-screen flex flex-col text-white font-display">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full py-12 px-6 lg:flex gap-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 mb-10 lg:mb-0">
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{user?.name}</h1>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Verified Member</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-bold text-sm ${
                  activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-800/50"
                }`}
              >
                <item.icon /> {item.label}
              </button>
            ))}
            <button
              onClick={() => { dispatch(logoutUser()); navigate("/"); }}
              className="mt-6 flex items-center gap-4 px-5 py-4 rounded-xl text-red-500 font-bold text-sm hover:bg-red-500/10 transition-all"
            >
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <section className="flex-1">
          <header className="mb-10">
            <h2 className="text-3xl font-black tracking-tight capitalize">{activeTab.replace("-", " ")}</h2>
            <p className="text-slate-500 mt-2">Manage your platform preferences and data.</p>
          </header>
          {renderContent()}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;