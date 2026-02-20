import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitOrganizerApplication } from "../../store/organizer/organizerThunk";
import { 
  FaBuilding, 
  FaUser, 
  FaUniversity,
  FaCheckCircle 
} from "react-icons/fa";

// ----------------------
// ZOD SCHEMA
// Matches backend OrganizerApplicationCreate schema
// ----------------------

const organizerSchema = z.object({
  // Maps to: organization_name in backend
  organization_or_individual_name: z
    .string()
    .min(3, "Organization/Individual name must be at least 3 characters"),

  // Maps to: address in backend
  address: z
    .string()
    .min(10, "Address must be at least 10 characters"),

  // Maps to: contact_name in backend
  contact_name: z
    .string()
    .min(3, "Contact name must be at least 3 characters"),

  // Maps to: contact_email in backend
  email: z
    .string()
    .email("Invalid email address"),

  // Maps to: contact_phone in backend
  phone_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number starting with 6-9"),

  // Maps to: beneficiary_name in backend
  beneficiary_name: z
    .string()
    .min(3, "Beneficiary name is required"),

  // Maps to: account_type in backend
  account_type: z.enum(["Savings", "Current"], {
    errorMap: () => ({ message: "Please select account type" }),
  }),

  // Maps to: bank_name in backend
  bank_name: z
    .string()
    .min(3, "Bank name is required"),

  // Maps to: account_number in backend
  account_number: z
    .string()
    .min(9, "Account number must be at least 9 digits")
    .max(18, "Account number must not exceed 18 digits"),

  // Maps to: ifsc_code in backend
  ifsc_code: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format (e.g., SBIN0001234)")
    .toUpperCase(),
});

function OrganizerApplication() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.organizer
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(organizerSchema),
  });

  const onSubmit = async (data) => {
    // Data structure matches backend expectations:
    // {
    //   organization_or_individual_name: string,
    //   address: string,
    //   contact_name: string,
    //   email: string,
    //   phone_number: string,
    //   beneficiary_name: string,
    //   account_type: "Savings" | "Current",
    //   bank_name: string,
    //   account_number: string,
    //   ifsc_code: string
    // }
    
    const result = await dispatch(
      submitOrganizerApplication(data)
    );

    if (submitOrganizerApplication.fulfilled.match(result)) {
      reset();
      navigate("/application-success");
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            Organizer Application
          </h1>
          <p className="text-[#9ca6ba] text-lg">
            Fill in your details to become a verified event organizer
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <FaBuilding className="text-white text-xs" />
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">Organization</span>
          </div>
          <div className="h-px w-8 sm:w-16 bg-[#282e39]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <FaUser className="text-white text-xs" />
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">Contact</span>
          </div>
          <div className="h-px w-8 sm:w-16 bg-[#282e39]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <FaUniversity className="text-white text-xs" />
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">Bank</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 flex items-start gap-3">
            <span className="text-red-400 text-xl">⚠</span>
            <div>
              <p className="font-semibold mb-1">Submission Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-[#1E1E1E] border border-[#282e39] rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* ==================== SECTION 1: Organization Details ==================== */}
            <div className="p-8 border-b border-[#282e39]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FaBuilding className="text-primary text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Organization Details
                  </h2>
                  <p className="text-[#9ca6ba] text-xs mt-0.5">
                    Tell us about your organization or business
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <InputField
                  label="Organization / Individual Name"
                  name="organization_or_individual_name"
                  register={register}
                  error={errors.organization_or_individual_name}
                  placeholder="e.g., ABC Events Pvt Ltd or John Doe"
                />

                <TextAreaField
                  label="Business Address"
                  name="address"
                  register={register}
                  error={errors.address}
                  placeholder="Enter your complete business address with city, state, and PIN code"
                />
              </div>
            </div>

            {/* ==================== SECTION 2: Contact Details ==================== */}
            <div className="p-8 border-b border-[#282e39]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FaUser className="text-primary text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Contact Details
                  </h2>
                  <p className="text-[#9ca6ba] text-xs mt-0.5">
                    Primary contact information for communication
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Contact Person Name"
                  name="contact_name"
                  register={register}
                  error={errors.contact_name}
                  placeholder="Full name of contact person"
                />

                <InputField
                  label="Phone Number"
                  name="phone_number"
                  register={register}
                  error={errors.phone_number}
                  placeholder="10-digit mobile (e.g., 9876543210)"
                />

                <div className="md:col-span-2">
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    placeholder="your.email@domain.com"
                  />
                </div>
              </div>

              {/* Note about email uniqueness */}
              <div className="mt-4 bg-primary/5 border border-primary/10 p-3 rounded-lg flex gap-2">
                <span className="text-primary text-xs">ℹ️</span>
                <p className="text-xs text-[#9ca6ba]">
                  This email will be used for your organizer account. Make sure it's not already registered.
                </p>
              </div>
            </div>

            {/* ==================== SECTION 3: Bank Details ==================== */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FaUniversity className="text-primary text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Bank Account Details
                  </h2>
                  <p className="text-[#9ca6ba] text-xs mt-0.5">
                    For receiving payments and settlements
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <InputField
                  label="Account Holder Name (Beneficiary)"
                  name="beneficiary_name"
                  register={register}
                  error={errors.beneficiary_name}
                  placeholder="Name as per bank records"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Account Type */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Account Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      {...register("account_type")}
                      className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg h-12 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    >
                      <option value="">Select account type</option>
                      <option value="Savings">Savings Account</option>
                      <option value="Current">Current Account</option>
                    </select>
                    {errors.account_type && (
                      <p className="text-red-400 text-xs mt-1.5">
                        {errors.account_type.message}
                      </p>
                    )}
                  </div>

                  <InputField
                    label="Bank Name"
                    name="bank_name"
                    register={register}
                    error={errors.bank_name}
                    placeholder="e.g., State Bank of India"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Account Number"
                    name="account_number"
                    register={register}
                    error={errors.account_number}
                    placeholder="9-18 digits"
                  />

                  <InputField
                    label="IFSC Code"
                    name="ifsc_code"
                    register={register}
                    error={errors.ifsc_code}
                    placeholder="e.g., SBIN0001234"
                    uppercase={true}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 bg-primary/5 border border-primary/10 p-4 rounded-lg flex gap-3">
                <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold mb-1">Verification Required</p>
                  <p className="text-sm text-[#9ca6ba]">
                    All information will be verified by our team. Ensure bank details are accurate to avoid payment delays. Your application status will be updated via email.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================== Submit Button ==================== */}
            <div className="px-8 pb-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? "Submitting Application..." : "Submit Application"}
                </span>
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-[#505a6b] text-sm">
            By submitting this application, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

      </div>
    </div>
  );
}


// ----------------------
// Reusable Components
// ----------------------

function InputField({ label, name, register, error, type = "text", placeholder = "", uppercase = false }) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full bg-[#1c2127] border border-[#3b4754] rounded-lg h-12 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[#505a6b] ${uppercase ? 'uppercase' : ''}`}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1.5">
          {error.message}
        </p>
      )}
    </div>
  );
}

function TextAreaField({ label, name, register, error, placeholder = "" }) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} <span className="text-red-400">*</span>
      </label>
      <textarea
        {...register(name)}
        rows={4}
        placeholder={placeholder}
        className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none placeholder:text-[#505a6b]"
      />
      {error && (
        <p className="text-red-400 text-xs mt-1.5">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default OrganizerApplication;