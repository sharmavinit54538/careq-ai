import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import type {
  Appointment,
  HealthVitals,
  Prescription,
  MedicalRecord,
  DoctorRecommendation,
  PatientActivity,
  PatientNotification
} from '../../types/patient';

// Components
import { PatientSidebar } from '../../components/patient/PatientSidebar';
import { PatientHeader } from '../../components/patient/PatientHeader';
import { WelcomeBanner } from '../../components/patient/WelcomeBanner';
import { QuickActions } from '../../components/patient/QuickActions';
import { UpcomingAppointmentSection } from '../../components/patient/UpcomingAppointmentSection';
import { HealthOverviewSection } from '../../components/patient/HealthOverviewSection';
import { RecentPrescriptionsSection } from '../../components/patient/RecentPrescriptionsSection';
import { MedicalRecordsSection } from '../../components/patient/MedicalRecordsSection';
import { RecommendedDoctorsSection } from '../../components/patient/RecommendedDoctorsSection';
import { RecentActivitySection } from '../../components/patient/RecentActivitySection';
import { CareQAIAssistantCard } from '../../components/patient/CareQAIAssistantCard';

// Subviews for full navigation paths
import { DoctorsView } from '../../components/patient/views/DoctorsView';
import { AppointmentsView } from '../../components/patient/views/AppointmentsView';
import { ConsultationsView } from '../../components/patient/views/ConsultationsView';
import { PrescriptionsView } from '../../components/patient/views/PrescriptionsView';
import { MedicalRecordsView } from '../../components/patient/views/MedicalRecordsView';
import { HealthView } from '../../components/patient/views/HealthView';
import { AiAssistantView } from '../../components/patient/views/AiAssistantView';
import { NotificationsView } from '../../components/patient/views/NotificationsView';
import { ProfileView } from '../../components/patient/views/ProfileView';
import { SettingsView } from '../../components/patient/views/SettingsView';

// Modals
import { BookAppointmentModal } from '../../components/patient/modals/BookAppointmentModal';
import { AddVitalsModal } from '../../components/patient/modals/AddVitalsModal';
import { UploadRecordModal } from '../../components/patient/modals/UploadRecordModal';
import { ViewPrescriptionModal } from '../../components/patient/modals/ViewPrescriptionModal';
import { AppointmentDetailsModal } from '../../components/patient/modals/AppointmentDetailsModal';
import { ViewRecordModal } from '../../components/patient/modals/ViewRecordModal';
import { EditProfileModal } from '../../components/patient/modals/EditProfileModal';

