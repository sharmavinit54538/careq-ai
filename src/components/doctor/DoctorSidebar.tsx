import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Video,
  Pill,
  FileText,
  Clock,
  BarChart3,
  IndianRupee,
  Bell,
  Sparkles,
  UserCheck,
  Settings,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { CareQLogo } from '../common/CareQLogo';
import { useAuth } from '../../context/AuthContext';

interface DoctorSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  unreadCount?: number;
}

interface NavItemConfig {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
  isAi?: boolean;
}

interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
  unreadCount = 0
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent background scroll when mobile drawer is open
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

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      navigate('/auth/login', { replace: true });
    }
  };

  const navSections: NavSection[] = [
    {
      title: 'CLINICAL MANAGEMENT',
      items: [
        { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
        { name: 'My Patients', path: '/doctor/patients', icon: Users },
        { name: 'Consultations', path: '/doctor/consultations', icon: Video },
        { name: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
        { name: 'Medical Records', path: '/doctor/medical-records', icon: FileText },
        { name: 'Schedule & Availability', path: '/doctor/schedule', icon: Clock }
      ]
    },
    {
      title: 'PRACTICE',
      items: [
        { name: 'Analytics', path: '/doctor/analytics', icon: BarChart3 },
        { name: 'Earnings', path: '/doctor/earnings', icon: IndianRupee },
        { name: 'Notifications', path: '/doctor/notifications', icon: Bell, badge: unreadCount },
        { name: 'CareQ AI Assistant', path: '/doctor/ai-assistant', icon: Sparkles, isAi: true }
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'My Profile', path: '/doctor/profile', icon: UserCheck },
        { name: 'Settings', path: '/doctor/settings', icon: Settings }
      ]
    }
  ];

  const isItemActive = (path: string): boolean => {
    if (path === '/doctor/dashboard') {
      return location.pathname === '/doctor/dashboard' || location.pathname === '/doctor';
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 min-h-[72px]">
        {!collapsed ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CareQLogo size="sm" clickable={false} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Doctor Portal
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Smarter Healthcare
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <CareQLogo size="sm" clickable={false} />
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          )}

          {/* Mobile Drawer Close */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed ? (
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
            ) : (
              <div className="w-6 h-0.5 bg-slate-200 mx-auto my-2 rounded-full" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isItemActive(item.path);
                const IconComponent = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`group relative flex items-center ${
                      collapsed ? 'justify-center px-2' : 'px-4'
                    } py-3 rounded-xl transition-all duration-150 min-h-[48px] ${
                      active
                        ? 'bg-teal-600 text-white font-semibold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <IconComponent
                      size={22}
                      className={`flex-shrink-0 transition-transform ${
                        active
                          ? 'text-white'
                          : item.isAi
                          ? 'text-teal-600 group-hover:scale-110'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    />

                    {!collapsed && (
                      <span className="ml-3 text-[16px] truncate flex-1">
                        {item.name}
                      </span>
                    )}

                    {!collapsed && item.isAi && (
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-teal-100 text-teal-800 border border-teal-200'
                        }`}
                      >
                        AI
                      </span>
                    )}

                    {!collapsed && Boolean(item.badge && item.badge > 0) && (
                      <span
                        className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                          active
                            ? 'bg-white text-teal-700'
                            : 'bg-teal-600 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && Boolean(item.badge && item.badge > 0) && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-teal-600 border-2 border-white rounded-full" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor User Footer & Sign Out */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 mt-auto">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr. Doctor')}&background=0d9488&color=fff`
              }
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border border-teal-200 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-800 truncate">
                {user?.name || 'Doctor'}
              </div>
              <div className="text-[11px] text-teal-600 font-semibold truncate">
                {user?.doctorProfile?.specialization || 'Physician'}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          className={`flex items-center ${
            collapsed ? 'justify-center px-2' : 'px-4'
          } py-3 w-full rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors font-medium min-h-[48px] cursor-pointer`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="ml-3 text-[16px]">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen min-h-screen sticky top-0 z-30 transition-all duration-300 ${
          collapsed ? 'w-[80px]' : 'w-[280px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Offcanvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[285px] max-w-[85vw] transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
