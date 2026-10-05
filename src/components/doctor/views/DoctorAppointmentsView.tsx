import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import type { DoctorAppointment, AppointmentStatus } from '../../../types/doctor';

interface DoctorAppointmentsViewProps {
  appointments: DoctorAppointment[];
  onStartConsultation: (apt: DoctorAppointment) => void;
  onViewDetails: (apt: DoctorAppointment) => void;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (apt: DoctorAppointment) => void;
}

export const DoctorAppointmentsView: React.FC<DoctorAppointmentsViewProps> = ({
  appointments,
  onStartConsultation,
  onViewDetails,
  onConfirmAppointment,
  onCancelAppointment,
  onRescheduleAppointment
}) => {
  const isApproved = true;

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'today' | 'pending' | 'completed' | 'cancelled'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter((apt) => {
    // Tab filter
    if (activeTab === 'today') {
      if (apt.date !== today) return false;
    } else if (activeTab === 'upcoming') {
      if (apt.date < today || apt.status === 'completed' || apt.status === 'cancelled') return false;
    } else if (activeTab === 'pending') {
      if (apt.status !== 'pending') return false;
    } else if (activeTab === 'completed') {
      if (apt.status !== 'completed') return false;
    } else if (activeTab === 'cancelled') {
      if (apt.status !== 'cancelled') return false;
    }

    // Type filter
    if (selectedType !== 'all') {
      if (!apt.type.toLowerCase().includes(selectedType.toLowerCase()) && !apt.mode.toLowerCase().includes(selectedType.toLowerCase())) {
        return false;
      }
    }

    // Date filter
    if (selectedDate && apt.date !== selectedDate) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchReason = apt.reason && apt.reason.toLowerCase().includes(q);
      const matchType = apt.type.toLowerCase().includes(q);
      if (!matchName && !matchReason && !matchType) return false;
    }

    return true;
  });

  const renderBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={12} /> Confirmed
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
            <Clock size={12} /> Scheduled
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 border border-teal-300 px-2 py-0.5 rounded-full animate-pulse">
            <Video size={12} /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <AlertCircle size={12} /> Pending Approval
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Appointments Management</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review upcoming visits, confirm patient requests, and conduct clinical consultations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Total Found: <strong className="text-slate-900">{filteredAppointments.length}</strong>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'today', label: 'Today' },
            { id: 'pending', label: 'Pending Requests' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'all', label: 'All Appointments' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, condition..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 cursor-pointer"
            >
              <option value="all">All Consultation Types</option>
              <option value="video">Video Consultation</option>
              <option value="in-person">In-Person Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="checkup">Routine Checkup</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 cursor-pointer"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl"
                title="Clear date"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
              <Calendar size={28} />
            </div>
            <h3 className="font-bold text-slate-800">No appointments match your criteria.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your filter options or selecting another tab.
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Patient Info */}
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={
                    apt.patientAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName)}&background=0d9488&color=fff`
                  }
                  alt={apt.patientName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {apt.patientName}
                    </h3>
                    <span className="text-xs text-slate-400">
                      ({apt.patientAge}y &bull; {apt.patientGender})
                    </span>
                    {renderBadge(apt.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Calendar size={13} className="text-teal-600" />
                      {apt.date}
                    </span>
                    <span>&bull;</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock size={13} className="text-teal-600" />
                      {apt.time}
                    </span>
                    <span>&bull;</span>
                    <span className="font-semibold text-slate-700">{apt.type}</span>
                    <span>&bull;</span>
                    <span className="capitalize text-teal-700 font-bold">
                      {apt.mode === 'video' ? 'Video Telehealth' : 'In-person Clinic'}
                    </span>
                  </div>

                  {apt.reason && (
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-1 italic">
                      "{apt.reason}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => onViewDetails(apt)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  View
                </button>

                {apt.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => onConfirmAppointment(apt.id)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 size={13} />
                    <span>Confirm</span>
                  </button>
                )}

                {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => onRescheduleAppointment(apt)}
                    className="px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 bg-white rounded-xl border border-sky-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw size={13} />
                    <span>Reschedule</span>
                  </button>
                )}

                {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => onCancelAppointment(apt.id)}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 bg-white rounded-xl border border-rose-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                {isApproved && (apt.status === 'confirmed' || apt.status === 'scheduled') && apt.mode === 'video' && (
                  <button
                    type="button"
                    onClick={() => onStartConsultation(apt)}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Video size={14} />
                    <span>Start Consultation</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
