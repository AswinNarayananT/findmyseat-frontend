import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaPlus, 
  FaHistory, 
  FaArrowDown, 
  FaArrowUp, 
  FaSpinner, 
  FaExclamationTriangle,
  FaChevronDown
} from "react-icons/fa";
import { fetchMyWallet } from "../store/finance/financeThunks";

const Wallet = () => {
  const dispatch = useDispatch();
  const { data, transactions, loading, error, hasMore } = useSelector((state) => state.finance);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyWallet({ page: 1, size: 10 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(fetchMyWallet({ page: nextPage, size: 10 }));
  };

  if (loading && page === 1 && !data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500 gap-4">
        <FaSpinner className="animate-spin text-indigo-500" size={32} />
        <p className="text-xs font-black uppercase tracking-widest">Syncing Wallet...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl animate-in fade-in duration-500">
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-700 shadow-2xl shadow-indigo-900/20 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] opacity-70 font-black uppercase tracking-[0.2em]">Available Balance</p>
          <h3 className="text-5xl font-black mt-2 tracking-tighter">
            ₹{data?.balance?.toLocaleString() || "0.00"}
          </h3>
          <button className="mt-8 flex items-center gap-2 bg-white text-indigo-600 hover:scale-105 active:scale-95 px-6 py-3 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-lg">
            <FaPlus size={10} /> Add Funds
          </button>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-[#0f172a] border border-slate-800/50 rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-slate-400">
            <FaHistory size={14} />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Transaction History</span>
          </div>
        </div>

        <div className="space-y-4">
          {transactions && transactions.length > 0 ? (
            <>
              {transactions.map((tx) => {
                const isCredit = tx.receiver_wallet_id === data?.id;
                
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800/30 hover:border-indigo-500/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isCredit 
                          ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' 
                          : 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'
                      }`}>
                        {isCredit ? <FaArrowDown size={14} /> : <FaArrowUp size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 capitalize">
                          {tx.tx_type?.replace('_', ' ') || 'Transaction'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {tx.created_at ? new Date(tx.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Recent'}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-black ${isCredit ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isCredit ? '+' : '-'} ₹{tx.amount?.toLocaleString()}
                    </div>
                  </div>
                );
              })}

              {hasMore && (
                <button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full py-4 mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaChevronDown /> Load More Transactions
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <FaHistory size={24} className="mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest italic">
                No activity yet
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 flex items-center justify-center gap-3">
          <FaExclamationTriangle size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Wallet;