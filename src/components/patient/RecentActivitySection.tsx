import React from 'react';
import {
  Activity,
  Calendar,
  Pill,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import type { PatientActivity } from '../../types/patient';

interface RecentActivitySectionProps {
  activities: PatientActivity[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  activities,
  isLoading,
  isError,
  onRetry
}) => {
  const getActivityIcon = (type: PatientActivity['type']) => {
    switch (type) {
      case 'appointment_booked':
        return <Calendar className="h-3.5 w-3.5 text-teal-600" />;
      case 'appointment_completed':
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />;
      case 'prescription_added':
        return <Pill className="h-3.5 w-3.5 text-sky-600" />;
      case 'medical_report_uploaded':
        return <FileText className="h-3.5 w-3.5 text-indigo-600" />;
      case 'profile_updated':
        return <User className="h-3.5 w-3.5 text-amber-600" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-teal-600" />;
    }
  };

  const formatActivityTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-bold text-slate-900">
            Recent Activity
          </h3>
          <p className="text-[11px] font-medium text-slate-600">
            Audit log of clinical events and patient updates
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-slate-100" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
          <p className="text-sm font-bold text-rose-900">
            Unable to load recent activity.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-rose-700 border border-rose-300 shadow-xs hover:bg-rose-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && activities.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <Clock className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-700">No recent activity.</p>
          <p className="text-xs text-slate-600 mt-1">
            Your clinical actions and updates will appear chronologically here.
          </p>
        </div>
      )}

      {/* Activities Timeline */}
      {!isLoading && !isError && activities.length > 0 && (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="relative group">
              {/* Dot Icon Indicator */}
              <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-slate-100 shadow-2xs">
                {getActivityIcon(act.type)}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {act.title}
                </p>
                <span className="text-[10px] sm:text-xs font-medium text-slate-600 whitespace-nowrap">
                  {formatActivityTime(act.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-normal">
                {act.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
