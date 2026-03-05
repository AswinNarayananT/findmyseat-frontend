import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../store/event/eventThunk";
import { Upload, Clock, Tag, IndianRupee, Info, CheckCircle2 } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  entry_type: z.enum(["GENERAL", "SEAT_WISE"]),
  category: z.enum(["CONCERT", "STANDUP", "WORKSHOP", "EXPO", "OTHER"]).default("OTHER"),
  estimated_duration_minutes: z.number().min(1, "Duration is required"),
  base_price: z.number().min(1, "Price must be greater than 0"),
  imageFile: z.any().optional(),
});

export default function CreateEvent() {
  const dispatch = useDispatch();
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

  const onSubmit = (data) => {
    const eventData = {
      ...data,
      imageFile: data.imageFile?.[0],
    };

    dispatch(createEvent(eventData));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-10 font-sans antialiased">
      <div className="max-w-6xl mx-auto">

        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Create Your Event
          </h1>
          <p className="text-gray-400 mt-2">
            Provide all details so your audience knows what to expect.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >

          {/* Image Upload */}
          <div className="lg:col-span-5 space-y-6">
            <div className="group relative cursor-pointer border-2 border-dashed border-gray-700 hover:border-pink-500 transition-all rounded-2xl overflow-hidden bg-[#1a1a1a] h-[500px] flex flex-col items-center justify-center">

              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="bg-white text-black px-4 py-2 rounded-full font-medium">
                      Change Poster
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                    <Upload className="text-pink-500" size={32} />
                  </div>

                  <h3 className="text-lg font-semibold">
                    Add Event Poster (Optional)
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Recommended: 400x600 (Portrait)
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
              <p className="text-red-400 text-sm">
                {errors.imageFile.message}
              </p>
            )}
          </div>

          {/* Event Details */}
          <div className="lg:col-span-7 space-y-8 bg-[#1a1a1a] p-8 rounded-2xl shadow-xl">

            {/* Basic Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-pink-500 font-semibold uppercase text-xs tracking-widest">
                <Info size={16} />
                <span>Basic Details</span>
              </div>

              <input
                {...register("title")}
                placeholder="Event Title"
                className="w-full bg-transparent text-3xl font-bold border-b border-gray-700 focus:border-pink-500 outline-none pb-2 placeholder:text-gray-600"
              />

              {errors.title && (
                <p className="text-red-400 text-xs">
                  {errors.title.message}
                </p>
              )}

              <textarea
                {...register("description")}
                placeholder="Event Description (Optional)"
                className="w-full bg-[#242424] rounded-xl p-4 text-gray-300 border border-transparent focus:border-gray-600 outline-none h-32 resize-none"
              />

            </section>

            {/* Config Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Tag size={14} />
                  Category
                </label>

                <select
                  {...register("category")}
                  className="w-full bg-[#242424] p-3 rounded-lg border border-gray-700 outline-none focus:ring-2 ring-pink-500/20"
                >
                  <option value="CONCERT">Concert</option>
                  <option value="STANDUP">Standup Comedy</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="EXPO">Expo</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Clock size={14} />
                  Duration (Minutes)
                </label>

                <input
                  type="number"
                  {...register("estimated_duration_minutes", {
                    valueAsNumber: true,
                  })}
                  className="w-full bg-[#242424] p-3 rounded-lg border border-gray-700 outline-none focus:ring-2 ring-pink-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <IndianRupee size={14} />
                  Base Price
                </label>

                <input
                  type="number"
                  {...register("base_price", {
                    valueAsNumber: true,
                  })}
                  className="w-full bg-[#242424] p-3 rounded-lg border border-gray-700 outline-none focus:ring-2 ring-pink-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Entry Type
                </label>

                <select
                  {...register("entry_type")}
                  className="w-full bg-[#242424] p-3 rounded-lg border border-gray-700 outline-none focus:ring-2 ring-pink-500/20"
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
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-900/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Confirm & Create Event
                </>
              )}
            </button>

            {error && (
              <p className="text-red-400 text-center text-sm bg-red-400/10 py-2 rounded-lg">
                {error}
              </p>
            )}

          </div>
        </form>
      </div>
    </div>
  );
}