import React from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import type { Appointment } from '../../types/patient';

interface UpcomingAppointmentSectionProps {
  appointment: Appointment | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onFindDoctor: () => void;
  onJoinConsultation: (appointment: Appointment) => void;
  onViewDetails: (appointment: Appointment) => void;
}

export const UpcomingAppointmentSection: React.FC<UpcomingAppointmentSectionProps> = ({
  appointment,
  isLoading,
  isError,
  onRetry,
  onFindDoctor,
  onJoinConsultation,
  onViewDetails
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Calendar className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-heading font-bold text-slate-900">
            Upcoming Appointment
          </h3>
        </div>

        {appointment && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="capitalize">{appointment.status}</span>
          </span>
        )}
      </div>

      {/* Loading State: Skeleton */}
      {isLoading && (
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 rounded-md bg-slate-200" />
              <div className="h-4 w-32 rounded-md bg-slate-100" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
          </div>
          <div className="h-10 rounded-xl bg-slate-200 w-full" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
          <p className="text-sm font-bold text-rose-900">
            Unable to load your appointments.
          </p>
          <p className="text-xs text-rose-700 mt-1">
            Please check your network connection and try again.
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
      {!isLoading && !isError && !appointment && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            No upcoming appointments
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Find a doctor and book your next consultation. CareQ AI makes scheduling easy and fast.
          </p>
          <button
            type="button"
            onClick={onFindDoctor}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          >
            <span>Find a Doctor</span>
          </button>
        </div>
      )}

      {/* Data State: Appointment Exists */}
      {!isLoading && !isError && appointment && (
        <div className="space-y-5">
          {/* Doctor Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3.5">
              <img
                src={
                  appointment.doctorAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    appointment.doctorName
                  )}&background=0d9488&color=fff`
                }
                alt={appointment.doctorName}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-xs flex-shrink-0"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {appointment.doctorName}
                </h4>
                <p className="text-xs font-semibold text-teal-700">
                  {appointment.doctorSpecialization}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  {appointment.type === 'video' ? (
                    <span className="flex items-center gap-1 font-medium text-sky-700">
                      <Video className="h-3 w-3" /> Video Consultation
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-medium text-indigo-700">
                      <MapPin className="h-3 w-3" /> In-Person Visit
                    </span>
                  )}
                  {appointment.clinicInfo && (
                    <span>&bull; {appointment.clinicInfo}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time & Date Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </p>
                <p className="text-sm font-bold text-slate-900">{appointment.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Scheduled Time
                </p>
                <p className="text-sm font-bold text-slate-900">{appointment.time}</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onJoinConsultation(appointment)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <Video className="h-4 w-4" />
              <span>Join Consultation</span>
            </button>

            <button
              type="button"
              onClick={() => onViewDetails(appointment)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <ExternalLink className="h-4 w-4 text-slate-400" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
