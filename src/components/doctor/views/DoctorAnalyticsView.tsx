import React from 'react';
import {
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Video,
  IndianRupee,
  Calendar,
  Percent,
  Activity
} from 'lucide-react';
import type { DoctorAnalytics } from '../../../types/doctor';

interface DoctorAnalyticsViewProps {
  analytics: DoctorAnalytics | null;
  isLoading: boolean;
}

export const DoctorAnalyticsView: React.FC<DoctorAnalyticsViewProps> = ({
  analytics,
  isLoading
}) => {
  if (isLoading || !analytics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
        <div className="h-72 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  const maxWeeklyCount = Math.max(...analytics.weeklyTrends.map((w) => w.count), 1);
  const maxRevenue = Math.max(...analytics.monthlyRevenue.map((m) => m.amount), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Practice Analytics &amp; Clinical Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time key performance metrics, consultation volume, patient retention, and practice revenue trends.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
          <TrendingUp size={15} />
          <span>+14.2% Growth vs Last Month</span>
        </div>
      </div>

      {/* 8 Primary Metric Cards (2 rows of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Appointments</span>
            <Calendar size={18} className="text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics.totalAppointments}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            Across all modalities
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Completed Visits</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics.completedConsultations}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Satisfactorily concluded
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Completion Rate</span>
            <Percent size={18} className="text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics.completionRate}%
          </div>
          <span className="text-[11px] text-sky-600 font-semibold mt-1 block">
            Top tier clinic benchmark
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Cancelled Visits</span>
            <XCircle size={18} className="text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics.cancelledAppointments}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Low cancellation rate &lt; 5%
          </span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>New Patients</span>
            <Users size={18} className="text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics.newPatients}
          </div>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
            First-time consultations
          </span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Returning Patients</span>
            <Activity size={18} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics.returningPatients}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            Long-term care retention
          </span>
        </div>

        {/* Metric 7 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Avg Consults / Day</span>
            <Clock size={18} className="text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics.avgConsultationsPerDay}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            Optimized workload
          </span>
        </div>

        {/* Metric 8 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Revenue</span>
            <IndianRupee size={18} className="text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-3">
            ₹{analytics.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            Cumulative practice billing
          </span>
        </div>
      </div>

      {/* SVG & Tailwind Data Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Consultations Bar Visualization */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Weekly Consultation Flow</h3>
            <span className="text-xs text-slate-500 font-medium">Scheduled vs Completed</span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-slate-100 pb-2">
            {analytics.weeklyTrends.map((item) => {
              const heightPercent = Math.round((item.count / maxWeeklyCount) * 100);
              const completedPercent = Math.round((item.completed / maxWeeklyCount) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-500 group-hover:text-teal-700 transition-colors">
                    {item.completed}
                  </div>
                  <div className="w-full max-w-[32px] bg-slate-100 rounded-t-xl overflow-hidden relative flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                    <div
                      className="w-full bg-teal-600 rounded-t-lg transition-all group-hover:bg-teal-500"
                      style={{ height: `${completedPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-teal-600" />
              <span>Completed Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200" />
              <span>Scheduled Slots</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Revenue Trend Over Months */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Monthly Revenue Trend (₹)</h3>
            <span className="text-xs text-emerald-600 font-bold">Consistently Expanding</span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-slate-100 pb-2">
            {analytics.monthlyRevenue.map((item) => {
              const heightPercent = Math.round((item.amount / maxRevenue) * 100);

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-700 transition-colors">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </div>
                  <div
                    className="w-full max-w-[34px] bg-gradient-to-t from-teal-700 to-teal-500 rounded-t-xl transition-all group-hover:from-teal-600 group-hover:to-teal-400 shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-bold text-slate-700">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 text-center pt-1">
            Practice income collected through verified telehealth &amp; in-clinic transactions.
          </div>
        </div>
      </div>

      {/* Consultation Channels Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Consultation Modality Breakdown</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/60 flex items-center gap-4">
            <div className="p-3 bg-teal-600 text-white rounded-xl">
              <Video size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-900">Telehealth Video</div>
              <div className="text-xl font-extrabold text-teal-950">
                {analytics.typeDistribution.video}
              </div>
              <span className="text-[11px] text-teal-700 font-medium">65% of all visits</span>
            </div>
          </div>

          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200/60 flex items-center gap-4">
            <div className="p-3 bg-sky-600 text-white rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-900">In-Person Clinic</div>
              <div className="text-xl font-extrabold text-sky-950">
                {analytics.typeDistribution.inPerson}
              </div>
              <span className="text-[11px] text-sky-700 font-medium">30% of all visits</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/60 flex items-center gap-4">
            <div className="p-3 bg-purple-600 text-white rounded-xl">
              <Activity size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-900">Audio Telehealth</div>
              <div className="text-xl font-extrabold text-purple-950">
                {analytics.typeDistribution.audio}
              </div>
              <span className="text-[11px] text-purple-700 font-medium">5% of all visits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
