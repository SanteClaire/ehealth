import styles from './ForWho.module.css'
import { useLanguage } from '../hooks/useLanguage'

export default function ForWho({ onOpenModal }) {
    const { t } = useLanguage()
    const titleParts = (t('forwho.title') || 'Une plateforme, deux espaces.').split(/<br\s*\/?>/i)

    return (
        <section className={styles.section} id="about">
            <div className={`${styles.eyebrow} fade-in`}>{t('forwho.label') || 'Pour qui ?'}</div>
            <h2 className={`${styles.title} fade-in`} style={{ transitionDelay: '0.08s' }}>
                {titleParts.map((part, index) => (
                    <span key={`${part}-${index}`}>
                        {part}
                        {index < titleParts.length - 1 && <br />}
                    </span>
                ))}
            </h2>
            <p className={`${styles.sub} fade-in`} style={{ transitionDelay: '0.16s' }}>
                {t('forwho.subtitle') || 'Que vous soyez patient ou professionnel de santé, SantéClaire s\'adapte à vos besoins.'}
            </p>

            <div className={styles.grid}>
                {/* Patient card */}
                <div className={`${styles.card} ${styles.patient} fade-in`} style={{ transitionDelay: '0.1s' }}>
                    <div className={styles.icon}>👤</div>
                    <div className={styles.cardTitle}>{t('forwho.patient_title') || 'Espace Patient'}</div>
                    <p className={styles.cardDesc}>
                        {t('forwho.patient_desc') || 'Reprenez le contrôle de votre santé. Centralisez, organisez et partagez vos documents médicaux en toute sérénité.'}
                    </p>
                    <ul className={styles.list}>
                        <li>{t('forwho.patient_feature1') || 'Centralisation de tous vos documents'}</li>
                        <li>{t('forwho.patient_feature2') || 'Assistant IA disponible 24h/7j'}</li>
                        <li>{t('forwho.patient_feature3') || 'Partage sécurisé avec votre médecin'}</li>
                        <li>{t('forwho.patient_feature4') || 'Gestion des dossiers familiaux'}</li>
                        <li>{t('forwho.patient_feature5') || 'Notifications et rappels RDV'}</li>
                    </ul>
                    <button className={`${styles.btn} ${styles.patientBtn}`} onClick={onOpenModal}>
                        {t('forwho.patient_cta') || 'Créer mon espace patient'} →
                    </button>
                </div>

                {/* Médecin card */}
                <div className={`${styles.card} ${styles.medecin} fade-in`} style={{ transitionDelay: '0.22s' }}>
                    <div className={styles.icon}>🩺</div>
                    <div className={styles.cardTitle}>{t('forwho.doctor_title') || 'Espace Médecin'}</div>
                    <p className={styles.cardDesc}>
                        {t('forwho.doctor_desc') || 'Gagnez du temps à chaque consultation. Résumé IA, transcription automatique, comptes rendus générés en un clic.'}
                    </p>
                    <ul className={styles.list}>
                        <li>{t('forwho.doctor_feature1') || 'Résumé IA des antécédents patient'}</li>
                        <li>{t('forwho.doctor_feature2') || 'Transcription vocale → compte rendu'}</li>
                        <li>{t('forwho.doctor_feature3') || 'Accès sécurisé aux documents partagés'}</li>
                        <li>{t('forwho.doctor_feature4') || 'Signature électronique intégrée'}</li>
                        <li>{t('forwho.doctor_feature5') || 'Conforme aux exigences HDS'}</li>
                    </ul>
                    <button className={`${styles.btn} ${styles.medecinBtn}`} onClick={onOpenModal}>
                        {t('forwho.doctor_cta') || 'Créer mon espace médecin'} →
                    </button>
                </div>
            </div>
        </section>
    )
}
