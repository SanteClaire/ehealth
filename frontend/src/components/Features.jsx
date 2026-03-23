import styles from './Features.module.css'
import { useLanguage } from '../hooks/useLanguage'

export default function Features() {
    const { t } = useLanguage()

    const features = [
        {
            icon: '🤖',
            title: t('features.ai'),
            text: t('features.ai_desc'),
        },
        {
            icon: '🎙️',
            title: t('features.transcription') || 'Transcription automatique',
            text: t('features.transcription_desc') || "Le médecin enregistre la consultation, Whisper transcrit en temps réel et l'IA génère un compte rendu structuré et signable en un clic.",
            delay: '0.1s',
        },
        {
            icon: '👨‍👩‍👧',
            title: t('features.family'),
            text: t('features.family_desc'),
            delay: '0.15s',
        },
        {
            icon: '⏱️',
            title: t('features.access') || 'Accès temporaire RGPD',
            text: t('features.access_desc') || "Votre médecin accède à vos documents uniquement pendant la durée de la consultation. L'accès expire automatiquement — vous gardez le contrôle.",
            delay: '0.2s',
        },
    ]

    return (
        <section className={styles.section} id="features">
            <div className={`${styles.eyebrow} fade-in`}>{t('features.title')}</div>
            <h2 className={`${styles.title} fade-in`} style={{ transitionDelay: '0.08s' }}>{t('features.subtitle_visual')}</h2>
            <p className={`${styles.sub} fade-in`} style={{ transitionDelay: '0.16s' }}>
                {t('features.subtitle')}
            </p>
            <div className={styles.grid}>
                {features.map((f, i) => (
                    <div
                        key={i}
                        className={`${styles.card} fade-in`}
                        style={{ transitionDelay: `${i * 0.1}s` }}
                    >
                        <div className={styles.iconWrap}>{f.icon}</div>
                        <div className={styles.title2}>{f.title}</div>
                        <p className={styles.text}>{f.text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
