import React from 'react';
import {
  Sparkles,
  Star,
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import type { DoctorRecommendation } from '../../types/patient';

interface RecommendedDoctorsSectionProps {
  doctors: DoctorRecommendation[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDoctorProfile: (doctor: DoctorRecommendation) => void;
  onBookDoctor: (doctor: DoctorRecommendation) => void;
}

export const RecommendedDoctorsSection: React.FC<RecommendedDoctorsSectionProps> = ({
  doctors,
  isLoading,
  isError,
  onRetry,
  onViewDoctorProfile,
  onBookDoctor
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Recommended Doctors
            </h3>
            <p className="text-[11px] font-medium text-slate-600">
              AI-matched specialists tailored to your medical history & vitals
            </p>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-44 rounded-2xl bg-slate-100" />
          <div className="h-44 rounded-2xl bg-slate-100" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
          <p className="text-sm font-bold text-rose-900">
            Unable to load recommended doctors.
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
      {!isLoading && !isError && doctors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <p className="text-sm font-bold text-slate-800">
            No recommended doctors available at this moment.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Check back shortly or explore our full doctor directory.
          </p>
        </div>
      )}

      {/* Doctors Grid */}
      {!isLoading && !isError && doctors.length > 0 && (
        <div className="grid grid-cols-1 gap-3.5">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 hover:border-teal-300 hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      doc.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        doc.name
                      )}&background=0d9488&color=fff`
                    }
                    alt={doc.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {doc.name}
                    </h4>
                    <p className="text-xs font-semibold text-teal-700 truncate">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {doc.hospitalName}
                    </p>

                    {/* Stats: Experience & Rating */}
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {doc.rating}
                        <span className="font-normal text-slate-600">
                          ({doc.reviewCount})
                        </span>
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                        <Award className="h-3.5 w-3.5 text-slate-400" />
                        {doc.experienceYears} yrs exp
                      </span>
                    </div>
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-teal-600" />
                  <span>Next slot: {doc.availability}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onViewDoctorProfile(doc)}
                  className="rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => onBookDoctor(doc)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 active:scale-95 focus:outline-none transition-all"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
