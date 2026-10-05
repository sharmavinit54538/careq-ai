import React, { useState } from 'react';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import type { MedicalRecordCategory } from '../../../types/patient';

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (record: {
    name: string;
    category: MedicalRecordCategory;
    uploadedBy: string;
    fileSize?: string;
  }) => Promise<void>;
}

export const UploadRecordModal: React.FC<UploadRecordModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MedicalRecordCategory>('Lab Reports');
  const [uploadedBy, setUploadedBy] = useState('Patient Portal Upload');
  const [fileSize] = useState('1.8 MB');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: MedicalRecordCategory[] = [
    'Lab Reports',
    'Prescriptions',
    'Imaging',
    'Doctor Notes',
    'Discharge Summary',
    'Other Documents'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a document title.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUploadSuccess({
        name: name.trim(),
        category,
        uploadedBy: uploadedBy.trim() || 'Patient Self-Upload',
        fileSize
      });
      onClose();
    } catch {
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Upload Medical Record
              </h3>
              <p className="text-xs text-slate-500">
                Attach reports, imaging scans, and clinical notes to your profile
              </p>
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

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Document Name / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Lipid Panel Lab Report Sept 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MedicalRecordCategory)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Issuing Clinic / Upload Source
            </label>
            <input
              type="text"
              placeholder="e.g. Quest Diagnostics, Mount Sinai Hospital"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Fake Upload Drag & Drop Zone */}
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center hover:bg-slate-100/60 transition-colors">
            <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-700">
              PDF, JPG, PNG or DICOM clinical scans
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Encrypted with CareQ AES-256 HIPAA Compliant Storage
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading File...</span>
                </>
              ) : (
                <span>Upload Document</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
