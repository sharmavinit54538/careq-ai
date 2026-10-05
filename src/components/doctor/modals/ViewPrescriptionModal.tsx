import React from 'react';
import { X, Pill, ShieldCheck, Printer } from 'lucide-react';
import type { DoctorPrescription } from '../../../types/doctor';

interface ViewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: DoctorPrescription | null;
}

export const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = ({
  isOpen,
  onClose,
  prescription
}) => {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
              <Pill size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Official E-Prescription Slip
              </h3>
              <p className="text-xs text-slate-400">Rx ID: {prescription.id}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Prescription Paper Card */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-5">
          {/* Doctor & Patient Info */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-slate-200 text-xs">
            <div>
              <span className="font-extrabold text-slate-900 block text-sm">
                {prescription.doctorName}
              </span>
              <span className="text-slate-500">Authorized CareQ Physician</span>
              <span className="text-slate-500 block">Date: {prescription.date}</span>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-500 block">Prescribed to:</span>
              <span className="font-extrabold text-slate-900 block text-sm">
                {prescription.patientName}
              </span>
              <span className="text-slate-500">
                {prescription.patientAge} yrs &bull; {prescription.patientGender}
              </span>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Clinical Diagnosis
            </span>
            <div className="text-sm font-extrabold text-teal-900">
              {prescription.diagnosis}
            </div>
          </div>

          {/* Medicines Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Medication Regimen (Rx)
            </span>
            <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
              {prescription.medicines.map((med, idx) => (
                <div key={med.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {idx + 1}. {med.name} — {med.dosage}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {med.frequency} &bull; {med.duration}
                    </div>
                    {med.instructions && (
                      <div className="text-teal-800 italic mt-0.5">
                        Instructions: {med.instructions}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Follow-up */}
          {prescription.clinicalNotes && (
            <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
              <strong>Clinical Advice:</strong> {prescription.clinicalNotes}
            </div>
          )}

          {prescription.followUpDate && (
            <div className="text-xs font-bold text-teal-800">
              Recommended Follow-up: {prescription.followUpDate}
            </div>
          )}

          {/* Signature Verification */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
              <ShieldCheck size={16} className="text-teal-600" />
              <span>Digitally Signed &amp; Verifiable on CareQ Network</span>
            </div>
            <span className="font-bold uppercase text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              Status: {prescription.status}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
};
