import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";

import {
  fetchOrganizerApplicationDetail,
} from "../../store/admin/adminAuthThunks";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/15 text-red-400 border-red-500/20",
  };

  const icons = {
    pending: FaClock,
    approved: FaCheckCircle,
    rejected: FaTimesCircle,
  };

  const Icon = icons[status] || FaClock;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
        styles[status] || "border-[#2a3140] text-[#9ca6ba]"
      }`}
    >
      <Icon className="text-xs" />
      {status}
    </span>
  );
};

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-[#5c667a] uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm text-white font-medium break-all">
      {value || "-"}
    </span>
  </div>
);

function OrganizerApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { applicationDetail, detailLoading } = useSelector(
    (state) => state.adminAuth
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOrganizerApplicationDetail(id));
    }
  }, [dispatch, id]);

  if (detailLoading || !applicationDetail) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-[#9ca6ba]">
        Loading application details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F16] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/organizer-applications")}
          className="flex items-center gap-2 text-sm text-[#9ca6ba] hover:text-white"
        >
          <FaArrowLeft />
          Back to Applications
        </button>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black">
              {applicationDetail.organization_name}
            </h2>
            <p className="text-[#5c667a] text-sm mt-1">
              Application ID: {applicationDetail.id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={applicationDetail.status} />

            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                applicationDetail.is_verified
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/15 text-red-400 border-red-500/20"
              }`}
            >
              <FaShieldAlt className="text-xs" />
              {applicationDetail.is_verified
                ? "Verified User"
                : "Not Verified"}
            </span>
          </div>
        </div>

        {/* BUSINESS INFO */}
        <div className="bg-[#111722] border border-[#1d2432] rounded-2xl p-8">
          <h3 className="text-lg font-bold mb-6">Organization Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <Field label="Organization Name" value={applicationDetail.organization_name} />
            <Field label="Address" value={applicationDetail.address} />
            <Field label="User ID" value={applicationDetail.user_id} />
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="bg-[#111722] border border-[#1d2432] rounded-2xl p-8">
          <h3 className="text-lg font-bold mb-6">Contact Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <Field label="Contact Name" value={applicationDetail.contact_name} />
            <Field label="Contact Email" value={applicationDetail.contact_email} />
            <Field label="Contact Phone" value={applicationDetail.contact_phone} />
          </div>
        </div>

        {/* BANK INFO */}
        <div className="bg-[#111722] border border-[#1d2432] rounded-2xl p-8">
          <h3 className="text-lg font-bold mb-6">Bank Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <Field label="Beneficiary Name" value={applicationDetail.beneficiary_name} />
            <Field label="Account Type" value={applicationDetail.account_type} />
            <Field label="Bank Name" value={applicationDetail.bank_name} />
            <Field label="Account Number" value={applicationDetail.account_number} />
            <Field label="IFSC Code" value={applicationDetail.ifsc_code} />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {applicationDetail.status === "pending" && (
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl font-semibold transition">
              <FaCheckCircle />
              Approve Application
            </button>

            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition">
              <FaTimesCircle />
              Reject Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerApplicationDetail;
