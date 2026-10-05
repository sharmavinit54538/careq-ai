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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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
  collapsed: externalCollapsed,
  onToggleCollapse,
  unreadCount = 0
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarError, setAvatarError] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Close profile menu whenever location changes
  useEffect(() => {
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

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

  const careManagementNavItems: NavItem[] = [
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

  const renderSidebarContent = (collapsedState: boolean, isMobile: boolean) => (
    <div className="relative flex h-full flex-col bg-white text-slate-800 w-full select-none text-xs">
      {/* Brand & Toggle Header */}
      {collapsedState ? (
        <div className="flex h-14 items-center justify-center border-b border-slate-100 flex-shrink-0 px-2">
          <button
            type="button"
            onClick={handleToggle}
            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div className="flex h-14 items-center justify-between px-3.5 border-b border-slate-100 flex-shrink-0">
          <NavLink
            to="/patient/dashboard"
            onClick={isMobile ? onCloseMobile : undefined}
            className="flex items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-0"
            aria-label="CareQ Patient Portal"
          >
            {/* Compact Logo Mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 via-teal-500 to-sky-600 shadow-xs text-white flex-shrink-0">
              <svg
                className="h-4 w-4"
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
          </NavLink>

          <div className="flex items-center gap-1">
            {/* PanelLeft Toggle Button */}
            <button
              type="button"
              onClick={isMobile ? onCloseMobile : handleToggle}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors cursor-pointer"
              title={isMobile ? 'Close sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" strokeWidth={2} />
            </button>

            {/* Mobile close button */}
            {isMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Area */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden ${
          collapsedState ? 'px-2 py-3 space-y-4' : 'px-2.5 py-3 space-y-1'
        }`}
      >
        {collapsedState ? (
          /* Collapsed Icons Only */
          <>
            <nav className="space-y-1">
              {careManagementNavItems.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={isMobile ? onCloseMobile : undefined}
                    title={item.name}
                    className={`relative flex items-center justify-center w-full h-9 rounded-lg transition-colors duration-150 select-none ${
                      active
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  >
                    <Icon
                      size={18}
                      className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                        active
                          ? 'text-white'
                          : item.isAi
                          ? 'text-teal-600'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    />
                    {item.isAi && !active && (
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                    )}
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-1 ring-white" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </>
        ) : (
          /* Expanded Full Navigation */
          <div>
            <nav className="space-y-1">
              {careManagementNavItems.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={`group flex items-center justify-between h-9 px-3 rounded-lg transition-colors duration-150 select-none ${
                      active
                        ? 'bg-teal-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        size={18}
                        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                          active
                            ? 'text-white'
                            : item.isAi
                            ? 'text-teal-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span
                        className={`truncate text-[13px] font-medium leading-none ${
                          active ? 'text-white font-semibold' : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {item.isAi && !active && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse flex-shrink-0 ml-2" />
                    )}

                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-bold flex-shrink-0 ml-2 ${
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
        )}
      </div>

      {/* Bottom User Profile Section */}
      <div className="relative p-2 border-t border-slate-200/80 bg-white mt-auto flex-shrink-0">
        {/* Invisible Backdrop for click-outside */}
        {profileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-transparent cursor-default"
            onClick={() => setProfileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Profile Popover Menu */}
        {profileMenuOpen && (
          <div
            className={`absolute z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 transition-all duration-150 animate-in fade-in slide-in-from-bottom-2 ${
              collapsedState
                ? 'bottom-2 left-[62px] w-48'
                : 'bottom-[calc(100%+8px)] left-2 right-2'
            }`}
          >
            {/* User Info Header */}
            <div className="px-2.5 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {user?.name || 'vinit sharma'}
              </p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {user?.email || 'patient@careq.ai'}
              </p>
            </div>

            {/* Menu Links */}
            <div className="py-1 space-y-0.5">
              <NavLink
                to="/patient/profile"
                onClick={() => {
                  setProfileMenuOpen(false);
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <User className="h-3.5 w-3.5 text-teal-600" />
                <span>My Profile</span>
              </NavLink>

              <NavLink
                to="/patient/settings"
                onClick={() => {
                  setProfileMenuOpen(false);
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Settings className="h-3.5 w-3.5 text-slate-500" />
                <span>Settings</span>
              </NavLink>
            </div>

            {/* Sign Out Action */}
            <div className="border-t border-slate-100 pt-1 mt-0.5">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Trigger Button */}
        {collapsedState ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              title={user?.name || 'vinit sharma'}
              aria-expanded={profileMenuOpen}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                profileMenuOpen
                  ? 'ring-2 ring-teal-500 bg-teal-50'
                  : 'hover:ring-2 hover:ring-slate-200'
              }`}
            >
              {user?.avatarUrl && !avatarError ? (
                <img
                  src={user.avatarUrl}
                  alt={user?.name || 'Patient'}
                  onError={() => setAvatarError(true)}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs tracking-wider flex items-center justify-center shadow-xs">
                  {getInitials(user?.name)}
                </div>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            aria-expanded={profileMenuOpen}
            className={`w-full flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
              profileMenuOpen
                ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-500/20'
                : 'bg-slate-50/90 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            {user?.avatarUrl && !avatarError ? (
              <img
                src={user.avatarUrl}
                alt={user?.name || 'Patient'}
                onError={() => setAvatarError(true)}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs tracking-wider flex items-center justify-center flex-shrink-0 shadow-xs">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate block leading-tight">
                {user?.name || 'vinit sharma'}
              </span>
              <span className="text-[10px] text-slate-500 truncate block leading-tight mt-0.5">
                Patient Account
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Locked Sidebar - In-flow spacer placeholder to reserve width */}
      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-200 ease-in-out ${
          isCollapsed
            ? 'w-[58px] min-w-[58px] max-w-[58px]'
            : 'w-[190px] min-w-[190px] max-w-[190px]'
        }`}
        aria-hidden="true"
      />

      {/* Desktop Fixed Locked Sidebar - 100% locked to viewport, never scrolls away */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 h-screen flex-col border-r border-slate-200/80 bg-white z-30 select-none transition-all duration-200 ease-in-out ${
          isCollapsed
            ? 'w-[58px] min-w-[58px] max-w-[58px]'
            : 'w-[190px] min-w-[190px] max-w-[190px]'
        }`}
      >
        {renderSidebarContent(isCollapsed, false)}
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
          <div className="fixed inset-y-0 left-0 w-[190px] max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col h-full overflow-hidden">
            {renderSidebarContent(false, true)}
          </div>
        </div>
      )}
    </>
  );
};
