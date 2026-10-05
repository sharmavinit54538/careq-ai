import React, { useState } from 'react';
import {
  Send,
  Bot,
  User,
  Copy,
  Check,
  FileSearch,
  BookOpen,
  HelpCircle,
  FileText,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'doctor';
  text: string;
  timestamp: string;
}

export const DoctorAiAssistantView: React.FC = () => {
  const { user } = useAuth();
  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${user?.name || 'Doctor'}, I am your CareQ AI Clinical Workflow Assistant.

I can assist you with:
• Summarizing complex patient histories and lab timelines
• Extracting key clinical abnormalities from diagnostic reports
• Drafting structured SOAP consultation notes for your review
• Generating targeted patient follow-up questionnaires
• Explaining emerging pharmacological interactions and terminology

Please remember: All AI analyses are clinical decision support aids. As the treating physician, you maintain complete medical authority and oversight.`,
      timestamp: 'Just now'
    }
  ]);

  const suggestedPrompts = [
    {
      title: 'Analyze Patient Report',
      icon: FileSearch,
      query: 'Analyze a lipid panel showing Total Cholesterol 220 mg/dL, LDL 145 mg/dL, HDL 42 mg/dL, and Triglycerides 180 mg/dL for a 45-year-old patient with pre-hypertension.'
    },
    {
      title: 'Summarize Patient History',
      icon: BookOpen,
      query: 'Draft a concise 3-sentence clinical summary for a patient with 5-year history of Essential Hypertension and recent borderline elevated HbA1c (6.2%).'
    },
    {
      title: 'Prepare Consultation Notes',
      icon: FileText,
      query: 'Generate a structured SOAP note template for a follow-up consultation on Type 2 Diabetes with good glycemic control.'
    },
    {
      title: 'Explain Medical Terminology',
      icon: Stethoscope,
      query: 'Provide patient-friendly phrasing to explain "LVEF 55% with mild diastolic dysfunction" during a consultation.'
    },
    {
      title: 'Prepare Follow-up Questions',
      icon: HelpCircle,
      query: 'List 5 key clinical questions to ask during a 30-day follow-up after starting an ACE-inhibitor (Lisinopril).'
    }
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `doc_${Date.now()}`,
      sender: 'doctor',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');

    // Generate intelligent clinical response simulation
    setTimeout(() => {
      let aiResponseText = '';

      if (query.toLowerCase().includes('lipid') || query.toLowerCase().includes('cholesterol')) {
        aiResponseText = `### Clinical Laboratory Analysis: Dyslipidemia Profile

**Patient Findings:**
- Total Cholesterol: 220 mg/dL (Elevated, borderline high)
- LDL Cholesterol: 145 mg/dL (Above optimal threshold > 100 mg/dL)
- HDL Cholesterol: 42 mg/dL (Borderline low for cardiovascular protection)
- Triglycerides: 180 mg/dL (Mild hypertriglyceridemia)

**Clinical Consideration Support:**
1. **ASCVD Risk Stratification:** Calculate 10-year atherosclerotic risk considering co-existing pre-hypertension.
2. **Therapeutic Lifestyle Changes (TLC):** Mediterranean diet, saturated fat < 7% of total caloric intake, aerobic exercise 150 mins/week.
3. **Pharmacotherapy Consideration:** If 10-year risk ≥ 7.5%, moderate-intensity statin (e.g., Atorvastatin 20mg or Rosuvastatin 10mg) may be indicated upon physician review.

*Physician Review Required: This summary is generated for clinical reference and does not replace medical judgment.*`;
      } else if (query.toLowerCase().includes('soap') || query.toLowerCase().includes('notes')) {
        aiResponseText = `### Structured SOAP Clinical Consultation Template

**Subjective (S):**
Patient presents for routine quarterly follow-up of Type 2 Diabetes Mellitus. Reports adherence to prescribed oral hypoglycemic agents. Denies episodes of hypoglycemia (shakiness, diaphoresis), polyuria, polydipsia, or neuropathic symptoms in lower extremities.

**Objective (O):**
- Vitals: BP 124/78 mmHg, HR 72 bpm, Weight stable.
- Recent Labs: HbA1c 6.5% (target < 7.0%), Fasting Blood Glucose 118 mg/dL.
- Physical Exam: Well-nourished, no peripheral edema. Monofilament exam demonstrates intact sensation bilaterally.

**Assessment (A):**
Type 2 Diabetes Mellitus (ICD-10 E11.9) — Well-controlled on current medical therapy.

**Plan (P):**
1. Continue Metformin 500mg twice daily with meals.
2. Annual diabetic microalbuminuria screen and dilated eye examination scheduled.
3. Repeat HbA1c and lipid evaluation in 6 months.`;
      } else if (query.toLowerCase().includes('follow-up questions') || query.toLowerCase().includes('lisinopril')) {
        aiResponseText = `### Recommended Follow-up Questionnaire (ACE-Inhibitor Initiation)

1. **Cough Assessment:** "Have you developed any persistent, dry, tickling cough, especially at night?"
2. **Postural Tolerance:** "Have you noticed any dizziness or lightheadedness when standing up quickly?"
3. **Angioedema Screening:** "Have you experienced any sudden swelling of your lips, tongue, face, or difficulty breathing?"
4. **Renal & Electrolyte Status:** Verify that follow-up serum potassium and creatinine labs have been collected within 2–4 weeks.
5. **Home Vitals Log:** "What have your typical morning and evening home blood pressure readings looked like?"`;
      } else {
        aiResponseText = `### Clinical Analysis Summary

Regarding: "${query}"

**Key Clinical Considerations:**
• Synthesizing evidence-based clinical guidelines and pharmacological safety data.
• Ensure cross-referencing with documented patient allergies and active medication interactions.
• Prioritize patient-centric clinical communication during consultation.

*Note for Dr. ${user?.name || 'Physician'}: Please review and confirm these considerations before incorporating into your patient care plan.*`;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Suggested Quick Action Chips */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block px-1">
          Suggested Clinical Workflow Actions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestedPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.query)}
                className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl shadow-xs transition-all text-left flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 bg-teal-50 text-teal-700 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.query}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'doctor' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs ${
                  msg.sender === 'doctor' ? 'bg-slate-900' : 'bg-teal-600'
                }`}
              >
                {msg.sender === 'doctor' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === 'doctor'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                <div className="mt-2 flex items-center justify-between gap-4 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 hover:text-teal-700 text-slate-500 rounded transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask CareQ AI: e.g. Differential diagnosis for recurrent nocturnal cough..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-2xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
