import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Calendar,
  FileText,
  CreditCard,
  AlertCircle,
  Clock,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import type { DoctorNotification, DoctorNotificationType } from '../../../types/doctor';

interface DoctorNotificationsViewProps {
  notifications: DoctorNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const DoctorNotificationsView: React.FC<DoctorNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}) => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderIcon = (type: DoctorNotificationType) => {
    switch (type) {
      case 'appointment_request':
        return <Calendar size={18} className="text-teal-600" />;
      case 'reminder':
        return <Clock size={18} className="text-sky-600" />;
      case 'report_uploaded':
        return <FileText size={18} className="text-purple-600" />;
      case 'payment_received':
        return <CreditCard size={18} className="text-emerald-600" />;
      case 'admin_message':
        return <ShieldCheck size={18} className="text-indigo-600" />;
      case 'cancellation':
        return <AlertCircle size={18} className="text-rose-600" />;
      default:
        return <Bell size={18} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Clinical Alerts &amp; Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding patient consultation requests, diagnostic reports, and medical compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Mark All as Read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-xl border border-slate-200"
              title="Clear all notifications"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'appointment_request', label: 'Appointment Requests' },
          { id: 'report_uploaded', label: 'Diagnostic Reports' },
          { id: 'payment_received', label: 'Payments' },
          { id: 'admin_message', label: 'System & Compliance' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
              <Bell size={28} />
            </div>
            <h3 className="font-bold text-slate-800">No notifications found.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are all caught up on your practice alerts and patient updates.
            </p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onMarkAsRead(notif.id);
                if (notif.actionUrl) {
                  navigate(notif.actionUrl);
                }
              }}
              className={`bg-white rounded-2xl p-5 border shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-start gap-4 ${
                !notif.isRead
                  ? 'border-teal-300 bg-teal-50/20'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex-shrink-0 mt-0.5">
                {renderIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{notif.title}</span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                    )}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
