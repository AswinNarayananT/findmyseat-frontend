import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import { changePassword, updatePersonalInfo } from "../../store/auth/authThunks";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  FaUser,
  FaShieldAlt,
  FaBell,
  FaCreditCard,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Success/Error states
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Form data
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

    // Clear validation errors on input
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ""
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Validate password
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Reset states
    setPasswordSuccess(false);
    setPasswordError("");
    setValidationErrors({});

    const errors = {};

    // Validate current password
    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    // Validate new password
    if (!formData.newPassword) {
      errors.newPassword = "New password is required";
    } else {
      const passwordValidationErrors = validatePassword(formData.newPassword);
      if (passwordValidationErrors.length > 0) {
        errors.newPassword = passwordValidationErrors[0];
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Check if current password is same as new password
    if (formData.currentPassword && formData.newPassword &&
      formData.currentPassword === formData.newPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await dispatch(
        changePassword({
          current_password: formData.currentPassword,
          new_password: formData.newPassword
        })
      ).unwrap();

      // Success
      setPasswordSuccess(true);
      setPasswordError("");

      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 5000);

    } catch (error) {
      setPasswordError(error || "Failed to change password");
      setPasswordSuccess(false);
    }
  };

  // Handle personal info save
  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();

    const trimmedName = formData.fullName.trim();
    const trimmedPhone = formData.phone.trim();

    const nameChanged = trimmedName !== user.full_name;
    const phoneChanged = trimmedPhone !== user.phone;

    if (!nameChanged && !phoneChanged) {
      console.log("No changes detected. Skipping API call.");
      return;
    }

    const updatePayload = {};

    if (nameChanged) updatePayload.full_name = trimmedName;
    if (phoneChanged) updatePayload.phone = trimmedPhone;

    const result = await dispatch(updatePersonalInfo(updatePayload));

    if (updatePersonalInfo.fulfilled.match(result)) {
      console.log("Profile updated successfully");
    } else {
      console.error("Update failed:", result.payload);
    }
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
                  <h1 className="text-white text-lg font-bold">{user?.name || "User"}</h1>
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
                      onClick={() => {
                        setActiveTab(item.id);
                        setPasswordSuccess(false);
                        setPasswordError("");
                        setValidationErrors({});
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
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

            {/* Personal Information Section */}
            {activeTab === "personal" && (
              <form
                onSubmit={handleSavePersonalInfo}
                className="flex flex-col gap-12 max-w-2xl"
              >
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
                      <label className="text-white text-sm font-medium">
                        Full Name
                      </label>
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

                      {/* Email - Read Only */}
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full rounded-lg border border-[#3b4754] bg-[#14181d] text-gray-400 h-12 px-4 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500">
                          Email cannot be changed.
                        </p>
                      </div>

                      {/* Phone - Editable */}
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">
                          Phone Number
                        </label>
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
            )}

            {/* Security Section */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-12 max-w-2xl">
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-px flex-1 bg-[#283039]"></span>
                    <h2 className="text-white text-sm font-bold uppercase tracking-widest px-2">
                      Change Password
                    </h2>
                    <span className="h-px flex-1 bg-[#283039]"></span>
                  </div>

                  {/* Success Message */}
                  {passwordSuccess && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex gap-3">
                      <FaCheckCircle className="text-green-500 text-lg flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-500 font-semibold">Password changed successfully!</p>
                        <p className="text-sm text-[#9dabb9] mt-1">Your password has been updated.</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {passwordError && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex gap-3">
                      <FaExclamationCircle className="text-red-500 text-lg flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-500 font-semibold">Failed to change password</p>
                        <p className="text-sm text-[#9dabb9] mt-1">{passwordError}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    {/* Current Password */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white text-sm font-medium">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border ${validationErrors.currentPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                              : "border-[#3b4754] focus:border-primary focus:ring-primary/20"
                            } bg-[#1c2127] text-white focus:ring-1 h-12 px-4 pr-12 transition-all outline-none`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white"
                        >
                          {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {validationErrors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.currentPassword}</p>
                      )}
                    </div>

                    {/* New Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border ${validationErrors.newPassword
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-[#3b4754] focus:border-primary focus:ring-primary/20"
                              } bg-[#1c2127] text-white focus:ring-1 h-12 px-4 pr-12 transition-all outline-none`}
                            placeholder="Min. 8 characters"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("new")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white"
                          >
                            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {validationErrors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border ${validationErrors.confirmPassword
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-[#3b4754] focus:border-primary focus:ring-primary/20"
                              } bg-[#1c2127] text-white focus:ring-1 h-12 px-4 pr-12 transition-all outline-none`}
                            placeholder="Repeat new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirm")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white"
                          >
                            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {validationErrors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                        )}
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

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#283039]">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                      setValidationErrors({});
                      setPasswordError("");
                      setPasswordSuccess(false);
                    }}
                    className="px-6 py-3 text-sm font-bold text-[#9dabb9] hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-3 bg-white text-black font-black rounded-lg hover:bg-gray-200 transition-all uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Change Password"}
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Section */}
            {activeTab === "notifications" && (
              <section className="flex flex-col gap-12 max-w-2xl">
                <div>
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
                </div>
              </section>
            )}

            {/* Billing Section */}
            {activeTab === "billing" && (
              <section className="flex flex-col gap-12 max-w-2xl">
                <div>
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
                </div>
              </section>
            )}

            {/* Delete Account Section */}
            <div className="mt-8 p-6 rounded-xl border border-red-500/10 bg-red-500/5 max-w-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold">Delete Account</h3>
                  <p className="text-[#9dabb9] text-sm mt-1">
                    Permanently delete your account and all associated booking data.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-sm font-bold text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
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