export const PatientDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data States
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [healthVitals, setHealthVitals] = useState<HealthVitals | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState<DoctorRecommendation[]>([]);
  const [recentActivities, setRecentActivities] = useState<PatientActivity[]>([]);
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorRecommendation | null>(null);

  const [isAddVitalsOpen, setIsAddVitalsOpen] = useState(false);
  const [isUploadRecordOpen, setIsUploadRecordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<Appointment | null>(null);
  const [selectedRecordToView, setSelectedRecordToView] = useState<MedicalRecord | null>(null);

  // Fetch Dashboard Data
  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setIsError(false);

    try {
      const data = await patientService.getDashboardData(user.id);
      setUpcomingAppointment(data.upcomingAppointment);
      setAppointmentsList(data.recentAppointments);
      setHealthVitals(data.healthVitals);
      setPrescriptions(data.prescriptions);
      setMedicalRecords(data.medicalRecords);
      setRecommendedDoctors(data.recommendedDoctors);
      setRecentActivities(data.recentActivities);
      setNotifications(data.notifications);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handlers
  const handleBookAppointmentSuccess = async (appointmentData: {
    doctorId: string;
    doctorName: string;
    doctorSpecialization: string;
    doctorAvatar?: string;
    date: string;
    time: string;
    type: 'video' | 'in-person';
    clinicInfo?: string;
    notes?: string;
  }) => {
    if (!user) return;
    await patientService.bookAppointment(user.id, appointmentData);
    await loadDashboardData();
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!user) return;
    await patientService.cancelAppointment(user.id, appointmentId);
    await loadDashboardData();
  };

  const handleSaveVitals = async (vitalsData: Partial<HealthVitals>) => {
    if (!user) return;
    await patientService.updateHealthVitals(user.id, vitalsData);
    await loadDashboardData();
  };

  const handleUploadRecordSuccess = async (recordData: {
    name: string;
    category: any;
    uploadedBy: string;
    fileSize?: string;
  }) => {
    if (!user) return;
    await patientService.uploadMedicalRecord(user.id, recordData);
    await loadDashboardData();
  };

  const handleSaveProfile = async (updates: {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    emergencyContact?: string;
    allergies?: string[];
  }) => {
    if (!user) return;
    await patientService.updateProfile(user.id, updates);
    await refreshUser();
    await loadDashboardData();
  };

  const handleMarkNotificationRead = async (id: string) => {
    if (!user) return;
    await patientService.markNotificationAsRead(user.id, id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!user) return;
    await patientService.markAllNotificationsAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Determine current active view based on pathname
  const pathname = location.pathname;

  let pageTitle = 'Dashboard';
  let currentViewComponent: React.ReactNode = null;

  if (pathname.startsWith('/patient/doctors')) {
    pageTitle = 'Find Doctors';
    currentViewComponent = (
      <DoctorsView
        doctors={recommendedDoctors}
        onBookDoctor={(doc) => {
          setSelectedDoctorForBooking(doc);
          setIsBookModalOpen(true);
        }}
        onViewDoctorProfile={(doc) => {
          setSelectedDoctorForBooking(doc);
          setIsBookModalOpen(true);
        }}
      />
    );
  } else if (pathname.startsWith('/patient/appointments')) {
    pageTitle = 'Appointments';
    currentViewComponent = (
      <AppointmentsView
        appointments={appointmentsList}
        onBookAppointment={() => {
          setSelectedDoctorForBooking(null);
          setIsBookModalOpen(true);
        }}
        onJoinConsultation={(apt) => {
          navigate('/patient/consultations', { state: { appointment: apt } });
        }}
        onViewDetails={(apt) => setSelectedAppointmentDetails(apt)}
      />
    );
  } else if (pathname.startsWith('/patient/consultations')) {
    pageTitle = 'Consultations';
    currentViewComponent = (
      <ConsultationsView
        activeAppointment={upcomingAppointment}
        onLeaveRoom={() => navigate('/patient/dashboard')}
      />
    );
  } else if (pathname.startsWith('/patient/prescriptions')) {
    pageTitle = 'Prescriptions';
    currentViewComponent = (
      <PrescriptionsView
        prescriptions={prescriptions}
        onViewPrescription={(rx) => setSelectedPrescription(rx)}
      />
    );
  } else if (pathname.startsWith('/patient/medical-records')) {
    pageTitle = 'Medical Records';
    currentViewComponent = (
      <MedicalRecordsView
        records={medicalRecords}
        onUploadRecord={() => setIsUploadRecordOpen(true)}
        onViewRecord={(rec) => setSelectedRecordToView(rec)}
      />
    );
  } else if (pathname.startsWith('/patient/health')) {
    pageTitle = 'Health';
    currentViewComponent = (
      <HealthView
        vitals={healthVitals}
        onAddHealthInfo={() => setIsAddVitalsOpen(true)}
      />
    );
  } else if (pathname.startsWith('/patient/ai-assistant')) {
    pageTitle = 'CareQ AI Assistant';
    currentViewComponent = <AiAssistantView />;
  } else if (pathname.startsWith('/patient/notifications')) {
    pageTitle = 'Notifications';
    currentViewComponent = (
      <NotificationsView
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />
    );
  } else if (pathname.startsWith('/patient/profile')) {
    pageTitle = 'My Profile';
    currentViewComponent = (
      <ProfileView
        user={user}
        onEditProfile={() => setIsEditProfileOpen(true)}
      />
    );
  } else if (pathname.startsWith('/patient/settings')) {
    pageTitle = 'Settings';
    currentViewComponent = <SettingsView />;
  } else {
    // Default Main Dashboard View
    pageTitle = 'Dashboard';
    currentViewComponent = (
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeBanner
          patientName={user?.name || 'Patient'}
          onBookAppointment={() => {
            setSelectedDoctorForBooking(null);
            setIsBookModalOpen(true);
          }}
          onFindDoctor={() => navigate('/patient/doctors')}
        />

        {/* Quick Actions */}
        <QuickActions
          onBookAppointmentClick={() => {
            setSelectedDoctorForBooking(null);
            setIsBookModalOpen(true);
          }}
        />

        {/* 2-Column Grid: Left (Clinical Essentials) & Right (AI Assistant & Secondary) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointment */}
            <UpcomingAppointmentSection
              appointment={upcomingAppointment}
              isLoading={isLoading}
              isError={isError}
              onRetry={loadDashboardData}
              onFindDoctor={() => navigate('/patient/doctors')}
              onJoinConsultation={(apt) => {
                navigate('/patient/consultations', { state: { appointment: apt } });
              }}
              onViewDetails={(apt) => setSelectedAppointmentDetails(apt)}
            />

            {/* Health Overview */}
            <HealthOverviewSection
              vitals={healthVitals}
              isLoading={isLoading}
              isError={isError}
              onRetry={loadDashboardData}
              onAddHealthInfo={() => setIsAddVitalsOpen(true)}
            />

            {/* Recent Prescriptions */}
            <RecentPrescriptionsSection
              prescriptions={prescriptions}
              isLoading={isLoading}
              isError={isError}
              onRetry={loadDashboardData}
              onViewPrescription={(rx) => setSelectedPrescription(rx)}
            />

            {/* Medical Records */}
            <MedicalRecordsSection
              records={medicalRecords}
              isLoading={isLoading}
              isError={isError}
              onRetry={loadDashboardData}
              onUploadRecord={() => setIsUploadRecordOpen(true)}
              onViewRecord={(rec) => setSelectedRecordToView(rec)}
            />
          </div>

          {/* Right Column (1 Col on lg) */}
          <div className="space-y-8">
            {/* CareQ AI Assistant Card */}
            <CareQAIAssistantCard />

            {/* Recommended Doctors */}
            <RecommendedDoctorsSection
              doctors={recommendedDoctors}
              isLoading={isLoading}
              isError={isError}
              onRetry={loadDashboardData}
              onViewDoctorProfile={(doc) => {
                setSelectedDoctorForBooking(doc);
                setIsBookModalOpen(true);
              }}
              onBookDoctor={(doc) => {
                setSelectedDoctorForBooking(doc);
                setIsBookModalOpen(true);
              }}
            />

            {/* Recent Activity Timeline */}
            <RecentActivitySection
              activities={recentActivities}
              isLoading={isLoading}
              isError={isError}
              onRetry={loadDashboardData}
            />
          </div>
        </div>
      </div>
    );
  }

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased overflow-x-hidden">
      {/* Sidebar: Desktop & Mobile Drawer */}
      <PatientSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        unreadCount={unreadNotificationCount}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <PatientHeader
          pageTitle={pageTitle}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onToggleDesktopSidebar={() => setSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={sidebarCollapsed}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsRead}
        />

        {/* Dynamic Patient Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentViewComponent}
        </main>
      </div>

      {/* Interactive Patient Modals */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        doctors={recommendedDoctors}
        selectedDoctor={selectedDoctorForBooking}
        onBookSuccess={handleBookAppointmentSuccess}
      />

      <AddVitalsModal
        isOpen={isAddVitalsOpen}
        onClose={() => setIsAddVitalsOpen(false)}
        currentVitals={healthVitals}
        onSaveVitals={handleSaveVitals}
      />

      <UploadRecordModal
        isOpen={isUploadRecordOpen}
        onClose={() => setIsUploadRecordOpen(false)}
        onUploadSuccess={handleUploadRecordSuccess}
      />

      <ViewPrescriptionModal
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        prescription={selectedPrescription}
      />

      <AppointmentDetailsModal
        isOpen={!!selectedAppointmentDetails}
        onClose={() => setSelectedAppointmentDetails(null)}
        appointment={selectedAppointmentDetails}
        onCancelAppointment={handleCancelAppointment}
        onJoinRoom={(apt) => {
          setSelectedAppointmentDetails(null);
          navigate('/patient/consultations', { state: { appointment: apt } });
        }}
      />

      <ViewRecordModal
        isOpen={!!selectedRecordToView}
        onClose={() => setSelectedRecordToView(null)}
        record={selectedRecordToView}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
};
