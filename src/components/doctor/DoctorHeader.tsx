import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  UserCheck,
  Settings,
  LogOut,
  ShieldCheck,
  Clock,
  X,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { DoctorNotification } from '../../types/doctor';

interface DoctorHeaderProps {
  pageTitle: string;
  onOpenMobileSidebar: () => void;
  notifications: DoctorNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  pageTitle,
  onOpenMobileSidebar,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const isApproved = user?.doctorProfile?.verificationStatus === 'approved';

  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      navigate('/auth/login', { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctor/patients?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
      {/* Left: Mobile hamburger & Active Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{pageTitle}</span>
            {isApproved ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck size={12} /> Verified Practice
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Clock size={12} /> Pending Verification
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Telehealth, Doctor Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
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

        {/* Telehealth Consultations Link */}
        <Link
          to="/doctor/consultations"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100/80 rounded-xl border border-teal-200 transition-colors"
          title="Go to Consultations Room"
        >
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>Consultations</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
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

        {/* Doctor Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-expanded={profileDropdownOpen}
          >
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr. Doctor')}&background=0d9488&color=fff`
              }
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-teal-500"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {user?.name || 'Dr. Evelyn Reed'}
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-tight">
                {user?.doctorProfile?.specialization || 'Cardiology & Internal Medicine'}
              </span>
            </div>
            <ChevronDown size={15} className="text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  <ShieldCheck size={13} />
                  <span>{user?.doctorProfile?.qualification || 'Licensed MD'}</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/doctor/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                >
                  <UserCheck size={16} className="text-slate-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/doctor/schedule"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                >
                  <Calendar size={16} className="text-slate-400" />
                  <span>Schedule & Availability</span>
                </Link>

                <Link
                  to="/doctor/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                >
                  <Settings size={16} className="text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 w-full text-left font-medium cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
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
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
