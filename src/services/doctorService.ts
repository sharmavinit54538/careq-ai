import type {
  DoctorAppointment,
  DoctorPatient,
  DoctorPrescription,
  DoctorMedicalRecord,
  DoctorScheduleConfig,
  DoctorEarnings,
  DoctorAnalytics,
  DoctorNotification,
  DoctorDashboardStats,
  AppointmentStatus
} from '../types/doctor';
import { authService } from './authService';

const DOCTOR_DATA_STORAGE_KEY = 'careq_doctor_data_v1';

interface DoctorStore {
  appointments: Record<string, DoctorAppointment[]>; // doctorId -> appointments
  patients: Record<string, DoctorPatient[]>; // doctorId -> patients
  prescriptions: Record<string, DoctorPrescription[]>; // doctorId -> prescriptions
  medicalRecords: Record<string, DoctorMedicalRecord[]>; // doctorId -> records
  schedule: Record<string, DoctorScheduleConfig>; // doctorId -> schedule
  earnings: Record<string, DoctorEarnings>; // doctorId -> earnings
  notifications: Record<string, DoctorNotification[]>; // doctorId -> notifications
}

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getDateOffset = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const createInitialStore = (): DoctorStore => {
  const today = getTodayDateString();
  const yesterday = getDateOffset(-1);
  const twoDaysAgo = getDateOffset(-2);
  const fiveDaysAgo = getDateOffset(-5);
  const twelveDaysAgo = getDateOffset(-12);
  const tomorrow = getDateOffset(1);
  const inTwoDays = getDateOffset(2);

  const primaryDoctorId = 'usr_doc_001'; // Dr. Evelyn Reed

  const initialPatients: DoctorPatient[] = [
    {
      id: 'usr_pat_001',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      age: 34,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '+1 (555) 234-5678',
      email: 'patient@careq.ai',
      address: '742 Evergreen Terrace, Brooklyn, NY',
      emergencyContact: '+1 (555) 876-5432 (Spouse - Mark)',
      lastVisitDate: yesterday,
      lastAppointmentType: 'General Consultation',
      totalVisits: 6,
      medicalHistory: ['Hypertension Stage 1', 'Dyslipidemia', 'Mild Exercise-Induced Asthma'],
      allergies: ['Penicillin (Moderate rash)', 'Sulfa drugs (Hives)'],
      currentMedications: ['Atorvastatin 20mg daily', 'Lisinopril 10mg daily', 'Albuterol inhaler PRN'],
      consultationNotes: [
        {
          id: 'note_101',
          date: yesterday,
          doctorName: 'Dr. Evelyn Reed',
          diagnosis: 'Essential Hypertension - well controlled on Lisinopril',
          notes: 'Patient reports no headaches or dizziness. Blood pressure today 122/78 mmHg. Continue current therapy. Repeat lipid panel in 6 months.',
          followUpDate: getDateOffset(90)
        },
        {
          id: 'note_100',
          date: getDateOffset(-60),
          doctorName: 'Dr. Evelyn Reed',
          diagnosis: 'Borderline Dyslipidemia',
          notes: 'Discussed Mediterranean diet and aerobic exercise 150 mins/week. Started on low-dose Atorvastatin.',
          followUpDate: yesterday
        }
      ],
      followUpDate: getDateOffset(90)
    },
    {
      id: 'pat_doc_002',
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      age: 42,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+1 (555) 482-9910',
      email: 'rahul.sharma@example.com',
      address: '128 Park Avenue, Suite 4B, New York, NY',
      emergencyContact: '+1 (555) 482-9911 (Ananya Sharma)',
      lastVisitDate: twoDaysAgo,
      lastAppointmentType: 'Video Consultation',
      totalVisits: 4,
      medicalHistory: ['Type 2 Diabetes Mellitus', 'Mild Seasonal Allergies'],
      allergies: ['Aspirin (Gastric irritation)'],
      currentMedications: ['Metformin HCl 500mg BID', 'Vitamin D3 2000 IU daily'],
      consultationNotes: [
        {
          id: 'note_201',
          date: twoDaysAgo,
          doctorName: 'Dr. Evelyn Reed',
          diagnosis: 'T2DM Follow-up - HbA1c 6.8%',
          notes: 'Glycemic control improving. Fasting glucose stable at 112 mg/dL. Re-emphasized dietary fiber and reduced refined sugars.',
          followUpDate: getDateOffset(60)
        }
      ],
      followUpDate: getDateOffset(60)
    },
    {
      id: 'pat_doc_003',
      name: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      age: 29,
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+1 (555) 391-7744',
      email: 'priya.singh@example.com',
      address: '45 Columbus Circle, Apt 18E, New York, NY',
      emergencyContact: '+1 (555) 391-7700 (Parent)',
      lastVisitDate: fiveDaysAgo,
      lastAppointmentType: 'In-person Consultation',
      totalVisits: 3,
      medicalHistory: ['Migraine with visual aura', 'Mild Iron Deficiency Anemia'],
      allergies: ['No known drug allergies (NKDA)'],
      currentMedications: ['Sumatriptan 50mg PRN', 'Ferrous Sulfate 325mg daily'],
      consultationNotes: [
        {
          id: 'note_301',
          date: fiveDaysAgo,
          doctorName: 'Dr. Evelyn Reed',
          diagnosis: 'Episodic Migraine',
          notes: 'Frequency reduced to 1 episode/month with sleep hygiene and trigger avoidance. Sumatriptan effective within 45 mins of onset.',
          followUpDate: getDateOffset(45)
        }
      ],
      followUpDate: getDateOffset(45)
    },
    {
      id: 'pat_doc_004',
      name: 'Amit Kumar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      age: 51,
      gender: 'Male',
      bloodGroup: 'O-',
      phone: '+1 (555) 672-3312',
      email: 'amit.kumar@example.com',
      address: '890 Riverside Drive, New York, NY',
      emergencyContact: '+1 (555) 672-3300 (Meera Kumar)',
      lastVisitDate: twelveDaysAgo,
      lastAppointmentType: 'Cardiology Review',
      totalVisits: 8,
      medicalHistory: ['Coronary Artery Disease (s/p Stent 2023)', 'Hyperlipidemia'],
      allergies: ['NSAIDs (Bronchospasm)'],
      currentMedications: ['Clopidogrel 75mg daily', 'Rosuvastatin 20mg daily', 'Metoprolol Tartrate 25mg BID'],
      consultationNotes: [
        {
          id: 'note_401',
          date: twelveDaysAgo,
          doctorName: 'Dr. Evelyn Reed',
          diagnosis: 'Stable Ischemic Heart Disease',
          notes: 'No chest pain or exertional dyspnea. Echocardiogram shows LVEF 55% with normal wall motion. Continue medical management.',
          followUpDate: getDateOffset(90)
        }
      ],
      followUpDate: getDateOffset(90)
    },
    {
      id: 'pat_doc_005',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      age: 45,
      gender: 'Male',
      bloodGroup: 'AB+',
      phone: '+1 (555) 819-2233',
      email: 'michael.chen@example.com',
      address: '333 Hudson Street, New York, NY',
      emergencyContact: '+1 (555) 819-2200 (Lisa Chen)',
      lastVisitDate: getDateOffset(-21),
      lastAppointmentType: 'Routine Checkup',
      totalVisits: 2,
      medicalHistory: ['Mild Lumbar Strain', 'Occasional Tension Headaches'],
      allergies: ['Latex'],
      currentMedications: ['Multivitamins'],
      consultationNotes: [],
      followUpDate: getDateOffset(30)
    },
    {
      id: 'pat_doc_006',
      name: 'Anita Desai',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
      age: 38,
      gender: 'Female',
      bloodGroup: 'B-',
      phone: '+1 (555) 902-1144',
      email: 'anita.desai@example.com',
      address: '520 West End Avenue, New York, NY',
      emergencyContact: '+1 (555) 902-1100 (Karan Desai)',
      lastVisitDate: getDateOffset(-35),
      lastAppointmentType: 'Specialist Review',
      totalVisits: 5,
      medicalHistory: ['Primary Hypothyroidism', 'Mild Allergic Rhinitis'],
      allergies: ['Codeine'],
      currentMedications: ['Levothyroxine 75mcg daily'],
      consultationNotes: [],
      followUpDate: getDateOffset(14)
    }
  ];

  const initialAppointments: DoctorAppointment[] = [
    {
      id: 'apt_doc_101',
      patientId: 'pat_doc_002',
      patientName: 'Rahul Sharma',
      patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      patientAge: 42,
      patientGender: 'Male',
      patientPhone: '+1 (555) 482-9910',
      patientEmail: 'rahul.sharma@example.com',
      date: today,
      time: '09:30 AM',
      type: 'General Consultation',
      mode: 'video',
      status: 'confirmed',
      reason: 'Routine quarterly diabetes and fasting blood sugar check.',
      meetingLink: 'https://meet.careq.ai/room/cq-consult-9910',
      fee: 1500,
      createdAt: getDateOffset(-2)
    },
    {
      id: 'apt_doc_102',
      patientId: 'pat_doc_003',
      patientName: 'Priya Singh',
      patientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      patientAge: 29,
      patientGender: 'Female',
      patientPhone: '+1 (555) 391-7744',
      patientEmail: 'priya.singh@example.com',
      date: today,
      time: '11:00 AM',
      type: 'Follow-up',
      mode: 'in-person',
      status: 'scheduled',
      reason: 'Migraine frequency evaluation and prophylactic prescription renewal.',
      clinicRoom: 'Suite 402 - Examination Room B',
      fee: 1200,
      createdAt: getDateOffset(-3)
    },
    {
      id: 'apt_doc_103',
      patientId: 'pat_doc_004',
      patientName: 'Amit Kumar',
      patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      patientAge: 51,
      patientGender: 'Male',
      patientPhone: '+1 (555) 672-3312',
      patientEmail: 'amit.kumar@example.com',
      date: today,
      time: '02:30 PM',
      type: 'Specialist Review',
      mode: 'video',
      status: 'scheduled',
      reason: 'Post-angioplasty 12-month echocardiogram and lipid profile review.',
      meetingLink: 'https://meet.careq.ai/room/cq-consult-3312',
      fee: 1800,
      createdAt: getDateOffset(-1)
    },
    {
      id: 'apt_doc_104',
      patientId: 'usr_pat_001',
      patientName: 'Sarah Jenkins',
      patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      patientAge: 34,
      patientGender: 'Female',
      patientPhone: '+1 (555) 234-5678',
      patientEmail: 'patient@careq.ai',
      date: today,
      time: '04:00 PM',
      type: 'Follow-up',
      mode: 'video',
      status: 'pending',
      reason: 'Hypertension monitoring and medication tolerance assessment.',
      meetingLink: 'https://meet.careq.ai/room/cq-cardio-9128',
      fee: 1500,
      createdAt: today
    },
    {
      id: 'apt_doc_105',
      patientId: 'pat_doc_005',
      patientName: 'Michael Chen',
      patientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      patientAge: 45,
      patientGender: 'Male',
      patientPhone: '+1 (555) 819-2233',
      patientEmail: 'michael.chen@example.com',
      date: today,
      time: '05:30 PM',
      type: 'Routine Checkup',
      mode: 'in-person',
      status: 'confirmed',
      reason: 'Annual executive cardiovascular fitness clearance.',
      clinicRoom: 'Suite 402 - Examination Room A',
      fee: 1200,
      createdAt: getDateOffset(-4)
    },
    // Upcoming appointments
    {
      id: 'apt_doc_106',
      patientId: 'pat_doc_006',
      patientName: 'Anita Desai',
      patientAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
      patientAge: 38,
      patientGender: 'Female',
      patientPhone: '+1 (555) 902-1144',
      patientEmail: 'anita.desai@example.com',
      date: tomorrow,
      time: '10:00 AM',
      type: 'Specialist Review',
      mode: 'video',
      status: 'confirmed',
      reason: 'TSH titration and endocrinology consult.',
      meetingLink: 'https://meet.careq.ai/room/cq-consult-1144',
      fee: 1800,
      createdAt: getDateOffset(-1)
    },
    {
      id: 'apt_doc_107',
      patientId: 'pat_doc_002',
      patientName: 'Rahul Sharma',
      patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      patientAge: 42,
      patientGender: 'Male',
      patientPhone: '+1 (555) 482-9910',
      date: inTwoDays,
      time: '03:00 PM',
      type: 'Follow-up',
      mode: 'video',
      status: 'scheduled',
      reason: 'Dietary diary review and glucose log check.',
      fee: 1200,
      createdAt: getDateOffset(-2)
    },
    // Completed past appointments
    {
      id: 'apt_doc_108',
      patientId: 'usr_pat_001',
      patientName: 'Sarah Jenkins',
      patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      patientAge: 34,
      patientGender: 'Female',
      patientPhone: '+1 (555) 234-5678',
      date: yesterday,
      time: '11:30 AM',
      type: 'General Consultation',
      mode: 'video',
      status: 'completed',
      reason: 'Blood pressure spike post-exercise check.',
      fee: 1500,
      createdAt: getDateOffset(-3)
    },
    {
      id: 'apt_doc_109',
      patientId: 'pat_doc_004',
      patientName: 'Amit Kumar',
      patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      patientAge: 51,
      patientGender: 'Male',
      patientPhone: '+1 (555) 672-3312',
      date: twelveDaysAgo,
      time: '04:00 PM',
      type: 'Specialist Review',
      mode: 'in-person',
      status: 'completed',
      reason: '12-month post-stent cardiac evaluation.',
      fee: 1800,
      createdAt: getDateOffset(-15)
    }
  ];

  const initialPrescriptions: DoctorPrescription[] = [
    {
      id: 'rx_doc_501',
      patientId: 'usr_pat_001',
      patientName: 'Sarah Jenkins',
      patientAge: 34,
      patientGender: 'Female',
      doctorId: primaryDoctorId,
      doctorName: 'Dr. Evelyn Reed',
      date: yesterday,
      status: 'issued',
      diagnosis: 'Essential Hypertension (ICD-10 I10) & Hyperlipidemia',
      clinicalNotes: 'Blood pressure remains well-controlled. Continue current lipid-lowering therapy.',
      medicines: [
        {
          id: 'med_1',
          name: 'Atorvastatin Calcium',
          dosage: '20mg',
          frequency: '1 tablet once daily',
          duration: '90 days',
          instructions: 'Take orally at bedtime. Avoid grapefruit products.'
        },
        {
          id: 'med_2',
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: '1 tablet every morning',
          duration: '90 days',
          instructions: 'Monitor blood pressure weekly. Report persistent dry cough.'
        }
      ],
      followUpDate: getDateOffset(90),
      issuedAt: yesterday,
      createdAt: yesterday
    },
    {
      id: 'rx_doc_502',
      patientId: 'pat_doc_002',
      patientName: 'Rahul Sharma',
      patientAge: 42,
      patientGender: 'Male',
      doctorId: primaryDoctorId,
      doctorName: 'Dr. Evelyn Reed',
      date: twoDaysAgo,
      status: 'issued',
      diagnosis: 'Type 2 Diabetes Mellitus without complications (ICD-10 E11.9)',
      clinicalNotes: 'HbA1c target < 7.0%. Exercise 30 minutes daily.',
      medicines: [
        {
          id: 'med_3',
          name: 'Metformin Hydrochloride (Glucophage)',
          dosage: '500mg',
          frequency: '1 tablet twice daily with meals',
          duration: '60 days',
          instructions: 'Take with breakfast and dinner to minimize GI distress.'
        }
      ],
      followUpDate: getDateOffset(60),
      issuedAt: twoDaysAgo,
      createdAt: twoDaysAgo
    },
    {
      id: 'rx_doc_503',
      patientId: 'pat_doc_003',
      patientName: 'Priya Singh',
      patientAge: 29,
      patientGender: 'Female',
      doctorId: primaryDoctorId,
      doctorName: 'Dr. Evelyn Reed',
      date: fiveDaysAgo,
      status: 'active',
      diagnosis: 'Migraine with Aura (ICD-10 G43.1)',
      clinicalNotes: 'Acute abortive treatment for migraine attacks.',
      medicines: [
        {
          id: 'med_4',
          name: 'Sumatriptan Succinate',
          dosage: '50mg',
          frequency: '1 tablet at onset of migraine',
          duration: 'As needed (Max 2 tabs / 24h)',
          instructions: 'Take immediately when aura begins. Rest in a dark, quiet room.'
        }
      ],
      followUpDate: getDateOffset(45),
      issuedAt: fiveDaysAgo,
      createdAt: fiveDaysAgo
    },
    {
      id: 'rx_doc_504',
      patientId: 'pat_doc_005',
      patientName: 'Michael Chen',
      patientAge: 45,
      patientGender: 'Male',
      doctorId: primaryDoctorId,
      doctorName: 'Dr. Evelyn Reed',
      date: today,
      status: 'draft',
      diagnosis: 'Pre-hypertension / Lifestyle Management',
      clinicalNotes: 'Drafting initial wellness regimen and co-enzyme Q10 supplement recommendation.',
      medicines: [
        {
          id: 'med_5',
          name: 'Coenzyme Q10 (Ubiquinol)',
          dosage: '100mg',
          frequency: '1 softgel daily',
          duration: '30 days',
          instructions: 'Take with food.'
        }
      ],
      createdAt: today
    }
  ];

  const initialMedicalRecords: DoctorMedicalRecord[] = [
    {
      id: 'rec_doc_701',
      patientId: 'usr_pat_001',
      patientName: 'Sarah Jenkins',
      name: 'Comprehensive Metabolic & Lipid Panel.pdf',
      category: 'Lab Reports',
      date: yesterday,
      uploadedBy: 'Quest Diagnostics Regional Lab',
      fileSize: '1.8 MB',
      fileUrl: '#',
      summary: 'Total Cholesterol: 184 mg/dL, LDL: 98 mg/dL, HDL: 56 mg/dL, Triglycerides: 142 mg/dL. All values within target therapeutic range.'
    },
    {
      id: 'rec_doc_702',
      patientId: 'usr_pat_001',
      patientName: 'Sarah Jenkins',
      name: 'Echocardiogram 2D Doppler Study.pdf',
      category: 'Imaging',
      date: getDateOffset(-60),
      uploadedBy: 'Mount Sinai Radiology Center',
      fileSize: '4.2 MB',
      fileUrl: '#',
      summary: 'Normal left ventricular size and systolic function. LVEF estimated at 60-65%. No significant valvular regurgitation.'
    },
    {
      id: 'rec_doc_703',
      patientId: 'pat_doc_002',
      patientName: 'Rahul Sharma',
      name: 'Glycated Hemoglobin (HbA1c) Report.pdf',
      category: 'Lab Reports',
      date: twoDaysAgo,
      uploadedBy: 'BioReference Laboratories',
      fileSize: '1.2 MB',
      fileUrl: '#',
      summary: 'HbA1c level: 6.8%. Estimated average glucose: 149 mg/dL. Showing favorable downward trend from previous 7.4%.'
    },
    {
      id: 'rec_doc_704',
      patientId: 'pat_doc_004',
      patientName: 'Amit Kumar',
      name: 'Coronary Angiogram & Stent Followup.pdf',
      category: 'Imaging',
      date: twelveDaysAgo,
      uploadedBy: 'Mount Sinai Cath Lab',
      fileSize: '6.5 MB',
      fileUrl: '#',
      summary: 'Patent drug-eluting stent in proximal LAD. TIMI 3 flow confirmed. No in-stent restenosis observed.'
    },
    {
      id: 'rec_doc_705',
      patientId: 'pat_doc_003',
      patientName: 'Priya Singh',
      name: 'Brain MRI T1/T2 Axial Non-Contrast.pdf',
      category: 'Imaging',
      date: getDateOffset(-90),
      uploadedBy: 'Lenox Hill Radiology Imaging',
      fileSize: '8.4 MB',
      fileUrl: '#',
      summary: 'Unremarkable brain MRI. No evidence of acute ischemia, hemorrhage, mass effect, or structural etiology for migraine aura.'
    },
    {
      id: 'rec_doc_706',
      patientId: 'pat_doc_005',
      patientName: 'Michael Chen',
      name: 'Executive Cardiac Stress Test Report.pdf',
      category: 'Lab Reports',
      date: getDateOffset(-21),
      uploadedBy: 'CareQ Diagnostic Center',
      fileSize: '2.1 MB',
      fileUrl: '#',
      summary: 'Bruce protocol completed to Stage 4 (12 METs). Negative for exercise-induced myocardial ischemia or arrhythmias.'
    },
    {
      id: 'rec_doc_707',
      patientId: 'usr_pat_001',
      patientName: 'Sarah Jenkins',
      name: 'Clinical Assessment & Care Plan Notes.pdf',
      category: 'Doctor Notes',
      date: yesterday,
      uploadedBy: 'Dr. Evelyn Reed',
      fileSize: '850 KB',
      fileUrl: '#',
      summary: 'Annual cardiovascular risk profile assessment. Risk categorized as Low-Moderate with aggressive lifestyle goals.'
    }
  ];

  const initialSchedule: DoctorScheduleConfig = {
    weekly: {
      Monday: {
        available: true,
        startTime: '09:00 AM',
        endTime: '08:00 PM',
        breaks: [{ start: '01:00 PM', end: '04:00 PM' }]
      },
      Tuesday: {
        available: true,
        startTime: '09:00 AM',
        endTime: '08:00 PM',
        breaks: [{ start: '01:00 PM', end: '04:00 PM' }]
      },
      Wednesday: {
        available: true,
        startTime: '09:00 AM',
        endTime: '08:00 PM',
        breaks: [{ start: '01:00 PM', end: '04:00 PM' }]
      },
      Thursday: {
        available: true,
        startTime: '09:00 AM',
        endTime: '08:00 PM',
        breaks: [{ start: '01:00 PM', end: '04:00 PM' }]
      },
      Friday: {
        available: true,
        startTime: '09:00 AM',
        endTime: '08:00 PM',
        breaks: [{ start: '01:00 PM', end: '04:00 PM' }]
      },
      Saturday: {
        available: true,
        startTime: '09:00 AM',
        endTime: '01:00 PM',
        breaks: []
      },
      Sunday: {
        available: false,
        startTime: '10:00 AM',
        endTime: '02:00 PM',
        breaks: []
      }
    },
    consultationDuration: 20,
    allowOnline: true,
    allowInPerson: true,
    emergencyAvailable: true,
    holidays: ['2026-11-26', '2026-12-25', '2027-01-01'],
    leaveDates: []
  };

  const initialEarnings: DoctorEarnings = {
    todayEarnings: 12450,
    thisWeekEarnings: 48200,
    thisMonthEarnings: 184500,
    totalEarnings: 842000,
    pendingPayout: 14200,
    transactions: [
      {
        id: 'txn_901',
        date: today,
        patientName: 'Rahul Sharma',
        patientId: 'pat_doc_002',
        appointmentRef: 'apt_doc_101',
        consultationType: 'Video Consultation',
        amount: 1500,
        status: 'paid'
      },
      {
        id: 'txn_902',
        date: today,
        patientName: 'Priya Singh',
        patientId: 'pat_doc_003',
        appointmentRef: 'apt_doc_102',
        consultationType: 'In-person Consultation',
        amount: 1200,
        status: 'paid'
      },
      {
        id: 'txn_903',
        date: today,
        patientName: 'Amit Kumar',
        patientId: 'pat_doc_004',
        appointmentRef: 'apt_doc_103',
        consultationType: 'Cardiology Review',
        amount: 1800,
        status: 'paid'
      },
      {
        id: 'txn_904',
        date: today,
        patientName: 'Michael Chen',
        patientId: 'pat_doc_005',
        appointmentRef: 'apt_doc_105',
        consultationType: 'Routine Checkup',
        amount: 1200,
        status: 'paid'
      },
      {
        id: 'txn_905',
        date: today,
        patientName: 'Sarah Jenkins',
        patientId: 'usr_pat_001',
        appointmentRef: 'apt_doc_104',
        consultationType: 'Follow-up Consultation',
        amount: 1500,
        status: 'pending'
      },
      {
        id: 'txn_906',
        date: yesterday,
        patientName: 'Sarah Jenkins',
        patientId: 'usr_pat_001',
        appointmentRef: 'apt_doc_108',
        consultationType: 'General Consultation',
        amount: 1500,
        status: 'paid'
      },
      {
        id: 'txn_907',
        date: twoDaysAgo,
        patientName: 'Rahul Sharma',
        patientId: 'pat_doc_002',
        appointmentRef: 'apt_doc_101_prev',
        consultationType: 'Video Consultation',
        amount: 1500,
        status: 'paid'
      },
      {
        id: 'txn_908',
        date: fiveDaysAgo,
        patientName: 'Priya Singh',
        patientId: 'pat_doc_003',
        appointmentRef: 'apt_doc_102_prev',
        consultationType: 'In-person Consultation',
        amount: 1200,
        status: 'paid'
      },
      {
        id: 'txn_909',
        date: twelveDaysAgo,
        patientName: 'Amit Kumar',
        patientId: 'pat_doc_004',
        appointmentRef: 'apt_doc_109',
        consultationType: 'Specialist Review',
        amount: 1800,
        status: 'paid'
      }
    ]
  };

  const initialNotifications: DoctorNotification[] = [
    {
      id: 'notif_doc_01',
      type: 'appointment_request',
      title: 'New Appointment Requested',
      message: 'Sarah Jenkins has booked a follow-up consultation for today at 04:00 PM.',
      timestamp: '15 minutes ago',
      isRead: false,
      actionUrl: '/doctor/appointments',
      patientId: 'usr_pat_001'
    },
    {
      id: 'notif_doc_02',
      type: 'report_uploaded',
      title: 'New Diagnostic Report Uploaded',
      message: 'Quest Diagnostics uploaded Comprehensive Metabolic & Lipid Panel for Sarah Jenkins.',
      timestamp: '2 hours ago',
      isRead: false,
      actionUrl: '/doctor/medical-records',
      patientId: 'usr_pat_001'
    },
    {
      id: 'notif_doc_03',
      type: 'reminder',
      title: 'Upcoming Consultation in 30 Mins',
      message: 'Consultation with Rahul Sharma starts at 09:30 AM via Telehealth Video.',
      timestamp: '1 hour ago',
      isRead: false,
      actionUrl: '/doctor/consultations',
      patientId: 'pat_doc_002'
    },
    {
      id: 'notif_doc_04',
      type: 'payment_received',
      title: 'Consultation Fee Settled',
      message: 'Payment of ₹1,800 received for consultation with Amit Kumar.',
      timestamp: 'Yesterday',
      isRead: true,
      actionUrl: '/doctor/earnings'
    },
    {
      id: 'notif_doc_05',
      type: 'admin_message',
      title: 'Board Credential Audit Completed',
      message: 'Your New York State medical board license verification MED-REG-847291-NY is approved with full clinical privileges.',
      timestamp: '3 days ago',
      isRead: true,
      actionUrl: '/doctor/profile'
    }
  ];

  return {
    appointments: { [primaryDoctorId]: initialAppointments },
    patients: { [primaryDoctorId]: initialPatients },
    prescriptions: { [primaryDoctorId]: initialPrescriptions },
    medicalRecords: { [primaryDoctorId]: initialMedicalRecords },
    schedule: { [primaryDoctorId]: initialSchedule },
    earnings: { [primaryDoctorId]: initialEarnings },
    notifications: { [primaryDoctorId]: initialNotifications }
  };
};

