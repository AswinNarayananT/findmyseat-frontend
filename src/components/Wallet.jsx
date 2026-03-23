import React from "react";
import { FaWallet, FaPlus, FaHistory } from "react-icons/fa";

const Wallet = () => (
  <div className="flex flex-col gap-6 max-w-2xl">
    <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-900/20 text-white">
      <p className="text-sm opacity-80 font-medium uppercase tracking-widest">Available Balance</p>
      <h3 className="text-4xl font-black mt-2">$1,250.00</h3>
      <button className="mt-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-md transition-all text-sm font-bold">
        <FaPlus size={12} /> Add Funds
      </button>
    </div>
    <div className="bg-[#1c2127] border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <FaHistory /> <span className="font-bold text-sm uppercase tracking-wider">Recent Transactions</span>
      </div>
      <p className="text-slate-500 text-sm py-4 italic">No recent transactions to show.</p>
    </div>
  </div>
);

export default Wallet;