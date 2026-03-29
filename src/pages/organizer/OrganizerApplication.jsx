import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrganizerApplication, submitOrganizerApplication } from "../../store/organizer/organizerThunk";
import { 
  FaBuilding, 
  FaUser, 
  FaUniversity,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaHistory,
  FaBan
} from "react-icons/fa";

const organizerSchema = z.object({
  organization_or_individual_name: z.string().min(3, "Organization/Individual name must be at least 3 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  contact_name: z.string().min(3, "Contact name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number starting with 6-9"),
  beneficiary_name: z.string().min(3, "Beneficiary name is required"),
  account_type: z.enum(["Savings", "Current"], {
    errorMap: () => ({ message: "Please select account type" }),
  }),
  bank_name: z.string().min(3, "Bank name is required"),
  account_number: z.string().min(9, "Account number must be at least 9 digits").max(18, "Account number must not exceed 18 digits"),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format (e.g., SBIN0001234)").toUpperCase(),
});

function OrganizerApplication() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, detailLoading, error, application } = useSelector(
    (state) => state.organizer
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(organizerSchema),
  });

  useEffect(() => {
    dispatch(fetchMyOrganizerApplication());
  }, [dispatch]);

  useEffect(() => {
    if (application) {
      reset({
        organization_or_individual_name: application.organization_name,
        address: application.address,
        contact_name: application.contact_name,
        email: application.contact_email,
        phone_number: application.contact_phone,
        beneficiary_name: application.beneficiary_name,
        account_type: application.account_type,
        bank_name: application.bank_name,
        account_number: application.account_number,
        ifsc_code: application.ifsc_code,
      });
    }
  }, [application, reset]);

  const onSubmit = async (data) => {
    const result = await dispatch(submitOrganizerApplication(data));
    if (submitOrganizerApplication.fulfilled.match(result)) {
      navigate("/application-success");
    }
  };

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isPending = application?.status === "pending";
  const isRejected = application?.status === "rejected";
  const isPermanentlyRejected = application?.status === "permanently_rejected";

  return (
    <div className="min-h-screen bg-background-dark text-white flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">Organizer Portal</h1>
          <p className="text-[#9ca6ba] text-lg">
            {isPending ? "Your application is currently being reviewed" : "Verify your details to host events"}
          </p>
        </div>

        {isPending && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl mb-8 flex items-center gap-4">
            <FaClock className="text-amber-500 text-3xl animate-pulse" />
            <div>
              <h3 className="text-amber-500 font-bold uppercase text-sm">Application Status: Pending</h3>
              <p className="text-xs text-[#9ca6ba] mt-1">Our team is reviewing your details. Form editing is disabled during this period.</p>
            </div>
          </div>
        )}

        {isPermanentlyRejected && (
          <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl mb-8 flex items-center gap-4">
            <FaBan className="text-red-500 text-3xl" />
            <div>
              <h3 className="text-red-500 font-bold uppercase text-sm">Application Permanently Rejected</h3>
              <p className="text-xs text-[#9ca6ba] mt-1">You have reached the maximum resubmission limit (3 attempts).</p>
            </div>
          </div>
        )}

        {(isRejected || isPermanentlyRejected) && application?.history?.length > 0 && (
          <div className="bg-[#111722] border border-red-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaHistory /> Rejection History
            </h3>
            <div className="space-y-4">
              {application.history.map((hist, idx) => (
                <div key={idx} className="bg-black/20 p-4 rounded-lg border-l-2 border-red-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-[#5c667a]">{new Date(hist.rejected_at).toLocaleString()}</span>
                    <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded">Attempt {idx + 1}</span>
                  </div>
                  <p className="text-sm text-[#9ca6ba] italic">"{hist.rejection_reason}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 flex items-start gap-3">
            <FaExclamationTriangle className="mt-1" />
            <div>
              <p className="font-semibold mb-1 text-sm text-red-400 uppercase tracking-tighter">Submission Error</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        <div className={`bg-[#1E1E1E] border border-[#282e39] rounded-xl overflow-hidden ${(isPending || isPermanentlyRejected) ? 'opacity-50 pointer-events-none' : ''}`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-8 border-b border-[#282e39]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FaBuilding className="text-primary text-lg" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Organization Details</h2>
              </div>
              <div className="space-y-5">
                <InputField label="Organization / Individual Name" name="organization_or_individual_name" register={register} error={errors.organization_or_individual_name} />
                <TextAreaField label="Business Address" name="address" register={register} error={errors.address} />
              </div>
            </div>

            <div className="p-8 border-b border-[#282e39]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FaUser className="text-primary text-lg" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Contact Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Contact Person Name" name="contact_name" register={register} error={errors.contact_name} />
                <InputField label="Phone Number" name="phone_number" register={register} error={errors.phone_number} />
                <div className="md:col-span-2">
                  <InputField label="Email Address" name="email" type="email" register={register} error={errors.email} />
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FaUniversity className="text-primary text-lg" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Bank Account Details</h2>
              </div>
              <div className="space-y-5">
                <InputField label="Account Holder Name (Beneficiary)" name="beneficiary_name" register={register} error={errors.beneficiary_name} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Account Type <span className="text-red-400">*</span></label>
                    <select {...register("account_type")} className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg h-12 px-4 text-white focus:outline-none focus:border-primary">
                      <option value="">Select account type</option>
                      <option value="Savings">Savings Account</option>
                      <option value="Current">Current Account</option>
                    </select>
                    {errors.account_type && <p className="text-red-400 text-xs mt-1.5">{errors.account_type.message}</p>}
                  </div>
                  <InputField label="Bank Name" name="bank_name" register={register} error={errors.bank_name} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Account Number" name="account_number" register={register} error={errors.account_number} />
                  <InputField label="IFSC Code" name="ifsc_code" register={register} error={errors.ifsc_code} uppercase={true} />
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <button
                type="submit"
                disabled={loading || isPending || isPermanentlyRejected}
                className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : isRejected ? "Resubmit Application" : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, register, error, type = "text", placeholder = "", uppercase = false }) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">{label} <span className="text-red-400">*</span></label>
      <input type={type} {...register(name)} placeholder={placeholder} className={`w-full bg-[#1c2127] border border-[#3b4754] rounded-lg h-12 px-4 text-white focus:outline-none focus:border-primary placeholder:text-[#505a6b] ${uppercase ? 'uppercase' : ''}`} />
      {error && <p className="text-red-400 text-xs mt-1.5">{error.message}</p>}
    </div>
  );
}

function TextAreaField({ label, name, register, error, placeholder = "" }) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">{label} <span className="text-red-400">*</span></label>
      <textarea {...register(name)} rows={4} placeholder={placeholder} className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg p-4 text-white focus:outline-none focus:border-primary placeholder:text-[#505a6b] resize-none" />
      {error && <p className="text-red-400 text-xs mt-1.5">{error.message}</p>}
    </div>
  );
}

export default OrganizerApplication;