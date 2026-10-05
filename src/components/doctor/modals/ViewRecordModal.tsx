import React from 'react';
import { X, FileText, Download, ShieldCheck } from 'lucide-react';
import type { DoctorMedicalRecord } from '../../../types/doctor';

interface ViewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DoctorMedicalRecord | null;
}

export const ViewRecordModal: React.FC<ViewRecordModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{record.name}</h3>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {record.category}
              </span>
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

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Patient Name</span>
            <span className="font-bold text-slate-900">{record.patientName}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Issuing Facility / Lab</span>
            <span className="font-bold text-slate-900">{record.uploadedBy}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Document Upload Date</span>
            <span className="font-bold text-slate-900">{record.date}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">File Size</span>
            <span className="font-bold text-slate-900">{record.fileSize}</span>
          </div>

          {record.summary && (
            <div className="py-2 space-y-1">
              <span className="text-slate-500 block font-semibold">Diagnostic Findings &amp; Summary</span>
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed italic text-xs sm:text-sm border border-slate-200/60">
                "{record.summary}"
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/60 flex items-center gap-2 text-xs text-teal-900">
          <ShieldCheck size={16} className="text-teal-600 flex-shrink-0" />
          <span>Access verified under Doctor-Patient Confidentiality Privileges.</span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>

          <a
            href={record.fileUrl || '#'}
            download
            onClick={(e) => {
              if (!record.fileUrl || record.fileUrl === '#') {
                e.preventDefault();
                alert(`Downloading authorized document: ${record.name}`);
              }
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Download Copy</span>
          </a>
        </div>
      </div>
    </div>
  );
};
