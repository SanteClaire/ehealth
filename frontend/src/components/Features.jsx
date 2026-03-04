import styles from './Features.module.css'

const features = [
    {
        icon: '🤖',
        title: 'Assistant IA médical',
        text: "Posez vos questions sur vos ordonnances, résultats d'analyses ou posologie. L'IA analyse vos documents pour des réponses précises et personnalisées.",
    },
    {
        icon: '🎙️',
        title: 'Transcription automatique',
        text: "Le médecin enregistre la consultation, Whisper transcrit en temps réel et l'IA génère un compte rendu structuré et signable en un clic.",
        delay: '0.1s',
    },
    {
        icon: '👨‍👩‍👧',
        title: 'Gestion de la famille',
        text: "Gérez les dossiers médicaux de vos proches en tant que représentant légal. Tutelle, représentation parentale — tout est pris en charge.",
        delay: '0.15s',
    },
    {
        icon: '⏱️',
        title: 'Accès temporaire RGPD',
        text: "Votre médecin accède à vos documents uniquement pendant la durée de la consultation. L'accès expire automatiquement — vous gardez le contrôle.",
        delay: '0.2s',
    },
]

export default function Features() {
    return (
        <section className={styles.section} id="features">
            <div className={`${styles.eyebrow} fade-in`}>Fonctionnalités</div>
            <h2 className={`${styles.title} fade-in`} style={{ transitionDelay: '0.08s' }}>Tout ce dont vous<br />avez besoin.</h2>
            <p className={`${styles.sub} fade-in`} style={{ transitionDelay: '0.16s' }}>
                Des outils pensés pour simplifier le parcours de soin, côté patient comme côté médecin.
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
