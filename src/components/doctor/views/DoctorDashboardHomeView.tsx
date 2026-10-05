import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  IndianRupee,
  Video,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  ShieldAlert,
  ChevronRight,
  Lock,
  Plus
} from 'lucide-react';
import type {
  DoctorAppointment,
  DoctorPatient,
  DoctorDashboardStats,
  AppointmentStatus
} from '../../../types/doctor';
import { useAuth } from '../../../context/AuthContext';

interface DoctorDashboardHomeViewProps {
  stats: DoctorDashboardStats | null;
  todayAppointments: DoctorAppointment[];
  recentPatients: DoctorPatient[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onStartConsultation: (apt: DoctorAppointment) => void;
  onViewAppointmentDetails: (apt: DoctorAppointment) => void;
}

export const DoctorDashboardHomeView: React.FC<DoctorDashboardHomeViewProps> = ({
  stats,
  todayAppointments,
  recentPatients,
  isLoading,
  isError,
  onRetry,
  onStartConsultation,
  onViewAppointmentDetails
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isApproved = true;

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDoctorDisplayName = () => {
    if (!user?.name) return 'Doctor';
    if (user.name.startsWith('Dr.')) return user.name;
    return `Dr. ${user.name}`;
  };

  const renderStatusBadge = (status: AppointmentStatus) => {
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
            <AlertCircle size={12} /> Pending Request
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <XCircle size={12} /> Cancelled
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
            <HelpCircle size={12} /> No Show
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Section Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-800/80">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Practice Overview
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {getGreeting()}, {getDoctorDisplayName()} 👋
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Manage your patients, appointments and practice from one place. Here is your clinical activity for today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/doctor/schedule')}
              className="px-5 py-3 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold rounded-xl transition-all shadow-md hover:shadow-teal-500/20 text-sm flex items-center gap-2 cursor-pointer"
            >
              <Calendar size={18} />
              <span>View Today's Schedule</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/doctor/schedule')}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 transition-all text-sm flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Plus size={18} />
              <span>Add Availability</span>
            </button>
          </div>
        </div>

        {/* Decorative subtle background elements */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert size={22} className="text-rose-600" />
            <p className="text-sm font-semibold">Unable to load this information right now.</p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Quick Statistics (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Today's Appointments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Appointments
            </span>
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-slate-200 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.todayAppointmentsCount !== undefined
                  ? String(stats.todayAppointmentsCount).padStart(2, '0')
                  : '--'}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span className="text-teal-600 font-bold">5 pending review</span> &bull; Updated live
            </p>
          </div>
        </div>

        {/* Stat 2: Total Patients */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Patients
            </span>
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-slate-200 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.totalPatientsCount !== undefined
                  ? String(stats.totalPatientsCount).padStart(2, '0')
                  : '--'}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span className="text-emerald-600 font-bold">+12 this month</span> &bull; Under your care
            </p>
          </div>
        </div>

        {/* Stat 3: Pending Requests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-slate-200 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.pendingRequestsCount !== undefined
                  ? String(stats.pendingRequestsCount).padStart(2, '0')
                  : '--'}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span className="text-amber-600 font-bold">Needs confirmation</span> &bull; Queued
            </p>
          </div>
        </div>

        {/* Stat 4: Today's Earnings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Earnings
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.todayEarningsAmount !== undefined
                  ? `₹${stats.todayEarningsAmount.toLocaleString()}`
                  : '--'}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span className="text-emerald-600 font-bold">Settled & Pending</span> &bull; 5 Consults
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols on lg): Today's Appointments & Recent Patients */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Appointments Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Today's Appointments
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scheduled clinical consultations and follow-up sessions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/doctor/appointments')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>View All Appointments</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* List / Timeline of Appointments */}
            <div className="mt-5 divide-y divide-slate-100">
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-4 animate-pulse">
                      <div className="w-12 h-12 bg-slate-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="w-1/3 h-4 bg-slate-200 rounded" />
                        <div className="w-1/2 h-3 bg-slate-100 rounded" />
                      </div>
                      <div className="w-24 h-9 bg-slate-200 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : todayAppointments.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
                    <Calendar size={28} />
                  </div>
                  <h4 className="font-bold text-slate-800">No appointments scheduled for today.</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You currently have no patient consultations on the schedule for today.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/doctor/schedule')}
                    className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Update Your Availability</span>
                  </button>
                </div>
              ) : (
                todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="py-4.5 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    {/* Patient & Time Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative">
                        <img
                          src={
                            apt.patientAvatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName)}&background=0d9488&color=fff`
                          }
                          alt={apt.patientName}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            apt.mode === 'video' ? 'bg-teal-500' : 'bg-blue-500'
                          }`}
                          title={apt.mode === 'video' ? 'Video Consultation' : 'In-person Consultation'}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base hover:text-teal-700 transition-colors cursor-pointer truncate"
                            onClick={() => navigate(`/doctor/patients/${apt.patientId}`)}
                          >
                            {apt.patientName}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">
                            ({apt.patientAge}y &bull; {apt.patientGender})
                          </span>
                          {renderStatusBadge(apt.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Clock size={13} className="text-teal-600" />
                            {apt.time}
                          </span>
                          <span>&bull;</span>
                          <span className="font-medium text-slate-600">{apt.type}</span>
                          <span>&bull;</span>
                          <span className="capitalize text-teal-700 font-semibold">
                            {apt.mode === 'video' ? 'Video Telehealth' : 'In-person Clinic'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => onViewAppointmentDetails(apt)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>

                      {isApproved ? (
                        apt.mode === 'video' ? (
                          <button
                            type="button"
                            onClick={() => onStartConsultation(apt)}
                            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Video size={14} />
                            <span>Start Consultation</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => navigate(`/doctor/patients/${apt.patientId}`)}
                            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <User size={14} />
                            <span>View Patient</span>
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-3.5 py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
                          title="Approval Required"
                        >
                          <Lock size={13} />
                          <span>Locked</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Patients Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Recent Patients
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patients under your direct clinical care and recent consultations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/doctor/patients')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <span>All Patients</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {isLoading ? (
                <div className="space-y-3 py-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 bg-slate-200 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <div className="w-1/4 h-3.5 bg-slate-200 rounded" />
                        <div className="w-1/3 h-3 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentPatients.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No patient records found.
                </div>
              ) : (
                recentPatients.slice(0, 5).map((patient) => (
                  <div
                    key={patient.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 px-2 -mx-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          patient.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=0d9488&color=fff`
                        }
                        alt={patient.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          Last visit: {patient.lastVisitDate} &bull; {patient.lastAppointmentType}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                      className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors flex-shrink-0 cursor-pointer"
                    >
                      View Patient
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col on lg): AI Assistant Card & Clinical Workflow Tools */}
        <div className="space-y-8">
          {/* CareQ AI Doctor Assistant Preview */}
          <div className="rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-6 sm:p-7 shadow-md border border-teal-800/40 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-400/30">
                <Sparkles size={18} />
              </div>
              <h3 className="font-extrabold text-base text-white tracking-tight">
                CareQ AI Doctor Assistant
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              AI-powered clinical assistance for your daily practice. Draft consultation notes, summarize patient history, or analyze test reports.
            </p>

            <div className="space-y-2 mb-5">
              <button
                type="button"
                onClick={() => navigate('/doctor/ai-assistant')}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Summarize patient history</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/doctor/ai-assistant')}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Analyze lab &amp; imaging report</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/doctor/ai-assistant')}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Prepare follow-up questions</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-800/40 text-[11px] text-teal-300/90 leading-tight">
              ⚠️ <strong>Clinical Safety Notice:</strong> CareQ AI is an assistant. The doctor remains the sole medical decision-maker.
            </div>

            <button
              type="button"
              onClick={() => navigate('/doctor/ai-assistant')}
              className="mt-4 w-full py-2.5 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl transition-colors text-center cursor-pointer block"
            >
              Open AI Clinical Assistant
            </button>
          </div>

          {/* Practice Fast Actions Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Clinical Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/doctor/prescriptions')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
              >
                <div className="p-2 bg-teal-50 text-teal-700 rounded-lg group-hover:bg-teal-100 transition-colors">
                  <Plus size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Create New Prescription</div>
                  <div className="text-[11px] text-slate-500">Issue signed e-prescription</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/doctor/schedule')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
              >
                <div className="p-2 bg-sky-50 text-sky-700 rounded-lg group-hover:bg-sky-100 transition-colors">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Set Weekly Availability</div>
                  <div className="text-[11px] text-slate-500">Configure appointment slots</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/doctor/medical-records')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
              >
                <div className="p-2 bg-purple-50 text-purple-700 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Users size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Review Patient Documents</div>
                  <div className="text-[11px] text-slate-500">Access authorized lab &amp; imaging</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
