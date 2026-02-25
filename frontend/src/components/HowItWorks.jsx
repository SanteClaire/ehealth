import styles from './HowItWorks.module.css'

const steps = [
    {
        num: '01',
        title: 'Centralisez',
        text: "Uploadez tous vos documents médicaux — ordonnances, résultats d'analyses, comptes rendus — en un seul endroit sécurisé et accessible partout.",
    },
    {
        num: '02',
        title: 'Contrôlez',
        text: "Choisissez précisément ce que vous partagez avec chaque médecin. Vos documents sont partagés par défaut, mais vous gardez le contrôle total à tout moment.",
    },
    {
        num: '03',
        title: 'Consultez',
        text: "Donnez un accès temporaire à votre médecin pendant la durée exacte du rendez-vous. L'accès expire automatiquement — conformément au RGPD.",
    },
]

export default function HowItWorks() {
    return (
        <section className={styles.section} id="how">
            <div className={styles.eyebrow}>Comment ça marche</div>
            <h2 className={styles.title}>Simple pour tout le monde.</h2>
            <p className={styles.sub}>
                En 3 étapes, gérez l'intégralité de votre parcours de santé depuis une seule plateforme.
            </p>
            <div className={styles.steps}>
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={`${styles.step} fade-in`}
                        style={{ transitionDelay: `${i * 0.1}s` }}
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
