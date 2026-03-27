import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../store/event/eventThunk";
import { Upload, Clock, Tag, IndianRupee, Info, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  entry_type: z.enum(["GENERAL", "SEAT_WISE"]),
  category: z.enum(["CONCERT", "STANDUP", "WORKSHOP", "EXPO", "OTHER"]).default("OTHER"),
  estimated_duration_minutes: z.number().min(1, "Duration is required"),
  base_price: z.number().min(0, "Price must be 0 or greater"),
  imageFile: z.any().optional(),
});

export default function CreateEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.event);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      entry_type: "GENERAL",
      category: "OTHER",
      base_price: 0,
      estimated_duration_minutes: 60
    },
  });

  const watchImage = watch("imageFile");

  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const onSubmit = async (data) => {
    const eventData = {
      ...data,
      imageFile: data.imageFile?.[0],
    };

    try {
      const result = await dispatch(createEvent(eventData)).unwrap();
      toast.success("Event created successfully!");
      // Navigate to the dynamic show creation link using the returned ID
      navigate(`/create-event-show/${result.id}`);
    } catch (err) {
      toast.error(err || "Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200">
      <Navbar />

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Host an <span className="text-indigo-600">Event</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 uppercase text-xs tracking-widest">
              Stage your performance • Manage your audience • Grow your brand
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Left Column: Image Upload */}
            <div className="lg:col-span-5 space-y-6">
              <div className="group relative cursor-pointer border-2 border-dashed border-slate-800 hover:border-indigo-600/50 transition-all rounded-[40px] overflow-hidden bg-slate-900/40 h-[600px] flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="bg-white text-black px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest">
                        Change Poster
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-10 space-y-4">
                    <div className="bg-indigo-600/10 p-6 rounded-3xl inline-block group-hover:scale-110 transition-transform">
                      <Upload className="text-indigo-500" size={40} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      Upload Poster
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                      Recommended: Portrait (400x600)
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  {...register("imageFile")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {errors.imageFile && (
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                  {errors.imageFile.message}
                </p>
              )}
            </div>

            {/* Right Column: Event Details */}
            <div className="lg:col-span-7 space-y-8 bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[48px] shadow-2xl backdrop-blur-sm">
              
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-[0.3em]">
                  <Info size={16} />
                  <span>The Basics</span>
                </div>

                <div className="space-y-2">
                  <input
                    {...register("title")}
                    placeholder="WHAT IS THE EVENT CALLED?"
                    className="w-full bg-transparent text-3xl font-black border-b-2 border-slate-800 focus:border-indigo-600 outline-none pb-4 placeholder:text-slate-800 transition-all uppercase tracking-tighter text-white"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <textarea
                  {...register("description")}
                  placeholder="Tell your audience about the experience..."
                  className="w-full bg-slate-950/50 rounded-3xl p-6 text-slate-300 border border-slate-800 focus:border-indigo-600 outline-none h-40 resize-none font-medium text-sm transition-all"
                />
              </section>

              {/* Configuration Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} className="text-indigo-500" />
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm appearance-none"
                  >
                    <option value="CONCERT">Concert</option>
                    <option value="STANDUP">Standup Comedy</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="EXPO">Expo</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} className="text-indigo-500" />
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    {...register("estimated_duration_minutes", { valueAsNumber: true })}
                    className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <IndianRupee size={14} className="text-indigo-500" />
                    Base Price
                  </label>
                  <input
                    type="number"
                    {...register("base_price", { valueAsNumber: true })}
                    className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Booking Mode
                  </label>
                  <select
                    {...register("entry_type")}
                    className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm appearance-none"
                  >
                    <option value="GENERAL">General Entry</option>
                    <option value="SEAT_WISE">Seat Wise</option>
                  </select>
                </div>
              </section>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Launch Event
                  </>
                )}
              </button>

              {error && (
                <p className="text-red-400 text-center text-[10px] font-black uppercase tracking-widest bg-red-400/10 py-3 rounded-xl border border-red-400/20">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}