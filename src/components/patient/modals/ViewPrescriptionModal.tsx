import React from 'react';
import { X, Pill, UserCheck, Calendar, Clock, AlertCircle } from 'lucide-react';
import type { Prescription } from '../../../types/patient';

interface ViewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
}

export const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = ({
  isOpen,
  onClose,
  prescription
}) => {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Prescription Details
              </h3>
              <p className="text-xs text-slate-500">Rx ID: {prescription.id}</p>
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
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-extrabold text-slate-900">
                {prescription.medicineName}
              </h4>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 capitalize">
                {prescription.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-800">
              Dosage: {prescription.dosage} &bull; {prescription.frequency}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-500 font-medium block">Prescribing Doctor</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <UserCheck className="h-3.5 w-3.5 text-teal-600" />
                {prescription.doctorName}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-500 font-medium block">Date Authorized</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-sky-600" />
                {prescription.date}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-500 font-medium block">Duration</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Clock className="h-3.5 w-3.5 text-indigo-600" />
                {prescription.duration}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-500 font-medium block">Refills Left</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                {prescription.refillsRemaining ?? 1} refills authorized
              </span>
            </div>
          </div>

          {prescription.instructions && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <span>Pharmacy Instructions</span>
              </div>
              <p className="text-amber-800 leading-relaxed font-medium">
                {prescription.instructions}
              </p>
            </div>
          )}

          <div className="pt-2 text-right">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
