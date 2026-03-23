import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { changePassword } from "../store/auth/authThunks";
import toast from "react-hot-toast";

const Security = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.currentPassword) errors.currentPassword = "Required";
    if (formData.newPassword.length < 8) errors.newPassword = "Must be at least 8 characters";
    if (formData.newPassword !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (formData.currentPassword === formData.newPassword) errors.newPassword = "New password must be different";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await dispatch(
        changePassword({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        })
      ).unwrap();

      toast.success(result.message || "Password updated successfully!");
      
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
    } catch (err) {
      toast.error(err || "Failed to update password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-medium tracking-wide">Current Password</label>
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`w-full rounded-lg border bg-[#1c2127] text-white h-12 px-4 pr-12 outline-none transition-all ${
                validationErrors.currentPassword ? "border-red-500" : "border-slate-700 focus:border-blue-600"
              }`}
              placeholder="Enter your current password"
            />
            <button type="button" onClick={() => toggleVisibility("current")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
              {showPassword.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {validationErrors.currentPassword && <p className="text-red-500 text-[10px] uppercase font-bold">{validationErrors.currentPassword}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium tracking-wide">New Password</label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-[#1c2127] text-white h-12 px-4 pr-12 outline-none transition-all ${
                  validationErrors.newPassword ? "border-red-500" : "border-slate-700 focus:border-blue-600"
                }`}
                placeholder="New password"
              />
              <button type="button" onClick={() => toggleVisibility("new")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.newPassword && <p className="text-red-500 text-[10px] uppercase font-bold">{validationErrors.newPassword}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium tracking-wide">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-[#1c2127] text-white h-12 px-4 pr-12 outline-none transition-all ${
                  validationErrors.confirmPassword ? "border-red-500" : "border-slate-700 focus:border-blue-600"
                }`}
                placeholder="Repeat new password"
              />
              <button type="button" onClick={() => toggleVisibility("confirm")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.confirmPassword && <p className="text-red-500 text-[10px] uppercase font-bold">{validationErrors.confirmPassword}</p>}
          </div>
        </div>

        <div className="bg-blue-600/5 border border-blue-600/10 p-4 rounded-xl flex gap-3 text-slate-400">
          <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
          <p className="text-xs leading-relaxed">
            Changing your password will not log you out of your current session. Make sure to use a unique password you haven't used before.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-fit px-10 py-3 bg-white text-black font-black rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default Security;