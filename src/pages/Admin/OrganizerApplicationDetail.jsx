import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
  FaHistory,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  fetchOrganizerApplicationDetail,
  updateOrganizerApplicationStatus,
} from "../../store/admin/adminAuthThunks";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/15 text-red-400 border-red-500/20",
    permanently_rejected: "bg-red-900/30 text-red-500 border-red-900/50",
  };

  const icons = {
    pending: FaClock,
    approved: FaCheckCircle,
    rejected: FaTimesCircle,
    permanently_rejected: FaExclamationTriangle,
  };

  const Icon = icons[status] || FaClock;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || "border-[#2a3140] text-[#9ca6ba]"}`}>
      <Icon className="text-xs" />
      {status?.replace("_", " ").toUpperCase()}
    </span>
  );
};

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-[#5c667a] uppercase tracking-wide">{label}</span>
    <span className="text-sm text-white font-medium break-all">{value || "-"}</span>
  </div>
);

function OrganizerApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { applicationDetail, detailLoading } = useSelector((state) => state.adminAuth);

  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchOrganizerApplicationDetail(id));
  }, [dispatch, id]);

  const handleConfirm = async () => {
    if (actionType === "reject" && !rejectionReason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(updateOrganizerApplicationStatus({
        id,
        status: actionType === "approve" ? "approved" : "rejected",
        rejection_reason: actionType === "reject" ? rejectionReason : null,
      })).unwrap();
      setModalOpen(false);
      dispatch(fetchOrganizerApplicationDetail(id));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (detailLoading || !applicationDetail) {
    return <div className="flex justify-center items-center h-[60vh] text-[#9ca6ba]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0F16] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        <button onClick={() => navigate("/admin/organizer-applications")} className="flex items-center gap-2 text-sm text-[#9ca6ba] hover:text-white transition">
          <FaArrowLeft /> Back to Applications
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black">{applicationDetail.organization_name}</h2>
            <div className="flex items-center gap-4 mt-2">
               <p className="text-[#5c667a] text-xs">ID: {applicationDetail.id}</p>
               <span className="text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                 Submission Count: {applicationDetail.rejection_count + 1} / 3
               </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={applicationDetail.status} />
          </div>
        </div>

        {/* Current Rejection Reason (If currently in rejected state) */}
        {applicationDetail.status === "rejected" && applicationDetail.current_rejection_reason && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex gap-4 items-start">
            <FaExclamationTriangle className="text-red-500 mt-1" />
            <div>
              <h4 className="text-red-400 font-bold text-sm">Last Rejection Reason</h4>
              <p className="text-sm text-red-200/80">{applicationDetail.current_rejection_reason}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <section className="bg-[#111722] border border-[#1d2432] rounded-2xl p-6">
              <h3 className="text-sm font-bold mb-6 text-[#9ca6ba] uppercase tracking-widest">Organization & Contact</h3>
              <div className="grid grid-cols-2 gap-y-6">
                <Field label="Organization" value={applicationDetail.organization_name} />
                <Field label="Contact Name" value={applicationDetail.contact_name} />
                <Field label="Email" value={applicationDetail.contact_email} />
                <Field label="Phone" value={applicationDetail.contact_phone} />
                <div className="col-span-2"><Field label="Address" value={applicationDetail.address} /></div>
              </div>
            </section>

            <section className="bg-[#111722] border border-[#1d2432] rounded-2xl p-6">
              <h3 className="text-sm font-bold mb-6 text-[#9ca6ba] uppercase tracking-widest">Financial Details</h3>
              <div className="grid grid-cols-2 gap-y-6">
                <Field label="Beneficiary" value={applicationDetail.beneficiary_name} />
                <Field label="Bank Name" value={applicationDetail.bank_name} />
                <Field label="Account Type" value={applicationDetail.account_type} />
                <Field label="Account Number" value={applicationDetail.account_number} />
                <Field label="IFSC Code" value={applicationDetail.ifsc_code} />
              </div>
            </section>
          </div>

          {/* History Sidebar */}
          <aside className="bg-[#0e131b] border border-[#1d2432] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaHistory className="text-[#5c667a]" />
              <h3 className="text-sm font-bold text-[#9ca6ba] uppercase tracking-widest">Rejection History</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {applicationDetail.history?.length > 0 ? (
                applicationDetail.history.map((hist, idx) => (
                  <div key={idx} className="border-l-2 border-[#2a3140] pl-4 py-1 relative">
                    <div className="absolute w-2 h-2 bg-[#2a3140] rounded-full -left-[5px] top-2" />
                    <p className="text-xs text-[#5c667a]">{new Date(hist.rejected_at).toLocaleDateString()}</p>
                    <p className="text-sm text-white mt-1 leading-relaxed">{hist.rejection_reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#5c667a]">No previous rejections.</p>
              )}
            </div>
          </aside>
        </div>

        {applicationDetail.status === "pending" && (
          <div className="flex gap-4 p-6 bg-[#111722] border-t border-[#1d2432] sticky bottom-10 rounded-2xl shadow-2xl">
            <button onClick={() => setModalOpen(true) || setActionType("approve")} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold transition">
              <FaCheckCircle /> Approve
            </button>
            <button onClick={() => setModalOpen(true) || setActionType("reject")} className="flex-1 flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-bold transition">
              <FaTimesCircle /> Reject
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#111722] border border-[#1d2432] rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">{actionType === "approve" ? "Approve Application?" : "Reject Application?"}</h3>
            <p className="text-sm text-[#9ca6ba] mb-6">
              {actionType === "approve" ? "The user will be granted organizer permissions immediately." : "Please explain why this application is being rejected."}
            </p>

            {actionType === "reject" && (
              <textarea
                placeholder="Ex: Bank document is unclear..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-[#0A0F16] border border-[#2a3140] rounded-xl p-4 text-sm outline-none focus:border-red-500 mb-4 min-h-[120px]"
              />
            )}

            <div className="flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-3 bg-[#2a3140] rounded-xl text-sm font-bold">Cancel</button>
              <button onClick={handleConfirm} disabled={submitting} className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold ${actionType === "approve" ? "bg-emerald-600" : "bg-red-600"}`}>
                {submitting ? "Processing..." : "Confirm Action"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerApplicationDetail;