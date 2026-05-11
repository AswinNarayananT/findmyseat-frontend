import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaChartBar, 
  FaWallet, 
  FaCalendarCheck, 
  FaCheckCircle, 
  FaClock, 
  FaSpinner, 
  FaExclamationCircle 
} from "react-icons/fa";
import { fetchOrganizerRevenue, claimRevenue } from "../../store/finance/financeThunks";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Revenue = () => {
  const dispatch = useDispatch();
  const { revenue, loading, claimLoading, error } = useSelector((state) => state.finance);

  useEffect(() => {
    dispatch(fetchOrganizerRevenue());
  }, [dispatch]);

  const handleClaim = async () => {
    try {
      const result = await dispatch(claimRevenue()).unwrap();
      toast.success(`Successfully claimed ₹${result.claimed_amount.toLocaleString()}`);
      dispatch(fetchOrganizerRevenue());
    } catch (err) {
      toast.error(err || "Claim failed");
    }
  };

  if (loading && !revenue) {
    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-slate-500 gap-4">
          <FaSpinner className="animate-spin text-indigo-500" size={40} />
          <p className="text-xs font-black uppercase tracking-[0.3em]">Calculating Revenue...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const summary = revenue?.summary;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 text-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <header>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Revenue <span className="text-indigo-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-[0.3em]">
              Manage your earnings and platform commissions
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Sales</p>
              <h2 className="text-3xl font-black text-white mt-2">₹{summary?.total_gross_revenue?.toLocaleString() || "0"}</h2>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-sm">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Your Share (90%)</p>
              <h2 className="text-3xl font-black text-white mt-2">₹{summary?.total_organizer_share?.toLocaleString() || "0"}</h2>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-sm">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Platform Fee (10%)</p>
              <h2 className="text-3xl font-black text-white mt-2">₹{summary?.total_admin_commission?.toLocaleString() || "0"}</h2>
            </div>

            <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-900/20 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Ready to Claim</p>
                <h2 className="text-3xl font-black text-white mt-2">₹{summary?.total_claimable_now?.toLocaleString() || "0"}</h2>
              </div>
              <button 
                onClick={handleClaim}
                disabled={claimLoading || !summary?.total_claimable_now}
                className="mt-6 w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {claimLoading ? <FaSpinner className="animate-spin" /> : <><FaWallet /> Claim Funds</>}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-400">
              <FaChartBar size={14} />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Breakdown by Event</h3>
            </div>

            {revenue?.events?.map((event) => (
              <div key={event.event_id} className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40">
                  <div>
                    <h4 className="text-xl font-black text-white uppercase">{event.event_title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      {event.shows.length} Shows Scheduled
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Event Claimable</p>
                    <p className="text-2xl font-black text-white">₹{event.event_claimable_amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Show Date & Time</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Gross Revenue</th>
                        <th className="px-6 py-4">Your Share</th>
                        <th className="px-6 py-4">Payout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.shows.map((show) => (
                        <tr key={show.show_id} className="bg-slate-900/40 group hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 rounded-l-2xl">
                            <div className="flex items-center gap-3">
                              <FaCalendarCheck className="text-slate-600" />
                              <span className="text-sm font-bold text-slate-300">
                                {new Date(show.start_time).toLocaleString(undefined, { 
                                  dateStyle: 'medium', 
                                  timeStyle: 'short' 
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              show.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {show.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-400">
                            ₹{show.gross_revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-white">
                            ₹{show.organizer_share.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 rounded-r-2xl">
                            {show.is_payout_processed ? (
                              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                <FaCheckCircle /> Settled
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <FaClock /> Pending
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {revenue?.events?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[3rem]">
                <FaExclamationCircle className="text-slate-800 mb-4" size={40} />
                <p className="text-slate-600 font-black uppercase tracking-widest text-xs">No revenue data available yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Revenue;