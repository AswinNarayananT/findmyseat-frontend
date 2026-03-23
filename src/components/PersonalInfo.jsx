import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePersonalInfo } from "../store/auth/authThunks";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedName = formData.fullName?.trim();
  const trimmedPhone = formData.phone?.trim();

  if (!trimmedName) {
    toast("Full name is required.", "error");
    return;
  }

  const nameChanged = trimmedName !== user?.name;
  const phoneChanged = trimmedPhone !== user?.phone_number;

  if (!nameChanged && !phoneChanged) {
    toast("No changes detected.", "error");
    return;
  }

  const updatePayload = {};
  if (nameChanged) updatePayload.full_name = trimmedName;
  if (phoneChanged) updatePayload.phone = trimmedPhone;

  try {
    const result = await dispatch(updatePersonalInfo(updatePayload)).unwrap();
    toast(result?.message || "Profile updated successfully.", "success");
  } catch (error) {
    toast(error || "Failed to update profile.", "error");
  }
};
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 max-w-2xl">

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex gap-3">
          <FaCheckCircle className="text-green-500 text-lg flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-500 font-semibold">Success</p>
            <p className="text-sm text-slate-400 mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex gap-3">
          <FaExclamationCircle className="text-red-500 text-lg flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-500 font-semibold">Error</p>
            <p className="text-sm text-slate-400 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-slate-700 bg-[#1c2127] text-white focus:border-blue-600 h-12 px-4 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 text-slate-500">
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full rounded-lg border border-slate-800 bg-[#14181d] h-12 px-4 cursor-not-allowed"
            />
            <p className="text-[10px] uppercase tracking-wider">Email cannot be changed</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (234) 567-890"
              className="w-full rounded-lg border border-slate-700 bg-[#1c2127] text-white focus:border-blue-600 h-12 px-4 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[#283039]">
        <button
          type="button"
          onClick={() => {
            setFormData({
              fullName: user?.name || "",
              email: user?.email || "",
              phone: user?.phone_number || "",
            });
            setErrorMessage("");
            setSuccessMessage("");
          }}
          className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </form>
  );
};

export default PersonalInfo;