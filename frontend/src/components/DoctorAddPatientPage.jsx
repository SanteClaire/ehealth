import { useState } from 'react'
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import DoctorSidebar from './DoctorSidebar'
import styles from './DoctorAddPatientPage.module.css'

const initialForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    nir: '',
    notes: '',
    inviteEmail: true,
}

export default function DoctorAddPatientPage({ onNavigate, onLogout, onBack }) {
    const { t } = useLanguage()
    const [form, setForm] = useState(initialForm)
    const [submitted, setSubmitted] = useState(false)

    const set = (key) => (e) => {
        const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm((f) => ({ ...f, [key]: v }))
    }

    const canSubmit =
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.trim() &&
        form.phone.trim() &&
        form.birthDate &&
        form.gender

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!canSubmit) return
        // Démonstration : en production → POST /api/doctor/patients
        console.info('[SantéClaire] Nouveau patient (démo)', form)
        setSubmitted(true)
    }

    const handleBackToList = () => {
        setSubmitted(false)
        setForm(initialForm)
        onBack && onBack()
    }

    return (
        <div className={styles.layout}>
            <DoctorSidebar activeId="patients" onNavigate={onNavigate} onLogout={onLogout} />

            <main className={styles.main}>
                <div className={styles.topBar}>
                    <button type="button" className={styles.backBtn} onClick={() => onBack && onBack()}>
                        <ArrowLeft size={18} /> {t('doctor.addPatientBack')}
                    </button>
                    <LanguageSwitcher />
                </div>

                <div className={styles.headerBlock}>
                    <h1 className={styles.pageTitle}>{t('doctor.addPatientPageTitle')}</h1>
                    <p className={styles.pageSubtitle}>{t('doctor.addPatientPageDesc')}</p>
                </div>

                {submitted && (
                    <div className={styles.successBanner}>
                        <CheckCircle2 size={22} color="#059669" style={{ flexShrink: 0 }} />
                        <div>
                            <strong>{t('doctor.addPatientSuccess')}</strong>
                            <p>{t('doctor.addPatientSuccessHint')}</p>
                            <div className={styles.actions} style={{ marginTop: '0.75rem', paddingTop: 0, border: 'none' }}>
                                <button type="button" className={styles.btnPrimary} onClick={handleBackToList}>
                                    {t('doctor.addPatientBackToList')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!submitted && (
                    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="ap-first">
                                    {t('doctor.addPatientFirstName')} *
                                </label>
                                <input
                                    id="ap-first"
                                    className={styles.input}
                                    value={form.firstName}
                                    onChange={set('firstName')}
                                    autoComplete="given-name"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="ap-last">
                                    {t('doctor.addPatientLastName')} *
                                </label>
                                <input
                                    id="ap-last"
                                    className={styles.input}
                                    value={form.lastName}
                                    onChange={set('lastName')}
                                    autoComplete="family-name"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="ap-email">
                                    {t('doctor.addPatientEmail')} *
                                </label>
                                <input
                                    id="ap-email"
                                    type="email"
                                    className={styles.input}
                                    value={form.email}
                                    onChange={set('email')}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="ap-phone">
                                    {t('doctor.addPatientPhone')} *
                                </label>
                                <input
                                    id="ap-phone"
                                    type="tel"
                                    className={styles.input}
                                    value={form.phone}
                                    onChange={set('phone')}
                                    autoComplete="tel"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="ap-birth">
                                    {t('doctor.addPatientBirthDate')} *
                                </label>
                                <input
                                    id="ap-birth"
                                    type="date"
                                    className={styles.input}
                                    value={form.birthDate}
                                    onChange={set('birthDate')}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="ap-gender">
                                    {t('doctor.addPatientGender')} *
                                </label>
                                <select
                                    id="ap-gender"
                                    className={styles.select}
                                    value={form.gender}
                                    onChange={set('gender')}
                                    required
                                >
                                    <option value="">{t('doctor.addPatientGenderPlaceholder')}</option>
                                    <option value="female">{t('doctor.addPatientGenderFemale')}</option>
                                    <option value="male">{t('doctor.addPatientGenderMale')}</option>
                                    <option value="other">{t('doctor.addPatientGenderOther')}</option>
                                </select>
                            </div>
                            <div className={`${styles.field} ${styles.fieldFull}`}>
                                <label className={styles.label} htmlFor="ap-nir">
                                    {t('doctor.addPatientNir')} <span className={styles.optional}>({t('common.optional')})</span>
                                </label>
                                <input
                                    id="ap-nir"
                                    className={styles.input}
                                    value={form.nir}
                                    onChange={set('nir')}
                                    autoComplete="off"
                                    placeholder="—"
                                />
                            </div>
                            <div className={`${styles.field} ${styles.fieldFull}`}>
                                <label className={styles.label} htmlFor="ap-notes">
                                    {t('doctor.addPatientNotes')} <span className={styles.optional}>({t('doctor.addPatientOptional')})</span>
                                </label>
                                <textarea
                                    id="ap-notes"
                                    className={styles.textarea}
                                    value={form.notes}
                                    onChange={set('notes')}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <label className={styles.checkRow}>
                            <input type="checkbox" checked={form.inviteEmail} onChange={set('inviteEmail')} />
                            <span>{t('doctor.addPatientInviteEmail')}</span>
                        </label>
                        <p className={styles.hint}>{t('doctor.addPatientRequiredHint')}</p>

                        <div className={styles.actions}>
                            <button type="submit" className={styles.btnPrimary} disabled={!canSubmit}>
                                <UserPlus size={18} />
                                {t('doctor.addPatientSubmit')}
                            </button>
                            <button type="button" className={styles.btnGhost} onClick={() => onBack && onBack()}>
                                {t('doctor.addPatientCancel')}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    )
}
