import styles from './CtaSection.module.css'

export default function CtaSection({ onOpenModal }) {
    return (
        <section className={styles.section}>
            <div className={styles.eyebrow}>Rejoignez SantéClaire</div>
            <h2 className={`${styles.title} fade-in`}>
                Prêt à simplifier votre parcours de santé ?
            </h2>
            <p className={`${styles.sub} fade-in`}>
                Créez votre compte gratuitement en 2 minutes. Aucune carte bancaire requise.
            </p>
            <div className={`${styles.buttons} fade-in`}>
                <button className={styles.btnPrimary} onClick={onOpenModal}>
                    Créer mon compte gratuit →
                </button>
                <a href="#how" className={styles.btnSecondary}>
                    En savoir plus
                </a>
            </div>
        </section>
    )
}
