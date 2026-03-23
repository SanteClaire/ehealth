import {
  Camera, Check, IdCard, MapPin,
  Fingerprint, Monitor, Shield, Save,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import DoctorSidebar from './DoctorSidebar'
import styles from './DoctorProfilePage.module.css'

export default function DoctorProfilePage({ user, onNavigate, onLogout }) {
  const { t } = useLanguage()
  const doctorName = user ? `Dr. ${user.firstName} ${user.lastName}` : 'Dr.'
  const doctorInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'DR'

  return (
    <div className={styles.layout}>
      <DoctorSidebar activeId="profil" onNavigate={onNavigate} onLogout={onLogout} />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>{t('doctor.professionalProfileTitle')}</h1>
            <p>{t('doctor.professionalProfileSubtitle')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className={styles.profileBtn}
              onClick={() => onNavigate && onNavigate('profil')}
              aria-label={t('doctor.navMyProfile')}
            >
              <span className={styles.avatarMini}>{doctorInitials}</span>
              <span>{doctorName}</span>
            </button>
            <LanguageSwitcher />
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.summaryCard}>
            <div className={styles.avatarLarge}>
              {doctorInitials}
              <span className={styles.editPhotoFab} title={t('doctor.modifyPhoto')}>
                <Camera size={14} />
              </span>
            </div>
            <div className={styles.summaryMain}>
              <div className={styles.nameRow}>
                <span className={styles.doctorName}>{doctorName}</span>
                <span className={styles.badgeVerified}>
                  <Check size={12} /> {t('doctor.verified')}
                </span>
              </div>
              <div className={styles.specialty}>{t('doctor.generalPractice')}</div>
              <div className={styles.metaLine}>{t('doctor.rppsStatusLine')}</div>
            </div>
            <button type="button" className={styles.btnCamera}>
              <Camera size={16} /> {t('doctor.modifyPhoto')}
            </button>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <IdCard size={18} />
                </span>
                {t('doctor.professionalInfo')}
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('doctor.lastName')}</span>
                <span className={styles.fieldValue}>{user?.lastName || '—'}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('doctor.firstName')}</span>
                <span className={styles.fieldValue}>{user?.firstName || '—'}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('doctor.specialty')}</span>
                <span className={styles.fieldValue}>{user?.specialite || '—'}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>Tarif consultation</span>
                <span className={styles.fieldValue}>{user?.tarifConsultation ? `${user.tarifConsultation} €` : '—'}</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <MapPin size={18} />
                </span>
                {t('doctor.practiceLocation')}
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('doctor.structure')}</span>
                <span className={styles.fieldValue}>{user?.adresseCabinet || '—'}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('doctor.phonePro')}</span>
                <span className={styles.fieldValue}>{user?.telephoneCabinet || '—'}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('doctor.emailPro')}</span>
                <span className={styles.fieldValue}>{user?.email || '—'}</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <Fingerprint size={18} />
                </span>
                {t('doctor.idNumbers')}
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>RPPS</span>
                <span className={styles.idBox}>{user?.numeroRPPS || '—'}</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <Monitor size={18} />
                </span>
                {t('doctor.toolsSoftware')}
              </div>
              <div className={styles.toolRow}>
                <span className={styles.fieldLabel}>{t('doctor.managementSoftware')}</span>
                <span>
                  <span className={styles.dotTeal} />
                  Doctolib
                </span>
              </div>
              <div className={styles.toolRow}>
                <span className={styles.fieldLabel}>{t('doctor.digitalSignature')}</span>
                <span className={styles.checkGreen}>✓ {t('doctor.active')}</span>
              </div>
            </div>
          </div>

          <div className={styles.footerBar}>
            <div className={styles.hdsBadge}>
              <Shield size={16} /> {t('doctor.hdsBadge')}
            </div>
            <button type="button" className={styles.btnSave}>
              <Save size={18} /> {t('doctor.saveProfile')}
            </button>
          </div>

          <p className={styles.footerNote}>
            © 2024 SantéClaire — {t('footer.rights')}
          </p>
        </div>
      </main>
    </div>
  )
}
