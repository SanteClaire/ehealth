<?php

namespace App\DataFixtures;

use App\Entity\Admin;
use App\Entity\ConsultationSession;
use App\Entity\DocumentMedical;
use App\Entity\Dossier;
use App\Entity\LigneOrdonnance;
use App\Entity\Medecin;
use App\Entity\Medicament;
use App\Entity\Ordonnance;
use App\Entity\Patient;
use App\Enum\FormatMedicament;
use App\Enum\NiveauAdmin;
use App\Enum\TypeDocument;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        // ============ ADMIN ============
        $admin = new Admin();
        $admin->setEmail('admin@santeclaire.fr');
        $admin->setFirstName('Super');
        $admin->setLastName('Admin');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $admin->setNiveau(NiveauAdmin::SUPER_ADMIN);
        $admin->setPermissions(['all']);
        $admin->setIpAutorisees(['127.0.0.1', '::1']);
        $manager->persist($admin);

        // ============ MEDECINS ============
        $medecins = [];
        
        $medecin1 = new Medecin();
        $medecin1->setEmail('dr.dupont@santeclaire.fr');
        $medecin1->setFirstName('Jean');
        $medecin1->setLastName('Dupont');
        $medecin1->setPassword($this->passwordHasher->hashPassword($medecin1, 'medecin123'));
        $medecin1->setNumeroRPPS('12345678901');
        $medecin1->setSpecialite('Médecine Générale');
        $medecin1->setAdresseCabinet('15 rue de la Santé, 75014 Paris');
        $medecin1->setTelephoneCabinet('01 45 67 89 12');
        $medecin1->setHoraires([
            'lundi' => '9h-12h, 14h-18h',
            'mardi' => '9h-12h, 14h-18h',
            'mercredi' => '9h-12h',
            'jeudi' => '9h-12h, 14h-18h',
            'vendredi' => '9h-12h, 14h-17h'
        ]);
        $medecin1->setTarifConsultation('25.00');
        $medecin1->setEstValide(true);
        $manager->persist($medecin1);
        $medecins[] = $medecin1;

        $medecin2 = new Medecin();
        $medecin2->setEmail('dr.martin@santeclaire.fr');
        $medecin2->setFirstName('Sophie');
        $medecin2->setLastName('Martin');
        $medecin2->setPassword($this->passwordHasher->hashPassword($medecin2, 'medecin123'));
        $medecin2->setNumeroRPPS('98765432109');
        $medecin2->setSpecialite('Cardiologie');
        $medecin2->setAdresseCabinet('28 avenue Victor Hugo, 75016 Paris');
        $medecin2->setTelephoneCabinet('01 42 33 44 55');
        $medecin2->setHoraires([
            'lundi' => '8h-13h',
            'mardi' => '8h-13h, 14h-17h',
            'jeudi' => '8h-13h, 14h-17h',
            'vendredi' => '8h-13h'
        ]);
        $medecin2->setTarifConsultation('50.00');
        $medecin2->setEstValide(true);
        $manager->persist($medecin2);
        $medecins[] = $medecin2;

        $medecin3 = new Medecin();
        $medecin3->setEmail('dr.bernard@santeclaire.fr');
        $medecin3->setFirstName('Pierre');
        $medecin3->setLastName('Bernard');
        $medecin3->setPassword($this->passwordHasher->hashPassword($medecin3, 'medecin123'));
        $medecin3->setNumeroRPPS('11122233344');
        $medecin3->setSpecialite('Dermatologie');
        $medecin3->setAdresseCabinet('5 place de la République, 69001 Lyon');
        $medecin3->setTelephoneCabinet('04 72 11 22 33');
        $medecin3->setTarifConsultation('45.00');
        $medecin3->setEstValide(true);
        $manager->persist($medecin3);
        $medecins[] = $medecin3;

        // ============ PATIENTS ============
        $patients = [];

        $patient1 = new Patient();
        $patient1->setEmail('marie.durand@email.fr');
        $patient1->setFirstName('Marie');
        $patient1->setLastName('Durand');
        $patient1->setPassword($this->passwordHasher->hashPassword($patient1, 'patient123'));
        $patient1->setNumeroSecuriteSociale('296047512345678');
        $patient1->setDateNaissance(new \DateTime('1996-04-15'));
        $patient1->setAdresse('42 rue des Lilas, 75020 Paris');
        $patient1->setTelephone('06 12 34 56 78');
        $patient1->setGroupeSanguin('A+');
        $patient1->setAllergies('Pénicilline, Arachides');
        $patient1->setAntecedents('Asthme léger depuis l\'enfance');
        $manager->persist($patient1);
        $patients[] = $patient1;

        $patient2 = new Patient();
        $patient2->setEmail('jean.petit@email.fr');
        $patient2->setFirstName('Jean');
        $patient2->setLastName('Petit');
        $patient2->setPassword($this->passwordHasher->hashPassword($patient2, 'patient123'));
        $patient2->setNumeroSecuriteSociale('185036712345678');
        $patient2->setDateNaissance(new \DateTime('1985-03-22'));
        $patient2->setAdresse('10 avenue de la Liberté, 69003 Lyon');
        $patient2->setTelephone('06 98 76 54 32');
        $patient2->setGroupeSanguin('O-');
        $patient2->setAllergies(null);
        $patient2->setAntecedents('Diabète type 2 diagnostiqué en 2020');
        $manager->persist($patient2);
        $patients[] = $patient2;

        $patient3 = new Patient();
        $patient3->setEmail('claire.moreau@email.fr');
        $patient3->setFirstName('Claire');
        $patient3->setLastName('Moreau');
        $patient3->setPassword($this->passwordHasher->hashPassword($patient3, 'patient123'));
        $patient3->setNumeroSecuriteSociale('275127812345678');
        $patient3->setDateNaissance(new \DateTime('1975-12-08'));
        $patient3->setAdresse('88 boulevard Haussmann, 75008 Paris');
        $patient3->setTelephone('06 55 44 33 22');
        $patient3->setGroupeSanguin('B+');
        $patient3->setAllergies('Sulfamides');
        $patient3->setAntecedents('Hypertension artérielle traitée');
        $manager->persist($patient3);
        $patients[] = $patient3;

        // ============ DOSSIERS MEDICAUX ============
        foreach ($patients as $patient) {
            $dossier = new Dossier();
            $dossier->setNom('Dossier médical - ' . $patient->getLastName());
            $dossier->setDescription('Dossier médical complet de ' . $patient->getFirstName() . ' ' . $patient->getLastName());
            $dossier->setPatient($patient);
            $manager->persist($dossier);
        }

        // ============ MEDICAMENTS ============
        $medicaments = [];

        $med1 = new Medicament();
        $med1->setNomCommercial('Doliprane');
        $med1->setNomMolecule('Paracétamol');
        $med1->setDosage('500mg');
        $med1->setForme(FormatMedicament::COMPRIME);
        $med1->setCodeATC('N02BE01');
        $med1->setEstGenerique(false);
        $med1->setContreIndications('Insuffisance hépatique sévère');
        $manager->persist($med1);
        $medicaments[] = $med1;

        $med2 = new Medicament();
        $med2->setNomCommercial('Amoxicilline');
        $med2->setNomMolecule('Amoxicilline');
        $med2->setDosage('1g');
        $med2->setForme(FormatMedicament::COMPRIME);
        $med2->setCodeATC('J01CA04');
        $med2->setEstGenerique(true);
        $med2->setContreIndications('Allergie aux pénicillines');
        $manager->persist($med2);
        $medicaments[] = $med2;

        $med3 = new Medicament();
        $med3->setNomCommercial('Ventoline');
        $med3->setNomMolecule('Salbutamol');
        $med3->setDosage('100µg/dose');
        $med3->setForme(FormatMedicament::SPRAY);
        $med3->setCodeATC('R03AC02');
        $med3->setEstGenerique(false);
        $med3->setContreIndications('Hypersensibilité au salbutamol');
        $manager->persist($med3);
        $medicaments[] = $med3;

        $med4 = new Medicament();
        $med4->setNomCommercial('Kardégic');
        $med4->setNomMolecule('Acide acétylsalicylique');
        $med4->setDosage('75mg');
        $med4->setForme(FormatMedicament::COMPRIME);
        $med4->setCodeATC('B01AC06');
        $med4->setEstGenerique(false);
        $med4->setContreIndications('Ulcère gastrique, hémophilie');
        $manager->persist($med4);
        $medicaments[] = $med4;

        $med5 = new Medicament();
        $med5->setNomCommercial('Metformine');
        $med5->setNomMolecule('Metformine');
        $med5->setDosage('850mg');
        $med5->setForme(FormatMedicament::COMPRIME);
        $med5->setCodeATC('A10BA02');
        $med5->setEstGenerique(true);
        $med5->setContreIndications('Insuffisance rénale sévère');
        $manager->persist($med5);
        $medicaments[] = $med5;

        // ============ ORDONNANCES ============
        // Ordonnance 1 - Patient 1 avec médecin 1
        $ordonnance1 = new Ordonnance();
        $ordonnance1->setNumero('ORD-2026-0001');
        $ordonnance1->setDateExpiration(new \DateTime('+3 months'));
        $ordonnance1->setInstructions('Prendre les médicaments pendant les repas.');
        $ordonnance1->setPatient($patient1);
        $ordonnance1->setMedecin($medecin1);
        $manager->persist($ordonnance1);

        $ligne1 = new LigneOrdonnance();
        $ligne1->setOrdonnance($ordonnance1);
        $ligne1->setMedicament($med1);
        $ligne1->setQuantite(2);
        $ligne1->setPosologie('1 comprimé matin et soir');
        $ligne1->setDuree('7 jours');
        $ligne1->setInstructions('En cas de douleur ou fièvre');
        $manager->persist($ligne1);

        // Ordonnance 2 - Patient 2 avec médecin 2
        $ordonnance2 = new Ordonnance();
        $ordonnance2->setNumero('ORD-2026-0002');
        $ordonnance2->setDateExpiration(new \DateTime('+6 months'));
        $ordonnance2->setInstructions('Traitement continu, consultation de suivi dans 3 mois.');
        $ordonnance2->setPatient($patient2);
        $ordonnance2->setMedecin($medecin2);
        $manager->persist($ordonnance2);

        $ligne2 = new LigneOrdonnance();
        $ligne2->setOrdonnance($ordonnance2);
        $ligne2->setMedicament($med5);
        $ligne2->setQuantite(3);
        $ligne2->setPosologie('1 comprimé 3 fois par jour');
        $ligne2->setDuree('3 mois');
        $ligne2->setInstructions('Pendant les repas');
        $manager->persist($ligne2);

        $ligne3 = new LigneOrdonnance();
        $ligne3->setOrdonnance($ordonnance2);
        $ligne3->setMedicament($med4);
        $ligne3->setQuantite(1);
        $ligne3->setPosologie('1 comprimé le matin');
        $ligne3->setDuree('3 mois');
        $ligne3->setInstructions('Prévention cardiovasculaire');
        $manager->persist($ligne3);

        // ============ CONSULTATIONS ============
        $consultation1 = new ConsultationSession();
        $consultation1->setPatient($patient1);
        $consultation1->setMedecin($medecin1);
        $consultation1->setDateDebut(new \DateTimeImmutable('-1 week'));
        $consultation1->setDateFin(new \DateTimeImmutable('-1 week +30 minutes'));
        $consultation1->setEstActive(false);
        $manager->persist($consultation1);

        $consultation2 = new ConsultationSession();
        $consultation2->setPatient($patient2);
        $consultation2->setMedecin($medecin2);
        $consultation2->setDateDebut(new \DateTimeImmutable('-3 days'));
        $consultation2->setDateFin(new \DateTimeImmutable('-3 days +45 minutes'));
        $consultation2->setEstActive(false);
        $manager->persist($consultation2);

        // Consultation active en cours
        $consultation3 = new ConsultationSession();
        $consultation3->setPatient($patient3);
        $consultation3->setMedecin($medecin1);
        $consultation3->setDateDebut(new \DateTimeImmutable('now'));
        $consultation3->setEstActive(true);
        $manager->persist($consultation3);

        // ============ DOCUMENTS MEDICAUX ============
        $doc1 = new DocumentMedical();
        $doc1->setNomFichier('analyse_sang_marie_2026.pdf');
        $doc1->setNomOriginal('Analyse sanguine - Marie Durand');
        $doc1->setType(TypeDocument::ANALYSE);
        $doc1->setMimeType('application/pdf');
        $doc1->setTaille(125000);
        $doc1->setPatient($patient1);
        $doc1->setCreateurMedecin($medecin1);
        $doc1->setEstConfidentiel(false);
        $doc1->setEstPartage(true);
        $doc1->setResumeIA('Bilan sanguin normal. Glycémie à jeun : 0.95 g/L. Cholestérol total : 1.80 g/L.');
        $manager->persist($doc1);

        $doc2 = new DocumentMedical();
        $doc2->setNomFichier('radio_thorax_jean_2026.pdf');
        $doc2->setNomOriginal('Radiographie thoracique - Jean Petit');
        $doc2->setType(TypeDocument::RADIOGRAPHIE);
        $doc2->setMimeType('application/pdf');
        $doc2->setTaille(2500000);
        $doc2->setPatient($patient2);
        $doc2->setCreateurMedecin($medecin2);
        $doc2->setEstConfidentiel(false);
        $doc2->setEstPartage(true);
        $doc2->setResumeIA('Radiographie thoracique sans anomalie. Silhouette cardiaque normale.');
        $manager->persist($doc2);

        $manager->flush();
    }
}
