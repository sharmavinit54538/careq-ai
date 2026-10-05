import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  X,
  PanelLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PatientSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  unreadCount?: number;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isAi?: boolean;
  badge?: number;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
  unreadCount = 0
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarError, setAvatarError] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      navigate('/auth/login', { replace: true });
    }
  };

  const getInitials = (name?: string): string => {
    if (!name || !name.trim()) return 'PT';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const isRouteActive = (itemPath: string) => {
    if (itemPath === '/patient/dashboard') {
      return (
        location.pathname === '/patient/dashboard' ||
        location.pathname === '/patient' ||
        location.pathname === '/patient/'
      );
    }
    return location.pathname.startsWith(itemPath);
  };

  const navItems: NavItem[] = [
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

  const secondaryNavItems: NavItem[] = [
    { name: 'My Profile', path: '/patient/profile', icon: User },
    { name: 'Settings', path: '/patient/settings', icon: Settings }
  ];

  const renderSidebarContent = (collapsed: boolean) => (
    <div className="flex h-full flex-col bg-white text-slate-800 overflow-hidden w-full">
      {/* Brand & Logo Header */}
      {collapsed ? (
        <div className="flex h-[76px] items-center justify-center border-b border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div className="flex h-[76px] items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
          <NavLink
            to="/patient/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-0"
            aria-label="CareQ AI Patient Portal"
          >
            {/* Logo Mark: Approx 44x44 - 48px, rounded, CareQ AI gradient cross */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 via-teal-500 to-sky-600 shadow-md shadow-teal-600/20 text-white flex-shrink-0">
              <svg
                className="h-6 w-6"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="7" y="13.5" width="18" height="5" rx="2.5" fill="#ffffff" />
                <rect x="13.5" y="7" width="5" height="18" rx="2.5" fill="#ffffff" />
                <path
                  d="M7 16h4l2-3 2.5 6 2-4 1.5 1h6"
                  stroke="#0d9488"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="23" cy="8" r="2.2" fill="#38bdf8" />
                <circle cx="23" cy="8" r="1.1" fill="#ffffff" />
              </svg>
            </div>

            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                  Care<span className="text-teal-600">Q</span>
                </span>
                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-teal-600 to-sky-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-2xs leading-none">
                  AI
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 tracking-tight mt-1 leading-none">
                Patient Portal
              </p>
            </div>
          </NavLink>

          <div className="flex items-center gap-1">
            {/* PanelLeft Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (onCloseMobile) {
                  onCloseMobile();
                } else {
                  setIsCollapsed(true);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              title={onCloseMobile ? 'Close sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Navigation Area */}
      <div
        className={`flex-1 overflow-y-auto space-y-6 overflow-x-hidden ${
          collapsed ? 'px-2 py-4' : 'px-4 py-4'
        }`}
      >
        {/* Primary Navigation */}
        <div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.path);

              if (collapsed) {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    title={item.name}
                    className={`relative flex items-center justify-center p-2.5 rounded-xl transition-colors duration-150 select-none ${
                      active
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-500 hover:bg-teal-50/80 hover:text-teal-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  >
                    <Icon
                      size={22}
                      className={`w-[22px] h-[22px] flex-shrink-0 transition-colors ${
                        active
                          ? 'text-white'
                          : item.isAi
                          ? 'text-teal-600'
                          : 'text-slate-400 hover:text-teal-600'
                      }`}
                    />
                    {item.isAi && !active && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                    )}
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                  </NavLink>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 select-none ${
                    active
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-teal-50/80 hover:text-teal-700'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={22}
                      className={`w-[22px] h-[22px] flex-shrink-0 transition-colors ${
                        active
                          ? 'text-white'
                          : item.isAi
                          ? 'text-teal-600'
                          : 'text-slate-400 group-hover:text-teal-600'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.isAi && !active && (
                    <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse flex-shrink-0 ml-2" />
                  )}

                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold flex-shrink-0 ml-2 ${
                        active
                          ? 'bg-white text-teal-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ACCOUNT & PREFERENCES */}
        <div>
          {!collapsed ? (
            <>
              <div className="mb-4 border-t border-slate-100" />
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none">
               
              </p>
            </>
          ) : (
            <div className="my-2 border-t border-slate-100 mx-2" />
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.path);

              if (collapsed) {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    title={item.name}
                    className={`flex items-center justify-center p-2.5 rounded-xl transition-colors duration-150 select-none ${
                      active
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-500 hover:bg-teal-50/80 hover:text-teal-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  >
                    <Icon
                      size={22}
                      className={`w-[22px] h-[22px] flex-shrink-0 transition-colors ${
                        active ? 'text-white' : 'text-slate-400 hover:text-teal-600'
                      }`}
                    />
                  </NavLink>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 select-none ${
                    active
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-teal-50/80 hover:text-teal-700'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <Icon
                    size={22}
                    className={`w-[22px] h-[22px] flex-shrink-0 transition-colors ${
                      active
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-teal-600'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile Section */}
      {collapsed ? (
        <div className="p-2.5 border-t border-slate-200 bg-slate-50/70 mt-auto flex-shrink-0 flex flex-col items-center gap-3">
          {user?.avatarUrl && !avatarError ? (
            <img
              src={user.avatarUrl}
              alt={user?.name || 'Patient'}
              onError={() => setAvatarError(true)}
              title={user?.name || 'Patient User'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20 flex-shrink-0"
            />
          ) : (
            <div
              title={user?.name || 'Patient User'}
              className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-xs tracking-wider flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ring-teal-500/20"
            >
              {getInitials(user?.name)}
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 mt-auto flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatarUrl && !avatarError ? (
              <img
                src={user.avatarUrl}
                alt={user?.name || 'Patient'}
                onError={() => setAvatarError(true)}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/20 flex-shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-teal-600 text-white font-bold text-sm tracking-wider flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ring-teal-500/20">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                {user?.name || 'Patient User'}
              </p>
              <p className="text-xs text-slate-500 truncate leading-tight mt-1">
                {user?.email || 'patient@careq.ai'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-150"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Locked Sidebar - In-flow spacer placeholder to reserve width */}
      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-200 ${
          isCollapsed
            ? 'w-[76px] min-w-[76px] max-w-[76px]'
            : 'w-[270px] min-w-[270px] max-w-[270px]'
        }`}
        aria-hidden="true"
      />

      {/* Desktop Fixed Locked Sidebar - 100% locked to viewport, never scrolls away */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 h-screen flex-col border-r border-slate-200 bg-white z-30 select-none overflow-hidden transition-all duration-200 ${
          isCollapsed
            ? 'w-[76px] min-w-[76px] max-w-[76px]'
            : 'w-[270px] min-w-[270px] max-w-[270px]'
        }`}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>

      {/* Mobile Drawer Backdrop and Slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 w-[270px] max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col h-full overflow-hidden">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
};


