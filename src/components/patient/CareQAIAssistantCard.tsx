import React, { useState } from 'react';
import {
  Send,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  UserCheck,
  Pill,
  Calendar,
  FileText
} from 'lucide-react';
import { GeminiIcon } from '../common/GeminiIcon';
import { useNavigate } from 'react-router-dom';

interface CareQAIAssistantCardProps {
  onPromptSelect?: (prompt: string) => void;
}

export const CareQAIAssistantCard: React.FC<CareQAIAssistantCardProps> = ({
  onPromptSelect
}) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const suggestedActions = [
    { label: 'Find a doctor', icon: UserCheck, route: '/patient/doctors' },
    { label: 'Explain my prescription', icon: Pill, route: '/patient/prescriptions' },
    { label: 'Prepare for my appointment', icon: Calendar, route: '/patient/appointments' },
    { label: 'View my health records', icon: FileText, route: '/patient/medical-records' }
  ];

  const handleActionClick = (action: (typeof suggestedActions)[0]) => {
    if (onPromptSelect) {
      onPromptSelect(action.label);
    }
    navigate(action.route);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsProcessing(true);
    const query = inputValue.trim().toLowerCase();

    setTimeout(() => {
      setIsProcessing(false);
      if (
        query.includes('emergency') ||
        query.includes('chest pain') ||
        query.includes('breathing') ||
        query.includes('stroke')
      ) {
        setResponseMessage(
          '⚠️ MEDICAL ALERT: If you are experiencing chest pain, difficulty breathing, or severe emergency symptoms, please call 911 or your local emergency services immediately. CareQ AI cannot diagnose or treat critical emergencies.'
        );
      } else if (query.includes('doctor') || query.includes('specialist')) {
        setResponseMessage(
          'I have matched several certified physicians available in your network. Navigating you to Find Doctors...'
        );
        setTimeout(() => navigate('/patient/doctors'), 1200);
      } else if (query.includes('prescription') || query.includes('medicine') || query.includes('pill')) {
        setResponseMessage(
          'Your active medications include Atorvastatin Calcium 20mg once daily at bedtime. Opening your prescriptions dashboard...'
        );
        setTimeout(() => navigate('/patient/prescriptions'), 1200);
      } else {
        setResponseMessage(
          `"QAI is ready to help with "${inputValue}". Remember that clinical decisions require consultation with a licensed physician.`
        );
      }
      setInputValue('');
    }, 600);
  };

  return (
    <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Decorative Blur Background Nodes */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-500/15 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-400 text-slate-950 shadow-md shadow-teal-500/30">
              <GeminiIcon size={24} className="text-white" variant="gradient" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-heading font-extrabold text-white">
                  QAI
                </h3>
                <span className="flex items-center gap-1 rounded-md bg-teal-400/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                  <Sparkles className="h-3 w-3" /> GPT-4o Health
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Clinical Companion & Patient Health Navigator
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Question */}
        <p className="text-base sm:text-lg font-semibold text-teal-100 mb-5">
          "How can I help you with your healthcare today?"
        </p>

        {/* AI Response Display if available */}
        {responseMessage && (
          <div className="mb-4 rounded-2xl bg-white/10 p-4 border border-teal-400/30 backdrop-blur-md animate-fade-in">
            <p className="text-xs sm:text-sm text-teal-50 leading-relaxed font-medium">
              {responseMessage}
            </p>
            <button
              type="button"
              onClick={() => setResponseMessage(null)}
              className="mt-2 text-[11px] text-teal-300 hover:text-white underline font-semibold"
            >
              Clear message
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative mb-5">
          <input
            type="text"
            placeholder="Ask CareQ AI (e.g. explain lab results, find cardiologist)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            className="w-full rounded-2xl border border-white/20 bg-white/10 pl-5 pr-14 py-3.5 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-all focus:border-teal-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-400/30 shadow-inner"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputValue.trim()}
            className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md"
            aria-label="Send query"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Suggested Actions */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Suggested Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedActions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.label}
                  type="button"
                  onClick={() => handleActionClick(act)}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15 hover:border-teal-400/40 active:scale-95 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="h-3.5 w-3.5 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{act.label}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-white transition-all flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* IMPORTANT MEDICAL SAFETY DISCLAIMER */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-amber-500/10 border border-amber-400/25 p-2.5 text-amber-200/90 backdrop-blur-xs">
          <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] leading-relaxed">
            <span className="font-bold uppercase tracking-wider text-amber-300">
              Notice:{' '}
            </span>
            Educational guidance only. Not a substitute for professional medical care. In an emergency, call 911 immediately.
          </div>
        </div>
      </div>
    </div>
  );
};
