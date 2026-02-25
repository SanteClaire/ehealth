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

export default function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showPatientRegister, setShowPatientRegister] = useState(false)
  const [showPatientConfirm, setShowPatientConfirm] = useState(false)
  const [showDoctorRegister, setShowDoctorRegister] = useState(false)
  const [showDoctorExercice, setShowDoctorExercice] = useState(false)
  const [showDoctorDocuments, setShowDoctorDocuments] = useState(false)

  const resetAll = () => {
    setShowLogin(false)
    setShowRegister(false)
    setShowPatientRegister(false)
    setShowPatientConfirm(false)
    setShowDoctorRegister(false)
    setShowDoctorExercice(false)
    setShowDoctorDocuments(false)
  }

  useFadeIn()

  if (showPatientConfirm) {
    return (
      <PatientConfirmPage
        onDashboard={resetAll}
      />
    )
  }

  if (showDoctorDocuments) {
    return (
      <DoctorDocumentsPage
        onBack={() => { setShowDoctorDocuments(false); setShowDoctorExercice(true) }}
        onComplete={resetAll}
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
