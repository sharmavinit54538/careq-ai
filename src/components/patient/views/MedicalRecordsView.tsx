import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  UserCheck,
  Calendar
} from 'lucide-react';
import type { MedicalRecord, MedicalRecordCategory } from '../../../types/patient';

interface MedicalRecordsViewProps {
  records: MedicalRecord[];
  onUploadRecord: () => void;
  onViewRecord: (record: MedicalRecord) => void;
}

export const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({
  records,
  onUploadRecord,
  onViewRecord
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Array<'All' | MedicalRecordCategory> = [
    'All',
    'Lab Reports',
    'Prescriptions',
    'Imaging',
    'Doctor Notes',
    'Discharge Summary',
    'Other Documents'
  ];

  const filtered = records.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (record: MedicalRecord) => {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Medical Records & Diagnostics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access, download, and organize your clinical reports, imaging, and hospital summaries.
          </p>
        </div>

        <button
          type="button"
          onClick={onUploadRecord}
          className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records by title, facility, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 shadow-2xs focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Records List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No medical documents found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload your clinical reports to maintain a centralized longitudinal health record.
          </p>
          <button
            type="button"
            onClick={onUploadRecord}
            className="mt-5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {doc.name}
                    </h3>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 whitespace-nowrap">
                      {doc.category}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                      {doc.uploadedBy}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {doc.date}
                    </span>
                    {doc.fileSize && (
                      <>
                        <span>&bull;</span>
                        <span>{doc.fileSize}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onViewRecord(doc)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
