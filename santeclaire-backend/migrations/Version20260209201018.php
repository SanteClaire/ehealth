<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260209201018 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE document_medical_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE document_medical (id INT NOT NULL, patient_id INT NOT NULL, medecin_id INT DEFAULT NULL, nom_fichier VARCHAR(255) NOT NULL, nom_original VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, mime_type VARCHAR(100) NOT NULL, taille INT NOT NULL, description TEXT DEFAULT NULL, contenu_chiffre TEXT DEFAULT NULL, chemin_fichier VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, date_document DATE DEFAULT NULL, est_confidentiel BOOLEAN NOT NULL, resume_ia TEXT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D3B4A1866B899279 ON document_medical (patient_id)');
        $this->addSql('CREATE INDEX IDX_D3B4A1864F31A84 ON document_medical (medecin_id)');
        $this->addSql('COMMENT ON COLUMN document_medical.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN document_medical.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100) DEFAULT NULL, last_name VARCHAR(100) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, is_active BOOLEAN NOT NULL, type VARCHAR(255) NOT NULL, numero_securite_sociale VARCHAR(15) DEFAULT NULL, date_naissance DATE DEFAULT NULL, adresse VARCHAR(255) DEFAULT NULL, telephone VARCHAR(20) DEFAULT NULL, groupe_sanguin VARCHAR(10) DEFAULT NULL, allergies TEXT DEFAULT NULL, antecedents TEXT DEFAULT NULL, numero_rpps VARCHAR(50) DEFAULT NULL, specialite VARCHAR(100) DEFAULT NULL, adresse_cabinet VARCHAR(255) DEFAULT NULL, telephone_cabinet VARCHAR(20) DEFAULT NULL, horaires TEXT DEFAULT NULL, accepte_nouveaux_patients BOOLEAN DEFAULT NULL, tarif_consultation NUMERIC(6, 2) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN "user".updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE document_medical ADD CONSTRAINT FK_D3B4A1866B899279 FOREIGN KEY (patient_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE document_medical ADD CONSTRAINT FK_D3B4A1864F31A84 FOREIGN KEY (medecin_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE document_medical_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('ALTER TABLE document_medical DROP CONSTRAINT FK_D3B4A1866B899279');
        $this->addSql('ALTER TABLE document_medical DROP CONSTRAINT FK_D3B4A1864F31A84');
        $this->addSql('DROP TABLE document_medical');
        $this->addSql('DROP TABLE "user"');
    }
}
