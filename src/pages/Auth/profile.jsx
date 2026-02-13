import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  FaUser, 
  FaShieldAlt, 
  FaBell, 
  FaCreditCard, 
  FaEye, 
  FaEyeSlash,
  FaInfoCircle 
} from "react-icons/fa";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "Unknown",
    email: user?.email || "Unknown",
  phone: user?.phone_number || "Not Available",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.log("Saving changes:", formData);
  };

  const handleDeleteAccount = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    { id: "personal", icon: FaUser, label: "Personal Info" },
    { id: "security", icon: FaShieldAlt, label: "Security" },
    { id: "notifications", icon: FaBell, label: "Notifications" },
    { id: "billing", icon: FaCreditCard, label: "Billing" }
  ];

  return (
    <div className="dark bg-background-dark min-h-screen flex flex-col text-white font-display">
      <Navbar />

      <main className="flex-1 flex justify-center py-10 px-6 md:px-20">
        <div className="max-w-[1200px] w-full flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex flex-col gap-8">
            {/* User Profile Card */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#101922] flex items-center justify-center text-white font-black text-xl ring-1 ring-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <span className="relative z-10">{user?.name?.charAt(0).toUpperCase() || "A"}</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-white text-lg font-bold">{user?.name || "Alex Rivera"}</h1>
                  <p className="text-[#9dabb9] text-xs">Member since 2023</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? "bg-primary text-white shadow-lg shadow-primary/10"
                          : "text-[#9dabb9] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black tracking-tight">Account Settings</h1>
              <p className="text-[#9dabb9] text-base">
                Manage your profile details and account security preferences.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveChanges} className="flex flex-col gap-12 max-w-2xl">
              {/* Personal Information Section */}
              {activeTab === "personal" && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-px flex-1 bg-[#283039]"></span>
                    <h2 className="text-white text-sm font-bold uppercase tracking-widest px-2">
                      Personal Information
                    </h2>
                    <span className="h-px flex-1 bg-[#283039]"></span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-[#3b4754] bg-[#1c2127] text-white focus:border-primary focus:ring-1 focus:ring-primary/20 h-12 px-4 transition-all outline-none"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-[#3b4754] bg-[#1c2127] text-white focus:border-primary focus:ring-1 focus:ring-primary/20 h-12 px-4 transition-all outline-none"
                          placeholder="name@domain.com"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-[#3b4754] bg-[#1c2127] text-white focus:border-primary focus:ring-1 focus:ring-primary/20 h-12 px-4 transition-all outline-none"
                          placeholder="+1 (234) 567-890"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Security Section */}
              {activeTab === "security" && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-px flex-1 bg-[#283039]"></span>
                    <h2 className="text-white text-sm font-bold uppercase tracking-widest px-2">
                      Security
                    </h2>
                    <span className="h-px flex-1 bg-[#283039]"></span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Current Password */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white text-sm font-medium">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-[#3b4754] bg-[#1c2127] text-white focus:border-primary focus:ring-1 focus:ring-primary/20 h-12 px-4 pr-12 transition-all outline-none"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* New Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-[#3b4754] bg-[#1c2127] text-white focus:border-primary focus:ring-1 focus:ring-primary/20 h-12 px-4 transition-all outline-none"
                          placeholder="Min. 8 characters"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-[#3b4754] bg-[#1c2127] text-white focus:border-primary focus:ring-1 focus:ring-primary/20 h-12 px-4 transition-all outline-none"
                          placeholder="Repeat new password"
                        />
                      </div>
                    </div>

                    {/* Password Info */}
                    <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg flex gap-3">
                      <FaInfoCircle className="text-primary text-lg flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#9dabb9]">
                        Password must contain at least 8 characters, one uppercase letter, and one special character.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Notifications Section */}
              {activeTab === "notifications" && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-px flex-1 bg-[#283039]"></span>
                    <h2 className="text-white text-sm font-bold uppercase tracking-widest px-2">
                      Notification Preferences
                    </h2>
                    <span className="h-px flex-1 bg-[#283039]"></span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Email Notifications", description: "Receive booking confirmations and updates" },
                      { label: "SMS Notifications", description: "Get text alerts for important updates" },
                      { label: "Marketing Emails", description: "Receive promotional offers and deals" },
                      { label: "Push Notifications", description: "Browser notifications for real-time updates" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-[#3b4754] bg-[#1c2127]">
                        <div>
                          <h3 className="text-white font-medium">{item.label}</h3>
                          <p className="text-[#9dabb9] text-sm">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                          <div className="w-11 h-6 bg-[#3b4754] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Billing Section */}
              {activeTab === "billing" && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-px flex-1 bg-[#283039]"></span>
                    <h2 className="text-white text-sm font-bold uppercase tracking-widest px-2">
                      Billing Information
                    </h2>
                    <span className="h-px flex-1 bg-[#283039]"></span>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-lg border border-[#3b4754] bg-[#1c2127]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">Payment Methods</h3>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                          Add Card
                        </button>
                      </div>
                      <p className="text-[#9dabb9] text-sm">No payment methods added yet.</p>
                    </div>

                    <div className="p-6 rounded-lg border border-[#3b4754] bg-[#1c2127]">
                      <h3 className="text-white font-bold mb-4">Booking History</h3>
                      <p className="text-[#9dabb9] text-sm">Your booking history will appear here.</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#283039]">
                <button
                  type="button"
                  className="px-6 py-3 text-sm font-bold text-[#9dabb9] hover:text-white transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-white text-black font-black rounded-lg hover:bg-gray-200 transition-all uppercase tracking-widest shadow-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Delete Account Section */}
            <div className="mt-8 p-6 rounded-xl border border-red-500/10 bg-red-500/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold">Delete Account</h3>
                  <p className="text-[#9dabb9] text-sm mt-1">
                    Permanently delete your account and all associated booking data.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-sm font-bold text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#1c2127] border border-[#3b4754] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-bold mb-4">Confirm Account Deletion</h3>
            <p className="text-[#9dabb9] mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-[#3b4754] text-white rounded-lg hover:bg-[#4a5865] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Profile;