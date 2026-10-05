import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  AlertCircle,
  RefreshCw,
  Upload,
  Calendar,
  UserCheck
} from 'lucide-react';
import type { MedicalRecord, MedicalRecordCategory } from '../../types/patient';

interface MedicalRecordsSectionProps {
  records: MedicalRecord[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onUploadRecord: () => void;
  onViewRecord: (record: MedicalRecord) => void;
}

export const MedicalRecordsSection: React.FC<MedicalRecordsSectionProps> = ({
  records,
  isLoading,
  isError,
  onRetry,
  onUploadRecord,
  onViewRecord
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: Array<'All' | MedicalRecordCategory> = [
    'All',
    'Lab Reports',
    'Prescriptions',
    'Imaging',
    'Doctor Notes',
    'Discharge Summary',
    'Other Documents'
  ];

  const filteredRecords =
    selectedCategory === 'All'
      ? records
      : records.filter((r) => r.category === selectedCategory);

  const handleDownload = (record: MedicalRecord) => {
    // Generate simple text blob download for demonstration
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
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Medical Records
            </h3>
            <p className="text-[11px] font-medium text-slate-600">
              Diagnostic reports, doctor notes, and imaging documents
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onUploadRecord}
          className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors self-start sm:self-auto"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Record</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none flex-nowrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-18 rounded-2xl bg-slate-100" />
          <div className="h-18 rounded-2xl bg-slate-100" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
          <p className="text-sm font-bold text-rose-900">
            Unable to load medical records.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-rose-700 border border-rose-300 shadow-xs hover:bg-rose-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredRecords.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            No medical records available.
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {selectedCategory === 'All'
              ? 'Upload your diagnostic reports, lab summaries, or imaging records to keep all documentation in your HIPAA-compliant vault.'
              : `No documents found under the "${selectedCategory}" category.`}
          </p>
          <button
            type="button"
            onClick={onUploadRecord}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Record</span>
          </button>
        </div>
      )}

      {/* Records List */}
      {!isLoading && !isError && filteredRecords.length > 0 && (
        <div className="space-y-3">
          {filteredRecords.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-all hover:shadow-xs"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {rec.name}
                    </h4>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 whitespace-nowrap">
                      {rec.category}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <UserCheck className="h-3 w-3 text-slate-400" />
                      Uploaded by: {rec.uploadedBy}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {rec.date}
                    </span>
                    {rec.fileSize && (
                      <>
                        <span>&bull;</span>
                        <span>{rec.fileSize}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View & Download */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onViewRecord(rec)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(rec)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
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
