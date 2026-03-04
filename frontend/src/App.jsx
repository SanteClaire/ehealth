import { useState } from 'react'
import { useFadeIn } from './hooks/useFadeIn'
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
import DoctorPatientFilePage from './components/DoctorPatientFilePage'
import DoctorConsultationPage from './components/DoctorConsultationPage'
import DoctorMedicalRecordsPage from './components/DoctorMedicalRecordsPage'
import DoctorPatientOverviewPage from './components/DoctorPatientOverviewPage'
import DoctorSchedulePage from './components/DoctorSchedulePage'
import DoctorSettingsPage from './components/DoctorSettingsPage'
import DoctorMessagesPage from './components/DoctorMessagesPage'

export default function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showPatientRegister, setShowPatientRegister] = useState(false)
  const [showPatientConfirm, setShowPatientConfirm] = useState(false)
  const [showDoctorRegister, setShowDoctorRegister] = useState(false)
  const [showDoctorExercice, setShowDoctorExercice] = useState(false)
  const [showDoctorDocuments, setShowDoctorDocuments] = useState(false)
  const [showDoctorConfirm, setShowDoctorConfirm] = useState(false)
  const [showDoctorDashboard, setShowDoctorDashboard] = useState(false)
  const [showDoctorPatients, setShowDoctorPatients] = useState(false)
  const [showDoctorPatientFile, setShowDoctorPatientFile] = useState(false)
  const [showDoctorConsultation, setShowDoctorConsultation] = useState(false)
  const [showDoctorMedicalRecords, setShowDoctorMedicalRecords] = useState(false)
  const [showDoctorPatientOverview, setShowDoctorPatientOverview] = useState(false)

  const [showDoctorSchedule, setShowDoctorSchedule] = useState(false)
  const [showDoctorSettings, setShowDoctorSettings] = useState(false)
  const [showDoctorMessages, setShowDoctorMessages] = useState(false)

  const resetAll = () => {
    setShowLogin(false)
    setShowRegister(false)
    setShowPatientRegister(false)
    setShowPatientConfirm(false)
    setShowDoctorRegister(false)
    setShowDoctorExercice(false)
    setShowDoctorDocuments(false)
    setShowDoctorConfirm(false)
    setShowDoctorDashboard(false)
    setShowDoctorPatients(false)
    setShowDoctorPatientFile(false)
    setShowDoctorConsultation(false)
    setShowDoctorMedicalRecords(false)
    setShowDoctorPatientOverview(false)
    setShowDoctorSchedule(false)
    setShowDoctorSettings(false)
    setShowDoctorMessages(false)
  }

  useFadeIn()

  // --- Handlers globaux de navigation pour la sidebar Docteur ---
  const handleDoctorNav = (dest) => {
    resetAll()
    if (dest === 'dashboard') setShowDoctorDashboard(true)
    if (dest === 'patients') setShowDoctorPatients(true)
    if (dest === 'planning') setShowDoctorSchedule(true)
    if (dest === 'messages') setShowDoctorMessages(true)
    if (dest === 'reports') setShowDoctorDashboard(true) // TODO: Rapports plus tard
    if (dest === 'settings') setShowDoctorSettings(true)
  }

  if (showPatientConfirm) {
    return (
      <PatientConfirmPage
        onDashboard={resetAll}
      />
    )
  }

  if (showDoctorPatientOverview) {
    return (
      <DoctorPatientOverviewPage
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorPatientOverview(false); setShowDoctorPatientFile(true) }}
        onLogout={resetAll}
      />
    )
  }

  if (showDoctorMedicalRecords) {
    return (
      <DoctorMedicalRecordsPage
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorMedicalRecords(false); setShowDoctorPatientFile(true) }}
        onLogout={resetAll}
      />
    )
  }

  if (showDoctorConsultation) {
    return (
      <DoctorConsultationPage
        onEnd={() => { setShowDoctorConsultation(false); setShowDoctorPatientFile(true) }}
      />
    )
  }

  if (showDoctorPatientFile) {
    return (
      <DoctorPatientFilePage
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorPatientFile(false); setShowDoctorDashboard(true) }}
        onPatients={() => { setShowDoctorPatientFile(false); setShowDoctorPatients(true) }}
        onLogout={resetAll}
        onConsult={() => { setShowDoctorPatientFile(false); setShowDoctorConsultation(true) }}
        onMedicalRecords={() => { setShowDoctorPatientFile(false); setShowDoctorMedicalRecords(true) }}
        onPatientOverview={() => { setShowDoctorPatientFile(false); setShowDoctorPatientOverview(true) }}
      />
    )
  }

  if (showDoctorPatients) {
    return (
      <DoctorPatientsPage
        onNavigate={handleDoctorNav}
        onBack={() => { setShowDoctorPatients(false); setShowDoctorDashboard(true) }}
        onLogout={resetAll}
        onPatientFile={() => { setShowDoctorPatients(false); setShowDoctorPatientFile(true) }}
      />
    )
  }

  if (showDoctorSchedule) {
    return <DoctorSchedulePage onNavigate={handleDoctorNav} onLogout={resetAll} />
  }

  if (showDoctorSettings) {
    return <DoctorSettingsPage onNavigate={handleDoctorNav} onLogout={resetAll} />
  }

  if (showDoctorMessages) {
    return <DoctorMessagesPage onNavigate={handleDoctorNav} onLogout={resetAll} />
  }

  if (showDoctorDashboard) {
    return (
      <DoctorDashboard
        onNavigate={handleDoctorNav}
        onLogout={resetAll}
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
        onDoctorLogin={() => { setShowLogin(false); setShowDoctorDashboard(true) }}
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
