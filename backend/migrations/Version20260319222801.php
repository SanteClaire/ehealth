<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260319222801 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `admin` (niveau VARCHAR(255) NOT NULL, permissions JSON NOT NULL, dernier_audit VARCHAR(255) DEFAULT NULL, ip_autorisees JSON NOT NULL, date_nomination DATETIME NOT NULL, id INT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE consultation_session (id INT AUTO_INCREMENT NOT NULL, date_debut DATETIME NOT NULL, date_fin DATETIME DEFAULT NULL, est_active TINYINT NOT NULL, patient_id INT NOT NULL, medecin_id INT NOT NULL, INDEX IDX_954724366B899279 (patient_id), INDEX IDX_954724364F31A84 (medecin_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE document_medical (id INT AUTO_INCREMENT NOT NULL, nom_fichier VARCHAR(255) NOT NULL, nom_original VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, mime_type VARCHAR(100) NOT NULL, taille INT NOT NULL, contenu_chiffre LONGTEXT DEFAULT NULL, est_confidentiel TINYINT NOT NULL, est_partage TINYINT NOT NULL, resume_ia LONGTEXT DEFAULT NULL, patient_id INT NOT NULL, createur_medecin_id INT DEFAULT NULL, INDEX IDX_D3B4A1866B899279 (patient_id), INDEX IDX_D3B4A18629C758C2 (createur_medecin_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE dossier (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, lien_parents VARCHAR(255) DEFAULT NULL, patient_id INT NOT NULL, UNIQUE INDEX UNIQ_3D48E0376B899279 (patient_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE ligne_ordonnance (id INT AUTO_INCREMENT NOT NULL, quantite INT NOT NULL, posologie VARCHAR(255) NOT NULL, duree VARCHAR(100) DEFAULT NULL, instructions LONGTEXT DEFAULT NULL, is_substituable TINYINT NOT NULL, ordonnance_id INT NOT NULL, medicament_id INT NOT NULL, INDEX IDX_71E7DC712BF23B8F (ordonnance_id), INDEX IDX_71E7DC71AB0D61F7 (medicament_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE medecin (numero_rpps VARCHAR(11) NOT NULL, specialite VARCHAR(100) NOT NULL, adresse_cabinet VARCHAR(255) NOT NULL, telephone_cabinet VARCHAR(20) NOT NULL, horaires JSON DEFAULT NULL, accepte_nouveaux_patients TINYINT NOT NULL, tarif_consultation NUMERIC(10, 2) DEFAULT NULL, est_valide TINYINT NOT NULL, id INT NOT NULL, UNIQUE INDEX UNIQ_1BDA53C6780F782 (numero_rpps), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE medicament (id INT AUTO_INCREMENT NOT NULL, nom_commercial VARCHAR(255) NOT NULL, nom_molecule VARCHAR(255) NOT NULL, dosage VARCHAR(100) NOT NULL, forme VARCHAR(255) NOT NULL, code_atc VARCHAR(20) NOT NULL, est_generique TINYINT NOT NULL, contre_indications LONGTEXT DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE ordonnance (id INT AUTO_INCREMENT NOT NULL, numero VARCHAR(50) NOT NULL, date_emission DATE NOT NULL, date_expiration DATE NOT NULL, instructions LONGTEXT DEFAULT NULL, signature VARCHAR(255) DEFAULT NULL, qr_code VARCHAR(255) DEFAULT NULL, patient_id INT NOT NULL, medecin_id INT NOT NULL, UNIQUE INDEX UNIQ_924B326CF55AE19E (numero), INDEX IDX_924B326C6B899279 (patient_id), INDEX IDX_924B326C4F31A84 (medecin_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE patient (numero_securite_sociale VARCHAR(15) NOT NULL, date_naissance DATE NOT NULL, adresse VARCHAR(255) NOT NULL, telephone VARCHAR(20) NOT NULL, groupe_sanguin VARCHAR(5) DEFAULT NULL, allergies LONGTEXT DEFAULT NULL, antecedents LONGTEXT DEFAULT NULL, id INT NOT NULL, UNIQUE INDEX UNIQ_1ADAD7EB31AD32FB (numero_securite_sociale), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, is_active TINYINT NOT NULL, discr VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE `admin` ADD CONSTRAINT FK_880E0D76BF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE consultation_session ADD CONSTRAINT FK_954724366B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE consultation_session ADD CONSTRAINT FK_954724364F31A84 FOREIGN KEY (medecin_id) REFERENCES medecin (id)');
        $this->addSql('ALTER TABLE document_medical ADD CONSTRAINT FK_D3B4A1866B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE document_medical ADD CONSTRAINT FK_D3B4A18629C758C2 FOREIGN KEY (createur_medecin_id) REFERENCES medecin (id)');
        $this->addSql('ALTER TABLE dossier ADD CONSTRAINT FK_3D48E0376B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE ligne_ordonnance ADD CONSTRAINT FK_71E7DC712BF23B8F FOREIGN KEY (ordonnance_id) REFERENCES ordonnance (id)');
        $this->addSql('ALTER TABLE ligne_ordonnance ADD CONSTRAINT FK_71E7DC71AB0D61F7 FOREIGN KEY (medicament_id) REFERENCES medicament (id)');
        $this->addSql('ALTER TABLE medecin ADD CONSTRAINT FK_1BDA53C6BF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE ordonnance ADD CONSTRAINT FK_924B326C6B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE ordonnance ADD CONSTRAINT FK_924B326C4F31A84 FOREIGN KEY (medecin_id) REFERENCES medecin (id)');
        $this->addSql('ALTER TABLE patient ADD CONSTRAINT FK_1ADAD7EBBF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `admin` DROP FOREIGN KEY FK_880E0D76BF396750');
        $this->addSql('ALTER TABLE consultation_session DROP FOREIGN KEY FK_954724366B899279');
        $this->addSql('ALTER TABLE consultation_session DROP FOREIGN KEY FK_954724364F31A84');
        $this->addSql('ALTER TABLE document_medical DROP FOREIGN KEY FK_D3B4A1866B899279');
        $this->addSql('ALTER TABLE document_medical DROP FOREIGN KEY FK_D3B4A18629C758C2');
        $this->addSql('ALTER TABLE dossier DROP FOREIGN KEY FK_3D48E0376B899279');
        $this->addSql('ALTER TABLE ligne_ordonnance DROP FOREIGN KEY FK_71E7DC712BF23B8F');
        $this->addSql('ALTER TABLE ligne_ordonnance DROP FOREIGN KEY FK_71E7DC71AB0D61F7');
        $this->addSql('ALTER TABLE medecin DROP FOREIGN KEY FK_1BDA53C6BF396750');
        $this->addSql('ALTER TABLE ordonnance DROP FOREIGN KEY FK_924B326C6B899279');
        $this->addSql('ALTER TABLE ordonnance DROP FOREIGN KEY FK_924B326C4F31A84');
        $this->addSql('ALTER TABLE patient DROP FOREIGN KEY FK_1ADAD7EBBF396750');
        $this->addSql('DROP TABLE `admin`');
        $this->addSql('DROP TABLE consultation_session');
        $this->addSql('DROP TABLE document_medical');
        $this->addSql('DROP TABLE dossier');
        $this->addSql('DROP TABLE ligne_ordonnance');
        $this->addSql('DROP TABLE medecin');
        $this->addSql('DROP TABLE medicament');
        $this->addSql('DROP TABLE ordonnance');
        $this->addSql('DROP TABLE patient');
        $this->addSql('DROP TABLE `user`');
    }
}
