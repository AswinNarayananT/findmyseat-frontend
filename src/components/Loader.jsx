import React from "react";
import { Ticket, Search } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-50">
      <div className="relative">
        <div className="relative bg-blue-600 p-4 rounded-xl shadow-xl animate-bounce">
          <Ticket className="w-16 h-16 text-white" strokeWidth={1.5} />
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_8px_#ef4444] animate-[scan_2s_linear_infinite]" />
        </div>
        
        <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md animate-pulse">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Just a Sec
        </h2>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-[bounce_1s_infinite_100ms]"></span>
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-[bounce_1s_infinite_300ms]"></span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { top: 50%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default Loader;