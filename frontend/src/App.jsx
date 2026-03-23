import { useState, useEffect } from 'react'
import { useFadeIn } from './hooks/useFadeIn'
import { LanguageProvider } from './hooks/useLanguage'
import { logout as apiLogout, getCachedUser, removeToken, getUserRole, fetchMe, isAuthenticated } from './services/api'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import HowItWorks from './components/HowItWorks'
import ForWho from './components/ForWho'
import Features from './components/Features'
import Security from './components/Security'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import PatientRegisterPage from './components/PatientRegisterPage'
import PatientConfirmPage from './components/PatientConfirmPage'
import DoctorRegisterPage from './components/DoctorRegisterPage'
import DoctorExercicePage from './components/DoctorExercicePage'
import DoctorDocumentsPage from './components/DoctorDocumentsPage'
import DoctorConfirmPage from './components/DoctorConfirmPage'
import DoctorDashboard from './components/DoctorDashboard'
import DoctorPatientsPage from './components/DoctorPatientsPage'
import DoctorAddPatientPage from './components/DoctorAddPatientPage'
import DoctorPatientFilePage from './components/DoctorPatientFilePage'
import DoctorConsultationPage from './components/DoctorConsultationPage'
import DoctorMedicalRecordsPage from './components/DoctorMedicalRecordsPage'
import DoctorPatientOverviewPage from './components/DoctorPatientOverviewPage'
import DoctorSchedulePage from './components/DoctorSchedulePage'
import DoctorSettingsPage from './components/DoctorSettingsPage'
import DoctorMessagesPage from './components/DoctorMessagesPage'
import DoctorProfilePage from './components/DoctorProfilePage'
import PatientDashboard from './components/PatientDashboard'
import PatientDocumentsPage from './components/PatientDocumentsPage'
import PatientChatbotPage from './components/PatientChatbotPage'
import PatientFamilyProfiles from './components/PatientFamilyProfiles'
import PatientManageRights from './components/PatientManageRights'
import PatientSettingsPage from './components/PatientSettingsPage'
import PatientProfilePage from './components/PatientProfilePage'

