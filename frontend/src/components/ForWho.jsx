import styles from './ForWho.module.css'

export default function ForWho({ onOpenModal }) {
    return (
        <section className={styles.section} id="about">
            <div className={styles.eyebrow}>Pour qui ?</div>
            <h2 className={styles.title}>Une plateforme,<br />deux espaces.</h2>
            <p className={styles.sub}>
                Que vous soyez patient ou professionnel de santé, SantéClaire s'adapte à vos besoins.
            </p>

            <div className={`${styles.grid} fade-in`}>
                {/* Patient card */}
                <div className={`${styles.card} ${styles.patient}`}>
                    <div className={styles.icon}>👤</div>
                    <div className={styles.cardTitle}>Espace Patient</div>
                    <p className={styles.cardDesc}>
                        Reprenez le contrôle de votre santé. Centralisez, organisez et partagez vos documents médicaux en toute sérénité.
                    </p>
                    <ul className={styles.list}>
                        <li>Centralisation de tous vos documents</li>
                        <li>Assistant IA disponible 24h/7j</li>
                        <li>Partage sécurisé avec votre médecin</li>
                        <li>Gestion des dossiers familiaux</li>
                        <li>Notifications et rappels RDV</li>
                    </ul>
                    <button className={`${styles.btn} ${styles.patientBtn}`} onClick={onOpenModal}>
                        Créer mon espace patient →
                    </button>
                </div>

                {/* Médecin card */}
                <div className={`${styles.card} ${styles.medecin}`}>
                    <div className={styles.icon}>🩺</div>
                    <div className={styles.cardTitle}>Espace Médecin</div>
                    <p className={styles.cardDesc}>
                        Gagnez du temps à chaque consultation. Résumé IA, transcription automatique, comptes rendus générés en un clic.
                    </p>
                    <ul className={styles.list}>
                        <li>Résumé IA des antécédents patient</li>
                        <li>Transcription vocale → compte rendu</li>
                        <li>Accès sécurisé aux documents partagés</li>
                        <li>Signature électronique intégrée</li>
                        <li>Conforme aux exigences HDS</li>
                    </ul>
                    <button className={`${styles.btn} ${styles.medecinBtn}`} onClick={onOpenModal}>
                        Créer mon espace médecin →
                    </button>
                </div>
            </div>
        </section>
    )
}
