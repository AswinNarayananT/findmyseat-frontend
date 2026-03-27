import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Bell, Check, Trash2, Info } from "lucide-react";

const NotificationCenter = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

useEffect(() => {
  if (!isAuthenticated || !user) return;

  let socket = null;
  let isComponentMounted = true;
  let reconnectTimeout = null;

  const connect = () => {
    // Small delay to avoid Strict Mode race conditions
    reconnectTimeout = setTimeout(() => {
      if (!isComponentMounted) return;

      socket = new WebSocket(`ws://localhost:8000/api/v1/notifications/ws/${user.id}`);

      socket.onopen = () => {
        if (isComponentMounted) console.log("🚀 WebSocket Connected");
      };

      socket.onmessage = (event) => {
        if (!isComponentMounted) return;
        const data = JSON.parse(event.data);
        const newNotification = {
          id: Date.now(),
          title: data.title,
          message: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: data.type || "INFO"
        };
        setNotifications((prev) => [newNotification, ...prev]);
      };

      socket.onerror = (error) => {
        // Only log error if the component is still alive
        if (isComponentMounted) console.error("❌ WebSocket Error Observed");
      };

      socket.onclose = (e) => {
        if (isComponentMounted) console.log("🔌 WebSocket Disconnected", e.reason);
      };
    }, 100); // 100ms delay is usually enough
  };

  connect();

  return () => {
    isComponentMounted = false;
    clearTimeout(reconnectTimeout);
    if (socket) {
      // Check readyState: 0 (CONNECTING), 1 (OPEN)
      if (socket.readyState === 0 || socket.readyState === 1) {
        socket.close();
      }
    }
  };
}, [isAuthenticated, user]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => setNotifications([]);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL ICON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-300 ${
          isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-indigo-500 text-[10px] font-black text-white rounded-full ring-2 ring-[#020617] animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Alerts</h3>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="bg-slate-950 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
                  <Bell size={20} className="text-slate-700" />
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No new updates</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 border-b border-slate-800/50 cursor-pointer transition-colors relative group ${!n.read ? 'bg-indigo-600/5' : 'hover:bg-slate-800/30'}`}
                >
                  {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.read ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
                    <div className="space-y-1 pr-4">
                      <p className={`text-xs font-black uppercase tracking-tight ${!n.read ? 'text-white' : 'text-slate-500'}`}>{n.title}</p>
                      <p className="text-[11px] font-medium text-slate-400 leading-relaxed">{n.message}</p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase mt-2">{n.time}</p>
                    </div>
                  </div>
                  {!n.read && (
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check size={14} className="text-indigo-500" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 bg-slate-950/50 text-center">
             <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">FindMySeat Real-time</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;