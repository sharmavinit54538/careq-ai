import React, { useState } from 'react';
import {
  Send,
  User,
  Calendar,
  Pill,
  FileText
} from 'lucide-react';
import { GeminiIcon } from '../../common/GeminiIcon';
import { useNavigate } from 'react-router-dom';

export const AiAssistantView: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<
    Array<{ sender: 'ai' | 'user'; text: string; time: string }>
  >([
    {
      sender: 'ai',
      text: 'Hello Sarah! I am QAI, your Clinical Health Navigator. I can help explain medical terms, summarize your lab tests, check prescription interactions, or guide you to certified specialists. How can I assist you with your health today?',
      time: '10:00 AM'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { text: 'Explain my cholesterol test results', icon: FileText },
    { text: 'What are common side effects of Atorvastatin?', icon: Pill },
    { text: 'Help me prepare questions for Dr. Reed', icon: Calendar },
    { text: 'Find a board-certified neurologist near me', icon: User }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    const q = text.toLowerCase();

    setTimeout(() => {
      setIsTyping(false);
      let reply = '';

      if (
        q.includes('emergency') ||
        q.includes('chest pain') ||
        q.includes('shortness of breath') ||
        q.includes('fainting')
      ) {
        reply =
          '⚠️ URGENT CLINICAL NOTICE: If you are experiencing chest pain, severe shortness of breath, sudden numbness, or any life-threatening symptoms, please call 911 or visit your nearest emergency room immediately. CareQ AI does not provide emergency triage.';
      } else if (q.includes('cholesterol') || q.includes('lipid') || q.includes('test')) {
        reply =
          'Based on your Quest Diagnostics Lipid Panel from Sept 2026: Your Total Cholesterol was 182 mg/dL (Desirable), HDL was 58 mg/dL (Optimal), and LDL was 98 mg/dL (Optimal on therapy). This indicates good response to your current lipid-lowering care plan.';
      } else if (q.includes('atorvastatin') || q.includes('side effect') || q.includes('medication')) {
        reply =
          'Atorvastatin (Lipitor) is an HMG-CoA reductase inhibitor used to lower LDL cholesterol and protect cardiovascular health. Common mild effects include mild muscle aches or digestive changes. If you experience severe muscle weakness or dark urine, alert Dr. Evelyn Reed promptly.';
      } else if (q.includes('prepare') || q.includes('question') || q.includes('dr. reed')) {
        reply =
          'Key questions for Dr. Evelyn Reed at your upcoming consultation:\n1. Are my current lipid markers within your target range for my cardiovascular risk profile?\n2. Should we continue Atorvastatin 20mg at the current dosage?\n3. Do I need to schedule another repeat panel in 6 months?';
      } else if (q.includes('neurologist') || q.includes('specialist') || q.includes('doctor')) {
        reply =
          'We have certified specialists available in your CareQ AI network, including Dr. Marcus Vance (Neurology & Cognitive Sciences). Would you like me to open the doctor directory?';
        setTimeout(() => navigate('/patient/doctors'), 1800);
      } else {
        reply =
          `I have noted your inquiry regarding "${text}". Your vitals and records are healthy and up to date. For personalized clinical diagnosis or medication alterations, please schedule a direct consultation with your attending physician.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Chat Container */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[580px]">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl ${
                  m.sender === 'ai'
                    ? 'bg-gradient-to-tr from-teal-600 to-sky-500 text-white shadow-xs'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {m.sender === 'ai' ? <GeminiIcon size={18} className="text-white" /> : <User className="h-4 w-4" />}
              </div>

              <div
                className={`rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'ai'
                    ? 'bg-slate-50 text-slate-800 border border-slate-100'
                    : 'bg-teal-600 text-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] font-bold mb-1 opacity-70">
                  <span>{m.sender === 'ai' ? 'CareQ AI' : 'You'}</span>
                  <span>{m.time}</span>
                </div>
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 text-white">
                <GeminiIcon size={16} className="text-white" />
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2.5 text-xs text-slate-500 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-3 overflow-x-auto scrollbar-none flex items-center gap-2">
          {quickPrompts.map((qp, i) => {
            const Icon = qp.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qp.text)}
                className="whitespace-nowrap flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all flex-shrink-0"
              >
                <Icon className="h-3 w-3 text-teal-600" />
                <span>{qp.text}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputPrompt);
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask CareQ AI about symptoms, tests, medications, or doctor visits..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-xs hover:bg-teal-700 active:scale-95 disabled:opacity-50 transition-all flex-shrink-0"
              aria-label="Send Message"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
