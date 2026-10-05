import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  ExternalLink
} from 'lucide-react';
import type { Appointment } from '../../../types/patient';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onBookAppointment: () => void;
  onJoinConsultation: (appointment: Appointment) => void;
  onViewDetails: (appointment: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onBookAppointment,
  onJoinConsultation,
  onViewDetails
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredAppointments = appointments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return a.status === 'upcoming' || a.status === 'confirmed' || a.status === 'scheduled';
    }
    return a.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
        </div>

        <button
          type="button"
          onClick={onBookAppointment}
          className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all self-start sm:self-auto cursor-pointer flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Book New Visit</span>
        </button>
      </div>

      {/* Appointment Cards */}
      {filteredAppointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No {filter !== 'all' ? filter : ''} appointments found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Schedule a consultation with an approved doctor to consult online or in person.
          </p>
          <button
            type="button"
            onClick={onBookAppointment}
            className="mt-5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
          >
            Schedule Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    apt.doctorAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      apt.doctorName
                    )}&background=0d9488&color=fff`
                  }
                  alt={apt.doctorName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">
                      {apt.doctorName}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                        apt.status === 'confirmed' || apt.status === 'upcoming'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-teal-700 mt-0.5">
                    {apt.doctorSpecialization}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Calendar className="h-3.5 w-3.5 text-teal-600" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="h-3.5 w-3.5 text-sky-600" />
                      {apt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      {apt.type === 'video' ? (
                        <>
                          <Video className="h-3.5 w-3.5 text-sky-600" />
                          Telehealth Video
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                          In-Person Clinic
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-end lg:self-center">
                {apt.status !== 'cancelled' && apt.type === 'video' && (
                  <button
                    type="button"
                    onClick={() => onJoinConsultation(apt)}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 active:scale-95 transition-all"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Join Video</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onViewDetails(apt)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
