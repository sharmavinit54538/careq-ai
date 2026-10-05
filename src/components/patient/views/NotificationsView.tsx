import React from 'react';
import { Bell, Calendar, CheckCircle2, Pill, FileText, AlertCircle } from 'lucide-react';
import type { PatientNotification } from '../../../types/patient';

interface NotificationsViewProps {
  notifications: PatientNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: PatientNotification['type']) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="h-5 w-5 text-teal-600" />;
      case 'report':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'prescription':
        return <Pill className="h-5 w-5 text-emerald-600" />;
      case 'cancellation':
        return <AlertCircle className="h-5 w-5 text-rose-600" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Notifications Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated with clinical reminders, appointment confirmations, and lab results.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs self-start sm:self-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Bell className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No notifications at this time
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            We will alert you when you have scheduled appointments or new clinical test results.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`flex items-start gap-4 rounded-3xl border p-5 transition-all cursor-pointer ${
                notif.isRead
                  ? 'border-slate-200 bg-white hover:border-slate-300'
                  : 'border-teal-200 bg-teal-50/40 hover:bg-teal-50 shadow-xs'
              }`}
            >
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
                  notif.isRead ? 'bg-slate-100' : 'bg-white shadow-2xs'
                }`}
              >
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {notif.title}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                    {new Date(notif.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
