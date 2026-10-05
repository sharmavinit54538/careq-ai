import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import type { Appointment } from '../../../types/patient';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onCancelAppointment: (appointmentId: string) => Promise<void>;
  onJoinRoom: (appointment: Appointment) => void;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onCancelAppointment,
  onJoinRoom
}) => {
  const [isCancelling, setIsCancelling] = React.useState(false);

  if (!isOpen || !appointment) return null;

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this scheduled consultation?')) {
      setIsCancelling(true);
      try {
        await onCancelAppointment(appointment.id);
        onClose();
      } finally {
        setIsCancelling(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Consultation Details
              </h3>
              <p className="text-xs text-slate-500">ID: {appointment.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Doctor Header */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src={
                appointment.doctorAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  appointment.doctorName
                )}&background=0d9488&color=fff`
              }
              alt={appointment.doctorName}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-xs"
            />
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {appointment.doctorName}
              </h4>
              <p className="text-xs font-semibold text-teal-700">
                {appointment.doctorSpecialization}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="capitalize font-bold text-emerald-700">
                  Status: {appointment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Time & Format */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/80">
              <span className="text-slate-500 font-medium block">Date & Time</span>
              <span className="font-bold text-slate-900 block mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-600" />
                {appointment.date}
              </span>
              <span className="font-semibold text-slate-700 block mt-0.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-600" />
                {appointment.time}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/80">
              <span className="text-slate-500 font-medium block">Consultation Type</span>
              <span className="font-bold text-slate-900 block mt-1 flex items-center gap-1.5 capitalize">
                {appointment.type === 'video' ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-sky-600" />
                    Telehealth Video
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                    In-Person Visit
                  </>
                )}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {appointment.clinicInfo || 'Main Clinical Facility'}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs">
              <span className="text-slate-500 font-bold block mb-1">
                Clinical Reason & Notes:
              </span>
              <p className="text-slate-700 font-normal">{appointment.notes}</p>
            </div>
          )}

          {/* Meeting Room Link if Video */}
          {appointment.type === 'video' && appointment.meetingLink && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-900">
                  High-Definition Telehealth Room
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                  HIPAA Encrypted
                </span>
              </div>
              <p className="text-xs text-teal-800 mb-3">
                Your private room opens 5 minutes before scheduled start time.
              </p>
              <button
                type="button"
                onClick={() => onJoinRoom(appointment)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 active:scale-95 transition-all"
              >
                <Video className="h-4 w-4" />
                <span>Enter Video Consultation</span>
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {appointment.status !== 'cancelled' && (
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 focus:outline-none"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{isCancelling ? 'Cancelling...' : 'Cancel Appointment'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
