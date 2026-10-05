import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Download
} from 'lucide-react';
import type { DoctorEarnings } from '../../../types/doctor';

interface DoctorEarningsViewProps {
  earnings: DoctorEarnings | null;
  isLoading: boolean;
}

export const DoctorEarningsView: React.FC<DoctorEarningsViewProps> = ({
  earnings,
  isLoading
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all');

  if (isLoading || !earnings) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  const transactions = earnings.transactions || [];
  const filteredTransactions = transactions.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const renderStatusBadge = (status: 'paid' | 'pending' | 'refunded') => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} /> Settled
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock size={12} /> Pending Payout
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            <RotateCcw size={12} /> Refunded
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Earnings &amp; Payouts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent revenue tracking, consultation payments, direct bank settlement schedules, and transaction receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting monthly statement CSV...')}
          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Statement</span>
        </button>
      </div>

      {/* 5 Earnings Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Today's Earnings
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ₹{earnings.todayEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            5 consultations
          </span>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            This Week
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ₹{earnings.thisWeekEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            +18% vs last week
          </span>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            This Month
          </span>
          <div className="text-2xl font-extrabold text-teal-800 mt-2">
            ₹{earnings.thisMonthEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            October billing
          </span>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Earnings
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ₹{earnings.totalEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            All-time collected
          </span>
        </div>

        {/* Pending Payout */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Pending Payout
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">
            ₹{earnings.pendingPayout.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Next transfer on Friday
          </span>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">
            Consultation Ledger &amp; Transactions
          </h3>

          <div className="flex items-center gap-2">
            {(['all', 'paid', 'pending', 'refunded'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                  statusFilter === st
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No transactions registered under this filter.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Patient / Reference</th>
                  <th className="py-3 px-3">Consultation Type</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-600">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{tx.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Ref: {tx.appointmentRef}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {tx.consultationType}
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {renderStatusBadge(tx.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
