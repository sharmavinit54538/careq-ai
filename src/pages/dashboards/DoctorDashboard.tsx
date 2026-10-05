import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
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
  PrescriptionMedicineItem
} from '../../types/doctor';

// Doctor Shared Components
import { DoctorSidebar } from '../../components/doctor/DoctorSidebar';
import { DoctorHeader } from '../../components/doctor/DoctorHeader';

// Doctor Subviews
import { DoctorDashboardHomeView } from '../../components/doctor/views/DoctorDashboardHomeView';
import { DoctorAppointmentsView } from '../../components/doctor/views/DoctorAppointmentsView';
import { DoctorPatientsView } from '../../components/doctor/views/DoctorPatientsView';
import { DoctorPatientDetailView } from '../../components/doctor/views/DoctorPatientDetailView';
import { DoctorConsultationsView } from '../../components/doctor/views/DoctorConsultationsView';
import { DoctorPrescriptionsView } from '../../components/doctor/views/DoctorPrescriptionsView';
import { DoctorMedicalRecordsView } from '../../components/doctor/views/DoctorMedicalRecordsView';
import { DoctorScheduleView } from '../../components/doctor/views/DoctorScheduleView';
import { DoctorAnalyticsView } from '../../components/doctor/views/DoctorAnalyticsView';
import { DoctorEarningsView } from '../../components/doctor/views/DoctorEarningsView';
import { DoctorNotificationsView } from '../../components/doctor/views/DoctorNotificationsView';
import { DoctorAiAssistantView } from '../../components/doctor/views/DoctorAiAssistantView';
import { DoctorProfileView } from '../../components/doctor/views/DoctorProfileView';
import { DoctorSettingsView } from '../../components/doctor/views/DoctorSettingsView';

// Doctor Modals
import { CreatePrescriptionModal } from '../../components/doctor/modals/CreatePrescriptionModal';
import { AppointmentDetailsModal } from '../../components/doctor/modals/AppointmentDetailsModal';
import { RescheduleAppointmentModal } from '../../components/doctor/modals/RescheduleAppointmentModal';
import { ViewRecordModal } from '../../components/doctor/modals/ViewRecordModal';
import { EditDoctorProfileModal } from '../../components/doctor/modals/EditDoctorProfileModal';
import { ViewPrescriptionModal } from '../../components/doctor/modals/ViewPrescriptionModal';

