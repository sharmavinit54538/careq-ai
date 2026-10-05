import React from 'react';
import { X, FileText, Download, UserCheck, Calendar } from 'lucide-react';
import type { MedicalRecord } from '../../../types/patient';

interface ViewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
}

export const ViewRecordModal: React.FC<ViewRecordModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  if (!isOpen || !record) return null;

  const handleDownload = () => {
    const content = `CareQ AI Medical Record\n=========================\nRecord: ${record.name}\nCategory: ${record.category}\nDate: ${record.date}\nUploaded By: ${record.uploadedBy}\n\nClinical document secured by CareQ AI HIPAA Encryption.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.name.replace(/[\s\W]+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Medical Document
              </h3>
              <p className="text-xs text-slate-500">Record ID: {record.id}</p>
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
          <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
              {record.category}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-2">
              {record.name}
            </h4>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {record.date}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                {record.uploadedBy}
              </span>
            </div>
          </div>

          {/* Document Content Simulation */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 font-mono text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-200 pb-2 font-sans font-bold text-slate-900">
              <span>CareQ AI Clinical Verification</span>
              <span className="text-emerald-600">✓ Digital Signature Valid</span>
            </div>
            <p className="leading-relaxed">
              Patient: Sarah Jenkins (usr_pat_001)
              <br />
              Reference Facility: {record.uploadedBy}
              <br />
              Encryption Standard: AES-256 GCM HIPAA Vault
              <br />
              Integrity Hash: sha256-{record.id.repeat(2)}
            </p>
            <p className="text-[11px] text-slate-500 italic font-sans pt-2">
              This document has been reviewed and imported into the patient's longitudinal health record.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Document</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
