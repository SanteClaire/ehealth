import styles from './HowItWorks.module.css'
import { useLanguage } from '../hooks/useLanguage'

export default function HowItWorks() {
    const { t } = useLanguage()

    const steps = [
        {
            num: '01',
            title: t('how.step1_title') || 'Centralisez',
            text: t('how.step1_desc') || "Uploadez tous vos documents médicaux — ordonnances, résultats d'analyses, comptes rendus — en un seul endroit sécurisé et accessible partout.",
        },
        {
            num: '02',
            title: t('how.step2_title') || 'Contrôlez',
            text: t('how.step2_desc') || "Choisissez précisément ce que vous partagez avec chaque médecin. Vos documents sont partagés par défaut, mais vous gardez le contrôle total à tout moment.",
        },
        {
            num: '03',
            title: t('how.step3_title') || 'Consultez',
            text: t('how.step3_desc') || "Donnez un accès temporaire à votre médecin pendant la durée exacte du rendez-vous. L'accès expire automatiquement — conformément au RGPD.",
        },
    ]

    return (
        <section className={styles.section} id="how">
            <div className={`${styles.eyebrow} fade-in`}>{t('how.label') || 'Comment ça marche'}</div>
            <h2 className={`${styles.title} fade-in`} style={{ transitionDelay: '0.08s' }}>{t('how.title') || 'Simple pour tout le monde.'}</h2>
            <p className={`${styles.sub} fade-in`} style={{ transitionDelay: '0.16s' }}>
                {t('how.subtitle') || 'En 3 étapes, gérez l\'intégralité de votre parcours de santé depuis une seule plateforme.'}
            </p>
            <div className={styles.steps}>
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={`${styles.step} fade-in`}
                        style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
                    >
                        <div className={styles.stepNum}>{step.num}</div>
                        <div className={styles.stepTitle}>{step.title}</div>
                        <p className={styles.stepText}>{step.text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
