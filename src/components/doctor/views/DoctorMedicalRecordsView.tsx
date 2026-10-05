import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  Eye,
  Calendar,
  User,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import type { DoctorMedicalRecord, MedicalRecordCategory } from '../../../types/doctor';

interface DoctorMedicalRecordsViewProps {
  records: DoctorMedicalRecord[];
  onViewRecord: (record: DoctorMedicalRecord) => void;
}

export const DoctorMedicalRecordsView: React.FC<DoctorMedicalRecordsViewProps> = ({
  records,
  onViewRecord
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Array<'All' | MedicalRecordCategory> = [
    'All',
    'Lab Reports',
    'Imaging',
    'Prescriptions',
    'Doctor Notes',
    'Discharge Summary',
    'Other Documents'
  ];

  const filteredRecords = records.filter((rec) => {
    if (activeCategory !== 'All' && rec.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rec.name.toLowerCase().includes(q);
      const matchPatient = rec.patientName.toLowerCase().includes(q);
      const matchUploaded = rec.uploadedBy.toLowerCase().includes(q);
      const matchSummary = rec.summary && rec.summary.toLowerCase().includes(q);
      if (!matchName && !matchPatient && !matchUploaded && !matchSummary) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Authorized Medical Records &amp; Diagnostics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access lab investigations, radiological imaging studies, clinical summaries, and physician notes.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold self-start sm:self-auto">
            <ShieldCheck size={14} />
            <span>HIPAA Compliant Record Vault</span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by document name, patient name, laboratory, or diagnostic findings..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
          />
        </div>
      </div>

      {/* Records Cards Grid */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
              <FolderOpen size={28} />
            </div>
            <h3 className="font-bold text-slate-800">No medical records match your criteria.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try choosing another category or clearing your search term.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl flex-shrink-0 mt-0.5">
                  <FileText size={22} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {rec.name}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {rec.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-slate-800">Patient: {rec.patientName}</span>
                    <span>&bull;</span>
                    <span>Uploaded by: {rec.uploadedBy}</span>
                    <span>&bull;</span>
                    <span>Date: {rec.date}</span>
                    <span>&bull;</span>
                    <span>Size: {rec.fileSize}</span>
                  </div>

                  {rec.summary && (
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed italic">
                      "{rec.summary}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onViewRecord(rec)}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>

                <a
                  href={rec.fileUrl || '#'}
                  download
                  onClick={(e) => {
                    if (!rec.fileUrl || rec.fileUrl === '#') {
                      e.preventDefault();
                      alert(`Initiating verified download for: ${rec.name}`);
                    }
                  }}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