class DoctorService {
  private store: DoctorStore;

  constructor() {
    this.store = this.loadStore();
  }

  private loadStore(): DoctorStore {
    try {
      const data = localStorage.getItem(DOCTOR_DATA_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    const initial = createInitialStore();
    this.saveStore(initial);
    return initial;
  }

  private saveStore(store: DoctorStore) {
    try {
      localStorage.setItem(DOCTOR_DATA_STORAGE_KEY, JSON.stringify(store));
      this.store = store;
    } catch {
      // ignore
    }
  }

  // Ensure doctor data initialized
  private ensureDoctor(doctorId: string) {
    if (!this.store.appointments[doctorId]) {
      // clone from primary if new doctor or empty
      const primary = 'usr_doc_001';
      this.store.appointments[doctorId] = this.store.appointments[primary] ? [...this.store.appointments[primary]] : [];
      this.store.patients[doctorId] = this.store.patients[primary] ? [...this.store.patients[primary]] : [];
      this.store.prescriptions[doctorId] = this.store.prescriptions[primary] ? [...this.store.prescriptions[primary]] : [];
      this.store.medicalRecords[doctorId] = this.store.medicalRecords[primary] ? [...this.store.medicalRecords[primary]] : [];
      this.store.schedule[doctorId] = this.store.schedule[primary] ? JSON.parse(JSON.stringify(this.store.schedule[primary])) : (createInitialStore().schedule[primary]);
      this.store.earnings[doctorId] = this.store.earnings[primary] ? JSON.parse(JSON.stringify(this.store.earnings[primary])) : (createInitialStore().earnings[primary]);
      this.store.notifications[doctorId] = this.store.notifications[primary] ? [...this.store.notifications[primary]] : [];
      this.saveStore(this.store);
    }
  }

  // Get current logged in doctor user
  async getCurrentDoctor() {
    return authService.getCurrentUser();
  }

  // 1. Dashboard Statistics
  async getDoctorStats(doctorId: string): Promise<DoctorDashboardStats> {
    this.ensureDoctor(doctorId);
    const today = getTodayDateString();
    const apts = this.store.appointments[doctorId] || [];
    const patients = this.store.patients[doctorId] || [];
    const earnings = this.store.earnings[doctorId];

    const todayApts = apts.filter((a) => a.date === today);
    const pendingApts = apts.filter((a) => a.status === 'pending');

    return {
      todayAppointmentsCount: todayApts.length,
      totalPatientsCount: patients.length,
      pendingRequestsCount: pendingApts.length,
      todayEarningsAmount: earnings ? earnings.todayEarnings : 0
    };
  }

  // 2. Appointments
  async getAppointments(
    doctorId: string,
    filter?: {
      status?: string;
      tab?: 'all' | 'today' | 'upcoming' | 'pending' | 'completed' | 'cancelled';
      search?: string;
      date?: string;
      type?: string;
    }
  ): Promise<DoctorAppointment[]> {
    this.ensureDoctor(doctorId);
    let list = [...(this.store.appointments[doctorId] || [])];
    const today = getTodayDateString();

    if (filter) {
      if (filter.tab === 'today') {
        list = list.filter((a) => a.date === today);
      } else if (filter.tab === 'upcoming') {
        list = list.filter((a) => a.date >= today && a.status !== 'completed' && a.status !== 'cancelled');
      } else if (filter.tab === 'pending') {
        list = list.filter((a) => a.status === 'pending');
      } else if (filter.tab === 'completed') {
        list = list.filter((a) => a.status === 'completed');
      } else if (filter.tab === 'cancelled') {
        list = list.filter((a) => a.status === 'cancelled');
      }

      if (filter.status && filter.status !== 'all') {
        list = list.filter((a) => a.status === filter.status);
      }

      if (filter.date) {
        list = list.filter((a) => a.date === filter.date);
      }

      if (filter.type && filter.type !== 'all') {
        list = list.filter((a) => a.type.toLowerCase().includes(filter.type!.toLowerCase()) || a.mode.toLowerCase().includes(filter.type!.toLowerCase()));
      }

      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(
          (a) =>
            a.patientName.toLowerCase().includes(q) ||
            a.type.toLowerCase().includes(q) ||
            (a.reason && a.reason.toLowerCase().includes(q))
        );
      }
    }

    // Sort by date then time
    return list.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });
  }

  async getAppointmentById(doctorId: string, appointmentId: string): Promise<DoctorAppointment | null> {
    this.ensureDoctor(doctorId);
    const apts = this.store.appointments[doctorId] || [];
    return apts.find((a) => a.id === appointmentId) || null;
  }

  async updateAppointmentStatus(doctorId: string, appointmentId: string, status: AppointmentStatus): Promise<boolean> {
    this.ensureDoctor(doctorId);
    const list = this.store.appointments[doctorId] || [];
    const idx = list.findIndex((a) => a.id === appointmentId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], status };
      this.saveStore(this.store);
      return true;
    }
    return false;
  }

  async rescheduleAppointment(doctorId: string, appointmentId: string, newDate: string, newTime: string): Promise<boolean> {
    this.ensureDoctor(doctorId);
    const list = this.store.appointments[doctorId] || [];
    const idx = list.findIndex((a) => a.id === appointmentId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], date: newDate, time: newTime, status: 'confirmed' };
      this.saveStore(this.store);
      return true;
    }
    return false;
  }

  // 3. Patients
  async getPatients(doctorId: string, searchQuery?: string): Promise<DoctorPatient[]> {
    this.ensureDoctor(doctorId);
    let list = this.store.patients[doctorId] || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.medicalHistory.some((m) => m.toLowerCase().includes(q))
      );
    }
    return list;
  }

  async getPatientDetails(doctorId: string, patientId: string): Promise<DoctorPatient | null> {
    this.ensureDoctor(doctorId);
    const list = this.store.patients[doctorId] || [];
    const patient = list.find((p) => p.id === patientId);
    return patient || null;
  }

  // 4. Consultations
  async getConsultations(doctorId: string): Promise<DoctorAppointment[]> {
    this.ensureDoctor(doctorId);
    const apts = this.store.appointments[doctorId] || [];
    return apts.filter((a) => a.status === 'confirmed' || a.status === 'in_progress' || a.status === 'scheduled');
  }

  async createConsultationNotes(
    doctorId: string,
    patientId: string,
    diagnosis: string,
    notes: string,
    followUpDate?: string
  ): Promise<boolean> {
    this.ensureDoctor(doctorId);
    const patients = this.store.patients[doctorId] || [];
    const patIdx = patients.findIndex((p) => p.id === patientId);
    if (patIdx === -1) return false;

    const doctorUser = await this.getCurrentDoctor();
    const newNote = {
      id: `note_${Date.now()}`,
      date: getTodayDateString(),
      doctorName: doctorUser?.name || 'Dr. Evelyn Reed',
      diagnosis,
      notes,
      followUpDate
    };

    patients[patIdx].consultationNotes = [newNote, ...(patients[patIdx].consultationNotes || [])];
    if (followUpDate) {
      patients[patIdx].followUpDate = followUpDate;
    }
    patients[patIdx].lastVisitDate = getTodayDateString();

    this.saveStore(this.store);
    return true;
  }

  // 5. Prescriptions
  async getPrescriptions(doctorId: string): Promise<DoctorPrescription[]> {
    this.ensureDoctor(doctorId);
    return this.store.prescriptions[doctorId] || [];
  }

  async createPrescription(
    doctorId: string,
    data: Omit<DoctorPrescription, 'id' | 'doctorId' | 'doctorName' | 'createdAt'>
  ): Promise<DoctorPrescription> {
    this.ensureDoctor(doctorId);
    const doctorUser = await this.getCurrentDoctor();
    const newRx: DoctorPrescription = {
      id: `rx_doc_${Date.now()}`,
      ...data,
      doctorId,
      doctorName: doctorUser?.name || 'Dr. Evelyn Reed',
      createdAt: getTodayDateString()
    };

    const list = this.store.prescriptions[doctorId] || [];
    this.store.prescriptions[doctorId] = [newRx, ...list];
    this.saveStore(this.store);
    return newRx;
  }

  async updatePrescriptionStatus(doctorId: string, prescriptionId: string, status: 'draft' | 'issued'): Promise<boolean> {
    this.ensureDoctor(doctorId);
    const list = this.store.prescriptions[doctorId] || [];
    const idx = list.findIndex((p) => p.id === prescriptionId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status,
        issuedAt: status === 'issued' ? getTodayDateString() : list[idx].issuedAt
      };
      this.saveStore(this.store);
      return true;
    }
    return false;
  }

  // 6. Medical Records
  async getMedicalRecords(doctorId: string, category?: string, patientId?: string): Promise<DoctorMedicalRecord[]> {
    this.ensureDoctor(doctorId);
    let list = this.store.medicalRecords[doctorId] || [];
    if (category && category !== 'All') {
      list = list.filter((r) => r.category === category);
    }
    if (patientId) {
      list = list.filter((r) => r.patientId === patientId);
    }
    return list;
  }

  // 7. Schedule
  async getSchedule(doctorId: string): Promise<DoctorScheduleConfig> {
    this.ensureDoctor(doctorId);
    return this.store.schedule[doctorId] || createInitialStore().schedule['usr_doc_001'];
  }

  async updateAvailability(doctorId: string, schedule: DoctorScheduleConfig): Promise<boolean> {
    this.ensureDoctor(doctorId);
    this.store.schedule[doctorId] = schedule;
    this.saveStore(this.store);
    return true;
  }

  // 8. Analytics
  async getAnalytics(doctorId: string): Promise<DoctorAnalytics> {
    this.ensureDoctor(doctorId);
    const apts = this.store.appointments[doctorId] || [];
    const patients = this.store.patients[doctorId] || [];
    const earnings = this.store.earnings[doctorId];

    const completed = apts.filter((a) => a.status === 'completed').length;
    const cancelled = apts.filter((a) => a.status === 'cancelled').length;
    const total = apts.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 92;

    const videoCount = apts.filter((a) => a.mode === 'video').length;
    const inPersonCount = apts.filter((a) => a.mode === 'in-person').length;
    const audioCount = apts.filter((a) => a.mode === 'audio').length;

    return {
      totalAppointments: total + 38,
      completedConsultations: completed + 34,
      cancelledAppointments: cancelled + 2,
      newPatients: 14,
      returningPatients: patients.length,
      completionRate: rate,
      avgConsultationsPerDay: 7.4,
      totalRevenue: earnings ? earnings.totalEarnings : 842000,
      weeklyTrends: [
        { day: 'Mon', count: 8, completed: 8 },
        { day: 'Tue', count: 9, completed: 8 },
        { day: 'Wed', count: 7, completed: 7 },
        { day: 'Thu', count: 11, completed: 10 },
        { day: 'Fri', count: 8, completed: 8 },
        { day: 'Sat', count: 4, completed: 4 },
        { day: 'Sun', count: 0, completed: 0 }
      ],
      typeDistribution: {
        video: videoCount + 22,
        inPerson: inPersonCount + 14,
        audio: audioCount + 4
      },
      monthlyRevenue: [
        { month: 'May', amount: 142000 },
        { month: 'Jun', amount: 156000 },
        { month: 'Jul', amount: 168000 },
        { month: 'Aug', amount: 172000 },
        { month: 'Sep', amount: 184500 },
        { month: 'Oct', amount: 96450 }
      ]
    };
  }

  // 9. Earnings
  async getEarnings(doctorId: string): Promise<DoctorEarnings> {
    this.ensureDoctor(doctorId);
    return this.store.earnings[doctorId] || createInitialStore().earnings['usr_doc_001'];
  }

  // 10. Notifications
  async getNotifications(doctorId: string): Promise<DoctorNotification[]> {
    this.ensureDoctor(doctorId);
    return this.store.notifications[doctorId] || [];
  }

  async markNotificationAsRead(doctorId: string, notificationId: string): Promise<boolean> {
    this.ensureDoctor(doctorId);
    const list = this.store.notifications[doctorId] || [];
    const idx = list.findIndex((n) => n.id === notificationId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], isRead: true };
      this.saveStore(this.store);
      return true;
    }
    return false;
  }

  async markAllNotificationsAsRead(doctorId: string): Promise<boolean> {
    this.ensureDoctor(doctorId);
    const list = this.store.notifications[doctorId] || [];
    this.store.notifications[doctorId] = list.map((n) => ({ ...n, isRead: true }));
    this.saveStore(this.store);
    return true;
  }

  async clearAllNotifications(doctorId: string): Promise<boolean> {
    this.ensureDoctor(doctorId);
    this.store.notifications[doctorId] = [];
    this.saveStore(this.store);
    return true;
  }

  // 11. Profile Update
  async updateDoctorProfile(
    doctorId: string,
    updates: {
      name?: string;
      phone?: string;
      specialization?: string;
      qualification?: string;
      hospitalName?: string;
      experienceYears?: number;
      consultationFee?: number;
      languages?: string[];
      about?: string;
    }
  ): Promise<boolean> {
    this.ensureDoctor(doctorId);
    const storedUsersRaw = localStorage.getItem('careq_users_db_v1');
    if (storedUsersRaw) {
      try {
        const users = JSON.parse(storedUsersRaw);
        const idx = users.findIndex((u: any) => u.id === doctorId);
        if (idx !== -1) {
          if (updates.name) users[idx].name = updates.name.trim();
          if (updates.phone) users[idx].phone = updates.phone.trim();
          if (users[idx].doctorProfile) {
            if (updates.specialization) users[idx].doctorProfile.specialization = updates.specialization;
            if (updates.qualification) users[idx].doctorProfile.qualification = updates.qualification;
            if (updates.hospitalName) users[idx].doctorProfile.hospitalName = updates.hospitalName;
            if (updates.experienceYears !== undefined) users[idx].doctorProfile.experienceYears = updates.experienceYears;
          }
          localStorage.setItem('careq_users_db_v1', JSON.stringify(users));

          // Also update session
          const sessionRaw = localStorage.getItem('careq_session_token_v1') || sessionStorage.getItem('careq_session_token_v1');
          if (sessionRaw) {
            const sess = JSON.parse(sessionRaw);
            if (sess.user && sess.user.id === doctorId) {
              sess.user = { ...sess.user, ...users[idx] };
              if (sess.rememberMe) {
                localStorage.setItem('careq_session_token_v1', JSON.stringify(sess));
              } else {
                sessionStorage.setItem('careq_session_token_v1', JSON.stringify(sess));
              }
            }
          }
          return true;
        }
      } catch {
        // ignore
      }
    }
    return false;
  }
}

export const doctorService = new DoctorService();