export const DoctorDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile drawer and sidebar collapse
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data States
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [stats, setStats] = useState<DoctorDashboardStats | null>(null);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [prescriptions, setPrescriptions] = useState<DoctorPrescription[]>([]);
  const [records, setRecords] = useState<DoctorMedicalRecord[]>([]);
  const [schedule, setSchedule] = useState<DoctorScheduleConfig | null>(null);
  const [analytics, setAnalytics] = useState<DoctorAnalytics | null>(null);
  const [earnings, setEarnings] = useState<DoctorEarnings | null>(null);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);

  // Modals
  const [isCreateRxModalOpen, setIsCreateRxModalOpen] = useState(false);
  const [selectedPatientForRx, setSelectedPatientForRx] = useState<DoctorPatient | null>(null);

  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<DoctorAppointment | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<DoctorAppointment | null>(null);
  const [recordToView, setRecordToView] = useState<DoctorMedicalRecord | null>(null);
  const [selectedPrescriptionToView, setSelectedPrescriptionToView] = useState<DoctorPrescription | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Load All Doctor Data
  const loadDoctorData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setIsError(false);

    try {
      const doctorId = user.id;
      const [
        dashboardStats,
        appointmentsData,
        patientsData,
        prescriptionsData,
        recordsData,
        scheduleData,
        analyticsData,
        earningsData,
        notificationsData
      ] = await Promise.all([
        doctorService.getDoctorStats(doctorId),
        doctorService.getAppointments(doctorId),
        doctorService.getPatients(doctorId),
        doctorService.getPrescriptions(doctorId),
        doctorService.getMedicalRecords(doctorId),
        doctorService.getSchedule(doctorId),
        doctorService.getAnalytics(doctorId),
        doctorService.getEarnings(doctorId),
        doctorService.getNotifications(doctorId)
      ]);

      setStats(dashboardStats);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setPrescriptions(prescriptionsData);
      setRecords(recordsData);
      setSchedule(scheduleData);
      setAnalytics(analyticsData);
      setEarnings(earningsData);
      setNotifications(notificationsData);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDoctorData();
  }, [loadDoctorData]);

  // Handlers
  const handleConfirmAppointment = async (appointmentId: string) => {
    if (!user) return;
    await doctorService.updateAppointmentStatus(user.id, appointmentId, 'confirmed');
    await loadDoctorData();
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!user) return;
    await doctorService.updateAppointmentStatus(user.id, appointmentId, 'cancelled');
    await loadDoctorData();
  };

  const handleRescheduleAppointment = async (
    appointmentId: string,
    newDate: string,
    newTime: string
  ) => {
    if (!user) return;
    await doctorService.rescheduleAppointment(user.id, appointmentId, newDate, newTime);
    await loadDoctorData();
  };

  const handleSaveConsultationNotes = async (
    patientId: string,
    diagnosis: string,
    notes: string,
    followUpDate?: string
  ) => {
    if (!user) return;
    await doctorService.createConsultationNotes(user.id, patientId, diagnosis, notes, followUpDate);
    await loadDoctorData();
  };

  const handleCompleteConsultation = async (appointmentId: string) => {
    if (!user) return;
    await doctorService.updateAppointmentStatus(user.id, appointmentId, 'completed');
    await loadDoctorData();
  };

  const handleSavePrescription = async (
    patient: DoctorPatient,
    diagnosis: string,
    notes: string,
    medicines: PrescriptionMedicineItem[],
    followUpDate: string,
    status: 'draft' | 'issued'
  ) => {
    if (!user) return;
    await doctorService.createPrescription(user.id, {
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      date: new Date().toISOString().split('T')[0],
      status,
      diagnosis,
      clinicalNotes: notes,
      medicines,
      followUpDate,
      issuedAt: status === 'issued' ? new Date().toISOString().split('T')[0] : undefined
    });
    await loadDoctorData();
  };

  const handleIssueDraft = async (prescriptionId: string) => {
    if (!user) return;
    await doctorService.updatePrescriptionStatus(user.id, prescriptionId, 'issued');
    await loadDoctorData();
  };

  const handleSaveSchedule = async (newSchedule: DoctorScheduleConfig) => {
    if (!user) return;
    await doctorService.updateAvailability(user.id, newSchedule);
    await loadDoctorData();
  };

  const handleMarkNotificationRead = async (id: string) => {
    if (!user) return;
    await doctorService.markNotificationAsRead(user.id, id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!user) return;
    await doctorService.markAllNotificationsAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAllNotifications = async () => {
    if (!user) return;
    await doctorService.clearAllNotifications(user.id);
    setNotifications([]);
  };

  const handleSaveProfile = async (updates: any) => {
    if (!user) return;
    await doctorService.updateDoctorProfile(user.id, updates);
    await refreshUser();
    await loadDoctorData();
  };

  // Determine active view based on route path
  const pathname = location.pathname;
  let pageTitle = 'Dashboard';
  let currentView: React.ReactNode = null;

  // Extract patient ID if path is /doctor/patients/:id
  const patientDetailMatch = pathname.match(/^\/doctor\/patients\/([^/]+)$/);
  const patientDetailId = patientDetailMatch ? patientDetailMatch[1] : null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  if (patientDetailId) {
    pageTitle = 'Patient Clinical Record';
    const currentPatient = patients.find((p) => p.id === patientDetailId) || null;
    currentView = (
      <DoctorPatientDetailView
        patient={currentPatient}
        appointments={appointments}
        prescriptions={prescriptions}
        records={records}
        isLoading={isLoading}
        onStartConsultation={(p) => {
          navigate('/doctor/consultations', {
            state: {
              appointment: appointments.find((a) => a.patientId === p.id)
            }
          });
        }}
        onCreatePrescription={(p) => {
          setSelectedPatientForRx(p);
          setIsCreateRxModalOpen(true);
        }}
        onAddNote={handleSaveConsultationNotes}
      />
    );
  } else if (pathname.startsWith('/doctor/appointments')) {
    pageTitle = 'Appointments';
    currentView = (
      <DoctorAppointmentsView
        appointments={appointments}
        onStartConsultation={(apt) => {
          navigate('/doctor/consultations', { state: { appointment: apt } });
        }}
        onViewDetails={(apt) => setSelectedAppointmentDetails(apt)}
        onConfirmAppointment={handleConfirmAppointment}
        onCancelAppointment={handleCancelAppointment}
        onRescheduleAppointment={(apt) => setAppointmentToReschedule(apt)}
      />
    );
  } else if (pathname.startsWith('/doctor/patients')) {
    pageTitle = 'My Patients';
    currentView = (
      <DoctorPatientsView
        patients={patients}
        isLoading={isLoading}
      />
    );
  } else if (pathname.startsWith('/doctor/consultations')) {
    pageTitle = 'Consultations';
    currentView = (
      <DoctorConsultationsView
        consultations={appointments.filter((a) => a.status === 'confirmed' || a.status === 'scheduled')}
        patients={patients}
        records={records}
        onSaveNotes={handleSaveConsultationNotes}
        onOpenCreatePrescription={(p) => {
          setSelectedPatientForRx(p);
          setIsCreateRxModalOpen(true);
        }}
        onCompleteConsultation={handleCompleteConsultation}
      />
    );
  } else if (pathname.startsWith('/doctor/prescriptions')) {
    pageTitle = 'Prescriptions';
    currentView = (
      <DoctorPrescriptionsView
        prescriptions={prescriptions}
        onOpenCreateModal={() => {
          setSelectedPatientForRx(null);
          setIsCreateRxModalOpen(true);
        }}
        onIssueDraft={handleIssueDraft}
        onViewPrescriptionDetails={(rx) => setSelectedPrescriptionToView(rx)}
      />
    );
  } else if (pathname.startsWith('/doctor/medical-records')) {
    pageTitle = 'Medical Records';
    currentView = (
      <DoctorMedicalRecordsView
        records={records}
        onViewRecord={(rec) => setRecordToView(rec)}
      />
    );
  } else if (pathname.startsWith('/doctor/schedule')) {
    pageTitle = 'Schedule & Availability';
    currentView = schedule ? (
      <DoctorScheduleView
        schedule={schedule}
        onSaveSchedule={handleSaveSchedule}
      />
    ) : null;
  } else if (pathname.startsWith('/doctor/analytics')) {
    pageTitle = 'Practice Analytics';
    currentView = (
      <DoctorAnalyticsView
        analytics={analytics}
        isLoading={isLoading}
      />
    );
  } else if (pathname.startsWith('/doctor/earnings')) {
    pageTitle = 'Earnings & Payouts';
    currentView = (
      <DoctorEarningsView
        earnings={earnings}
        isLoading={isLoading}
      />
    );
  } else if (pathname.startsWith('/doctor/notifications')) {
    pageTitle = 'Notifications';
    currentView = (
      <DoctorNotificationsView
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearAllNotifications}
      />
    );
  } else if (pathname.startsWith('/doctor/ai-assistant')) {
    pageTitle = 'CareQ AI Doctor Assistant';
    currentView = <DoctorAiAssistantView />;
  } else if (pathname.startsWith('/doctor/profile')) {
    pageTitle = 'My Profile';
    currentView = (
      <DoctorProfileView
        onOpenEditModal={() => setIsEditProfileModalOpen(true)}
      />
    );
  } else if (pathname.startsWith('/doctor/settings')) {
    pageTitle = 'Settings';
    currentView = <DoctorSettingsView />;
  } else {
    // Default Main Dashboard
    pageTitle = 'Doctor Dashboard';
    currentView = (
      <DoctorDashboardHomeView
        stats={stats}
        todayAppointments={todayAppointments}
        recentPatients={patients}
        isLoading={isLoading}
        isError={isError}
        onRetry={loadDoctorData}
        onStartConsultation={(apt) => {
          navigate('/doctor/consultations', { state: { appointment: apt } });
        }}
        onViewAppointmentDetails={(apt) => setSelectedAppointmentDetails(apt)}
      />
    );
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased overflow-x-hidden">
      {/* Sidebar: Desktop & Mobile Drawer */}
      <DoctorSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DoctorHeader
          pageTitle={pageTitle}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsRead}
        />

        {/* Dynamic Doctor Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView}
        </main>
      </div>

      {/* Interactive Modals */}
      <CreatePrescriptionModal
        isOpen={isCreateRxModalOpen}
        onClose={() => setIsCreateRxModalOpen(false)}
        patients={patients}
        initialPatient={selectedPatientForRx}
        onSavePrescription={handleSavePrescription}
      />

      <AppointmentDetailsModal
        isOpen={!!selectedAppointmentDetails}
        onClose={() => setSelectedAppointmentDetails(null)}
        appointment={selectedAppointmentDetails}
        onConfirm={handleConfirmAppointment}
        onCancel={handleCancelAppointment}
        onReschedule={(apt) => {
          setSelectedAppointmentDetails(null);
          setAppointmentToReschedule(apt);
        }}
        onStartConsultation={(apt) => {
          setSelectedAppointmentDetails(null);
          navigate('/doctor/consultations', { state: { appointment: apt } });
        }}
      />

      <RescheduleAppointmentModal
        isOpen={!!appointmentToReschedule}
        onClose={() => setAppointmentToReschedule(null)}
        appointment={appointmentToReschedule}
        onSaveReschedule={handleRescheduleAppointment}
      />

      <ViewRecordModal
        isOpen={!!recordToView}
        onClose={() => setRecordToView(null)}
        record={recordToView}
      />

      <ViewPrescriptionModal
        isOpen={!!selectedPrescriptionToView}
        onClose={() => setSelectedPrescriptionToView(null)}
        prescription={selectedPrescriptionToView}
      />

      <EditDoctorProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
};
