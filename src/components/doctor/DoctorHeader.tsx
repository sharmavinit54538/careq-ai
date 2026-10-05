import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { DoctorNotification } from '../../types/doctor';

interface DoctorHeaderProps {
  pageTitle?: string;
  onOpenMobileSidebar: () => void;
  notifications: DoctorNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  onOpenMobileSidebar,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead
}) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctor/patients?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Right: Search, Theme Toggle, Consultations, Notifications */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients, records..."
                className="w-48 lg:w-72 pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder-slate-400"
              />
            </div>
          </form>
        </div>

        {/* Mobile Search Toggle */}
        <button
          type="button"
          onClick={() => setSearchOpen((prev) => !prev)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* Theme Toggle (Light / Night Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </button>

        {/* Consultations / Messages Quick Link */}
        <Link
          to="/doctor/consultations"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors cursor-pointer"
          title="Teleconsultations & Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
        </Link>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-teal-100 text-teal-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsAsRead}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-800 cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationAsRead(notif.id);
                        if (notif.actionUrl) {
                          navigate(notif.actionUrl);
                          setNotificationsOpen(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                        !notif.isRead ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          !notif.isRead ? 'bg-teal-500' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {notif.title}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 text-center">
                <Link
                  to="/doctor/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-block py-1"
                >
                  View all notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-0 h-[72px] bg-white border-b border-slate-200 px-4 flex items-center z-30 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, appointments, records..."
              className="flex-1 py-2 text-sm bg-transparent outline-none text-slate-900"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