function AppContent() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showPatientRegister, setShowPatientRegister] = useState(false)
  const [showPatientConfirm, setShowPatientConfirm] = useState(false)
  const [showPatientDashboard, setShowPatientDashboard] = useState(false)
  const [showPatientDocuments, setShowPatientDocuments] = useState(false)
  const [showPatientChatbot, setShowPatientChatbot] = useState(false)
  const [showPatientFamilyProfiles, setShowPatientFamilyProfiles] = useState(false)
  const [showPatientManageRights, setShowPatientManageRights] = useState(false)
  const [showPatientSettings, setShowPatientSettings] = useState(false)
  const [showPatientProfile, setShowPatientProfile] = useState(false)
  const [showDoctorRegister, setShowDoctorRegister] = useState(false)
  const [showDoctorExercice, setShowDoctorExercice] = useState(false)
  const [showDoctorDocuments, setShowDoctorDocuments] = useState(false)
  const [showDoctorConfirm, setShowDoctorConfirm] = useState(false)
  const [showDoctorDashboard, setShowDoctorDashboard] = useState(false)
  const [showDoctorPatients, setShowDoctorPatients] = useState(false)
  const [showDoctorAddPatient, setShowDoctorAddPatient] = useState(false)
  const [showDoctorPatientFile, setShowDoctorPatientFile] = useState(false)
  const [showDoctorConsultation, setShowDoctorConsultation] = useState(false)
  const [showDoctorMedicalRecords, setShowDoctorMedicalRecords] = useState(false)
  const [showDoctorPatientOverview, setShowDoctorPatientOverview] = useState(false)

  const [showDoctorSchedule, setShowDoctorSchedule] = useState(false)
  const [showDoctorSettings, setShowDoctorSettings] = useState(false)
  const [showDoctorMessages, setShowDoctorMessages] = useState(false)
  const [showDoctorProfile, setShowDoctorProfile] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState('alice')
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // On mount, check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const cached = getCachedUser()
      if (cached) {
        setCurrentUser(cached)
        const role = getUserRole(cached)
        if (role === 'medecin') setShowDoctorDashboard(true)
        else if (role === 'patient') setShowPatientDashboard(true)
      } else {
        fetchMe().then(res => {
          if (res.success) {
            setCurrentUser(res.data)
            const role = getUserRole(res.data)
            if (role === 'medecin') setShowDoctorDashboard(true)
            else if (role === 'patient') setShowPatientDashboard(true)
          } else {
            removeToken()
          }
        })
      }
    }
  }, [])

  const handleLogout = () => {
    apiLogout()
    setCurrentUser(null)
    resetAll()
  }

  const resetAll = () => {
    setShowLogin(false)
    setShowRegister(false)
    setShowPatientRegister(false)
    setShowPatientConfirm(false)
    setShowPatientDashboard(false)
    setShowPatientDocuments(false)
    setShowPatientChatbot(false)
    setShowPatientFamilyProfiles(false)
    setShowPatientManageRights(false)
    setShowPatientSettings(false)
    setShowPatientProfile(false)
    setShowDoctorRegister(false)
    setShowDoctorExercice(false)
    setShowDoctorDocuments(false)
    setShowDoctorConfirm(false)
    setShowDoctorDashboard(false)
    setShowDoctorPatients(false)
    setShowDoctorAddPatient(false)
    setShowDoctorPatientFile(false)
    setShowDoctorConsultation(false)
    setShowDoctorMedicalRecords(false)
    setShowDoctorPatientOverview(false)
    setShowDoctorSchedule(false)
    setShowDoctorSettings(false)
    setShowDoctorMessages(false)
    setShowDoctorProfile(false)
  }

  useFadeIn()

  // --- Handlers globaux de navigation pour la sidebar Docteur ---
  const handleDoctorNav = (dest) => {
    resetAll()
    if (dest === 'dashboard') setShowDoctorDashboard(true)
    if (dest === 'patients') setShowDoctorPatients(true)
    if (dest === 'planning') setShowDoctorSchedule(true)
    if (dest === 'messages') setShowDoctorMessages(true)
    if (dest === 'settings') setShowDoctorSettings(true)
    if (dest === 'profil') setShowDoctorProfile(true)
  }

  if (showPatientDashboard) {
    return (
      <PatientDashboard
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={(dest) => {
          if (dest === 'dashboard') setShowPatientDashboard(true)
          if (dest === 'documents') { setShowPatientDashboard(false); setShowPatientDocuments(true) }
          if (dest === 'famille') { setShowPatientDashboard(false); setShowPatientFamilyProfiles(true) }
          if (dest === 'ia') { setShowPatientDashboard(false); setShowPatientChatbot(true) }
          if (dest === 'settings') { setShowPatientDashboard(false); setShowPatientSettings(true) }
          if (dest === 'profil') { setShowPatientDashboard(false); setShowPatientProfile(true) }
          if (dest === 'rdv') { setShowPatientDashboard(false); setShowPatientDashboard(true) }
        }}
      />
    )
  }

  if (showPatientChatbot) {
    return (
      <PatientChatbotPage
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={(dest) => {
          if (dest === 'dashboard') { setShowPatientChatbot(false); setShowPatientDashboard(true) }
          if (dest === 'documents') { setShowPatientChatbot(false); setShowPatientDocuments(true) }
          if (dest === 'famille') { setShowPatientChatbot(false); setShowPatientFamilyProfiles(true) }
          if (dest === 'ia') setShowPatientChatbot(true)
          if (dest === 'settings') { setShowPatientChatbot(false); setShowPatientSettings(true) }
          if (dest === 'profil') { setShowPatientChatbot(false); setShowPatientProfile(true) }
          if (dest === 'rdv') { setShowPatientChatbot(false); setShowPatientDashboard(true) }
        }}
      />
    )
  }

  if (showPatientDocuments) {
    return (
      <PatientDocumentsPage
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={(dest) => {
          if (dest === 'dashboard') { setShowPatientDocuments(false); setShowPatientDashboard(true) }
          if (dest === 'documents') setShowPatientDocuments(true)
          if (dest === 'famille') { setShowPatientDocuments(false); setShowPatientFamilyProfiles(true) }
          if (dest === 'ia') { setShowPatientDocuments(false); setShowPatientChatbot(true) }
          if (dest === 'settings') { setShowPatientDocuments(false); setShowPatientSettings(true) }
          if (dest === 'profil') { setShowPatientDocuments(false); setShowPatientProfile(true) }
          if (dest === 'rdv') { setShowPatientDocuments(false); setShowPatientDashboard(true) }
        }}
      />
    )
  }

  if (showPatientFamilyProfiles) {
    return (
      <PatientFamilyProfiles
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={(dest) => {
          if (dest === 'dashboard') { setShowPatientFamilyProfiles(false); setShowPatientDashboard(true) }
          if (dest === 'documents') { setShowPatientFamilyProfiles(false); setShowPatientDocuments(true) }
          if (dest === 'famille') setShowPatientFamilyProfiles(true)
          if (dest === 'ia') { setShowPatientFamilyProfiles(false); setShowPatientChatbot(true) }
          if (dest === 'settings') { setShowPatientFamilyProfiles(false); setShowPatientSettings(true) }
          if (dest === 'profil') { setShowPatientFamilyProfiles(false); setShowPatientProfile(true) }
          if (dest === 'rdv') { setShowPatientFamilyProfiles(false); setShowPatientDashboard(true) }
        }}
        onManageRights={(memberId) => { 
          setSelectedMemberId(memberId)
          setShowPatientFamilyProfiles(false)
          setShowPatientManageRights(true) 
        }}
      />
    )
  }

  if (showPatientManageRights) {
    return (
      <PatientManageRights
        onLogout={handleLogout}
        onNavigate={(dest) => {
          if (dest === 'dashboard') { setShowPatientManageRights(false); setShowPatientDashboard(true) }
          if (dest === 'documents') { setShowPatientManageRights(false); setShowPatientDocuments(true) }
          if (dest === 'famille') { setShowPatientManageRights(false); setShowPatientFamilyProfiles(true) }
          if (dest === 'ia') { setShowPatientManageRights(false); setShowPatientChatbot(true) }
          if (dest === 'settings') { setShowPatientManageRights(false); setShowPatientSettings(true) }
          if (dest === 'profil') { setShowPatientManageRights(false); setShowPatientProfile(true) }
          if (dest === 'rdv') { setShowPatientManageRights(false); setShowPatientDashboard(true) }
        }}
        onBack={() => { setShowPatientManageRights(false); setShowPatientFamilyProfiles(true) }}
        selectedMemberId={selectedMemberId}
      />
    )
  }

  if (showPatientSettings) {
    return (
      <PatientSettingsPage
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={(dest) => {
          if (dest === 'dashboard') { setShowPatientSettings(false); setShowPatientDashboard(true) }
          if (dest === 'documents') { setShowPatientSettings(false); setShowPatientDocuments(true) }
          if (dest === 'famille') { setShowPatientSettings(false); setShowPatientFamilyProfiles(true) }
          if (dest === 'ia') { setShowPatientSettings(false); setShowPatientChatbot(true) }
          if (dest === 'settings') setShowPatientSettings(true)
          if (dest === 'profil') { setShowPatientSettings(false); setShowPatientProfile(true) }
          if (dest === 'rdv') { setShowPatientSettings(false); setShowPatientDashboard(true) }
        }}
      />
    )
  }

  if (showPatientProfile) {
    return (
      <PatientProfilePage
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={(dest) => {
          if (dest === 'dashboard') { setShowPatientProfile(false); setShowPatientDashboard(true) }
          if (dest === 'documents') { setShowPatientProfile(false); setShowPatientDocuments(true) }
          if (dest === 'famille') { setShowPatientProfile(false); setShowPatientFamilyProfiles(true) }
          if (dest === 'ia') { setShowPatientProfile(false); setShowPatientChatbot(true) }
          if (dest === 'settings') { setShowPatientProfile(false); setShowPatientSettings(true) }
          if (dest === 'profil') setShowPatientProfile(true)
          if (dest === 'rdv') setShowPatientProfile(true)
        }}
      />
    )
  }

  if (showPatientConfirm) {
    return (
      <PatientConfirmPage
        onDashboard={() => { setShowPatientConfirm(false); setShowPatientDashboard(true) }}
      />
    )
  }

  if (showDoctorProfile) {
    return (
      <DoctorProfilePage
        user={currentUser}
        onNavigate={handleDoctorNav}
        onLogout={handleLogout}
      />
    )
  }

  if (showDoctorPatientOverview) {
    return (
      <DoctorPatientOverviewPage
        patientId={selectedPatientId}
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorPatientOverview(false); setShowDoctorPatientFile(true) }}
        onLogout={handleLogout}
      />
    )
  }

  if (showDoctorMedicalRecords) {
    return (
      <DoctorMedicalRecordsPage
        patientId={selectedPatientId}
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorMedicalRecords(false); setShowDoctorPatientFile(true) }}
        onLogout={handleLogout}
      />
    )
  }

  if (showDoctorConsultation) {
    return (
      <DoctorConsultationPage
        patientId={selectedPatientId}
        user={currentUser}
        onEnd={() => { setShowDoctorConsultation(false); setShowDoctorPatientFile(true) }}
      />
    )
  }

  if (showDoctorPatientFile) {
    return (
      <DoctorPatientFilePage
        patientId={selectedPatientId}
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorPatientFile(false); setShowDoctorDashboard(true) }}
        onPatients={() => { setShowDoctorPatientFile(false); setShowDoctorPatients(true) }}
        onLogout={handleLogout}
        onConsult={() => { setShowDoctorPatientFile(false); setShowDoctorConsultation(true) }}
        onMedicalRecords={() => { setShowDoctorPatientFile(false); setShowDoctorMedicalRecords(true) }}
        onPatientOverview={() => { setShowDoctorPatientFile(false); setShowDoctorPatientOverview(true) }}
      />
    )
  }

  if (showDoctorAddPatient) {
    return (
      <DoctorAddPatientPage
        onNavigate={handleDoctorNav}
        onLogout={handleLogout}
        onBack={() => {
          setShowDoctorAddPatient(false)
          setShowDoctorPatients(true)
        }}
      />
    )
  }

  if (showDoctorPatients) {
    return (
      <DoctorPatientsPage
        user={currentUser}
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorPatients(false); setShowDoctorDashboard(true) }}
        onLogout={handleLogout}
        onPatientFile={(patientId) => { setSelectedPatientId(patientId); setShowDoctorPatients(false); setShowDoctorPatientFile(true) }}
        onAddPatient={() => {
          setShowDoctorPatients(false)
          setShowDoctorAddPatient(true)
        }}
      />
    )
  }

  if (showDoctorSchedule) {
    return <DoctorSchedulePage user={currentUser} onNavigate={handleDoctorNav} onLogout={handleLogout} />
  }

  if (showDoctorSettings) {
    return <DoctorSettingsPage user={currentUser} onNavigate={handleDoctorNav} onLogout={handleLogout} />
  }

  if (showDoctorMessages) {
    return <DoctorMessagesPage user={currentUser} onNavigate={handleDoctorNav} onLogout={handleLogout} />
  }

  if (showDoctorDashboard) {
    return (
      <DoctorDashboard
        user={currentUser}
        onNavigate={handleDoctorNav}
        onLogout={handleLogout}
        onPatients={() => { setShowDoctorDashboard(false); setShowDoctorPatients(true) }}
      />
    )
  }

  if (showDoctorConfirm) {
    return (
      <DoctorConfirmPage
        onDemo={() => { setShowDoctorConfirm(false); setShowDoctorDashboard(true) }}
        onHome={resetAll}
      />
    )
  }

  if (showDoctorDocuments) {
    return (
      <DoctorDocumentsPage
        onBack={() => { setShowDoctorDocuments(false); setShowDoctorExercice(true) }}
        onComplete={() => { setShowDoctorDocuments(false); setShowDoctorConfirm(true) }}
      />
    )
  }

  if (showDoctorExercice) {
    return (
      <DoctorExercicePage
        onBack={() => { setShowDoctorExercice(false); setShowDoctorRegister(true) }}
        onNext={() => { setShowDoctorExercice(false); setShowDoctorDocuments(true) }}
      />
    )
  }

  if (showDoctorRegister) {
    return (
      <DoctorRegisterPage
        onBack={() => { setShowDoctorRegister(false); setShowRegister(true) }}
        onConfirm={() => { setShowDoctorRegister(false); setShowDoctorExercice(true) }}
      />
    )
  }

  if (showPatientRegister) {
    return (
      <PatientRegisterPage
        onBack={() => { setShowPatientRegister(false); setShowRegister(true) }}
        onLogin={() => { setShowPatientRegister(false); setShowLogin(true) }}
        onConfirm={() => { setShowPatientRegister(false); setShowPatientConfirm(true) }}
      />
    )
  }

  if (showLogin) {
    return (
      <LoginPage
        onClose={() => setShowLogin(false)}
        onRegister={() => { setShowLogin(false); setShowRegister(true) }}
        onDoctorLogin={(userData) => { setCurrentUser(userData); setShowLogin(false); setShowDoctorDashboard(true) }}
        onPatientLogin={(userData) => { setCurrentUser(userData); setShowLogin(false); setShowPatientDashboard(true) }}
      />
    )
  }

  if (showRegister) {
    return (
      <RegisterPage
        onBack={() => setShowRegister(false)}
        onLogin={() => { setShowRegister(false); setShowLogin(true) }}
        onPatient={() => { setShowRegister(false); setShowPatientRegister(true) }}
        onDoctor={() => { setShowRegister(false); setShowDoctorRegister(true) }}
      />
    )
  }

  return (
    <>
      <Navbar
        onOpenModal={() => setShowRegister(true)}
        onLogin={() => setShowLogin(true)}
      />
      <Hero onOpenModal={() => setShowRegister(true)} />
      <TrustBar />
      <HowItWorks />
      <ForWho onOpenModal={() => setShowRegister(true)} />
      <Features />
      <Security />
      <CtaSection onOpenModal={() => setShowRegister(true)} />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
