import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  MessageSquare,
  Pill,
  FileText,
  Heart,
  Bot,
  Bell,
  User,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PatientSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  unreadCount?: number;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
  unreadCount = 0
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Find Doctors', path: '/patient/doctors', icon: UserCheck },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Consultations', path: '/patient/consultations', icon: MessageSquare },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
    { name: 'Medical Records', path: '/patient/medical-records', icon: FileText },
    { name: 'Health', path: '/patient/health', icon: Heart },
    { name: 'CareQ AI Assistant', path: '/patient/ai-assistant', icon: Bot, isAi: true },
    { name: 'Notifications', path: '/patient/notifications', icon: Bell, badge: unreadCount }
  ];

  const secondaryNavItems = [
    { name: 'My Profile', path: '/patient/profile', icon: User },
    { name: 'Settings', path: '/patient/settings', icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-slate-800 border-r border-slate-200">
      {/* Brand & Logo Header */}
      <div>
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
          <NavLink
            to="/patient/dashboard"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
          >
            {/* Logo Mark */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 via-teal-500 to-sky-600 shadow-md shadow-teal-500/20 text-white flex-shrink-0">
              <svg
                className="h-6 w-6"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="7" y="13.5" width="18" height="5" rx="2.5" fill="currentColor" />
                <rect x="13.5" y="7" width="5" height="18" rx="2.5" fill="currentColor" />
                <path
                  d="M7 16h4l2-3 2.5 6 2-4 1.5 1h6"
                  stroke="#0f766e"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="23" cy="8" r="2.2" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                  Care<span className="text-teal-600">Q</span>
                </span>
                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-teal-600 to-sky-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-xs">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-600 tracking-tight">Patient Portal</p>
            </div>
          </NavLink>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Primary Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Care Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : item.isAi
                            ? 'text-sky-500'
                            : 'text-slate-600 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.isAi && !isActive && (
                      <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                    )}

                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                          isActive
                            ? 'bg-white text-teal-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="mt-6 px-3">
          <div className="my-2 border-t border-slate-200" />
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Account & Preferences
          </p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-700/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500`
                  }
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60">
        <div className="mb-3 flex items-center gap-3 px-2 py-1">
          <img
            src={
              user?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'Patient'
              )}&background=0d9488&color=fff`
            }
            alt={user?.name || 'Patient'}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500/30 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-600">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-white shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
