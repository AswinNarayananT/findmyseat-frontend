import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyEvents } from "../../store/event/eventThunk";
import { PlusCircle, Eye, LayoutGrid } from "lucide-react";

export default function MyEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getMyEvents());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-700 border-t-pink-500 rounded-full animate-spin"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">My Events</h1>

          <button
            onClick={() => navigate("/create-event")}
            className="flex items-center gap-2 bg-pink-600 px-5 py-2 rounded-lg hover:bg-pink-500"
          >
            <PlusCircle size={18}/>
            Create Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No events created yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800"
              >

                <img
                  src={event.image_url || "https://placehold.co/600x800"}
                  alt={event.title}
                  className="h-64 w-full object-cover"
                />

                <div className="p-5 space-y-3">

                  <h2 className="text-xl font-semibold">
                    {event.title}
                  </h2>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{event.category}</span>
                    <span>{event.estimated_duration_minutes} mins</span>
                  </div>

                  <div className="flex gap-3 pt-4">

                    <button
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg"
                    >
                      <Eye size={16}/>
                      Details
                    </button>

                    <button
                      onClick={() => navigate(`/create-event-show/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 py-2 rounded-lg"
                    >
                      <PlusCircle size={16}/>
                      Add Show
                    </button>

                  </div>

                  <button
                    onClick={() => navigate(`/event-layout/${event.id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg mt-2"
                  >
                    <LayoutGrid size={16}/>
                    Create Layout
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}