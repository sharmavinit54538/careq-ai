import React from 'react';
import {
  X,
  Calendar,
  Video,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import type { DoctorAppointment } from '../../../types/doctor';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReschedule?: (apt: DoctorAppointment) => void;
  onStartConsultation?: (apt: DoctorAppointment) => void;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  onCancel,
  onReschedule,
  onStartConsultation
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
              <Calendar size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Appointment Details</h3>
              <p className="text-xs text-slate-400">Reference: {appointment.id}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Patient Profile Snapshot */}
        <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
          <img
            src={
              appointment.patientAvatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patientName)}&background=0d9488&color=fff`
            }
            alt={appointment.patientName}
            className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm">{appointment.patientName}</h4>
            <p className="text-xs text-slate-500">
              {appointment.patientAge} yrs &bull; {appointment.patientGender} &bull; {appointment.patientPhone}
            </p>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Date &amp; Time</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar size={14} className="text-teal-600" />
              {appointment.date} at {appointment.time}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Consultation Modality</span>
            <span className="font-bold text-teal-700 capitalize">
              {appointment.mode === 'video' ? 'Video Telehealth' : 'In-person Clinic'}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Appointment Type</span>
            <span className="font-bold text-slate-900">{appointment.type}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Current Status</span>
            <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">
              {appointment.status}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Consultation Fee</span>
            <span className="font-extrabold text-slate-900">₹{appointment.fee}</span>
          </div>

          {appointment.clinicRoom && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Assigned Room</span>
              <span className="font-bold text-slate-900">{appointment.clinicRoom}</span>
            </div>
          )}

          {appointment.reason && (
            <div className="py-2">
              <span className="text-slate-500 block mb-1">Stated Reason for Visit:</span>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs italic leading-relaxed">
                "{appointment.reason}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
          {appointment.status === 'pending' && onConfirm && (
            <button
              type="button"
              onClick={() => {
                onConfirm(appointment.id);
                onClose();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Confirm Appointment</span>
            </button>
          )}

          {onReschedule && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReschedule(appointment);
              }}
              className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-xl border border-sky-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reschedule</span>
            </button>
          )}

          {onCancel && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => {
                onCancel(appointment.id);
                onClose();
              }}
              className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel Appointment
            </button>
          )}

          {onStartConsultation && appointment.mode === 'video' && (appointment.status === 'confirmed' || appointment.status === 'scheduled') && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartConsultation(appointment);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Video size={14} />
              <span>Join Consultation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
