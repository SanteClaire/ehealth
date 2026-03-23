import {
  LayoutDashboard, FileText, Users, MessageCircle, Settings,
  Calendar, MessageSquare,
} from 'lucide-react'

export const getPatientNavItems = (t, activeView) => [
  { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard', active: activeView === 'dashboard' },
  { icon: FileText, label: t('sidebar.documents'), id: 'documents', active: activeView === 'documents' },
  { icon: Users, label: t('sidebar.family'), id: 'famille', active: activeView === 'famille' },
  { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia', active: activeView === 'ia' },
  { icon: Settings, label: t('sidebar.settings'), id: 'settings', active: activeView === 'settings' },
]

export const getDoctorNavItems = (t, activeView) => [
  { icon: LayoutDashboard, label: t('doctor.dashboard'), id: 'dashboard', active: activeView === 'dashboard' },
  { icon: Users, label: t('doctor.patients'), id: 'patients', active: activeView === 'patients' },
  { icon: Calendar, label: t('doctor.schedule'), id: 'planning', active: activeView === 'planning' },
  { icon: MessageSquare, label: t('doctor.messages'), id: 'messages', active: activeView === 'messages' },
  { icon: Settings, label: t('doctor.settings'), id: 'settings', active: activeView === 'settings' },
]
