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
        // ============ ADMINS ============
        $admin = new Admin();
        $admin->setEmail('admin@santeclaire.fr');
        $admin->setFirstName('Super');
        $admin->setLastName('Admin');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $admin->setNiveau(NiveauAdmin::SUPER_ADMIN);
        $admin->setPermissions(['all']);
        $admin->setIpAutorisees(['127.0.0.1', '::1']);
        $manager->persist($admin);

        $admin2 = new Admin();
        $admin2->setEmail('moderateur@santeclaire.fr');
        $admin2->setFirstName('Elise');
        $admin2->setLastName('Garnier');
        $admin2->setPassword($this->passwordHasher->hashPassword($admin2, 'admin123'));
        $admin2->setNiveau(NiveauAdmin::MODERATOR);
        $admin2->setPermissions(['users', 'documents']);
        $admin2->setIpAutorisees(['127.0.0.1']);
        $manager->persist($admin2);

        // ============ MEDECINS (5) ============
        $medecinData = [
            ['dr.dupont@santeclaire.fr', 'Jean', 'Dupont', '12345678901', 'Médecine Générale', '15 rue de la Santé, 75014 Paris', '01 45 67 89 12', '25.00',
                ['lundi'=>'9h-12h, 14h-18h','mardi'=>'9h-12h, 14h-18h','mercredi'=>'9h-12h','jeudi'=>'9h-12h, 14h-18h','vendredi'=>'9h-12h, 14h-17h']],
            ['dr.martin@santeclaire.fr', 'Sophie', 'Martin', '98765432109', 'Cardiologie', '28 avenue Victor Hugo, 75016 Paris', '01 42 33 44 55', '50.00',
                ['lundi'=>'8h-13h','mardi'=>'8h-13h, 14h-17h','jeudi'=>'8h-13h, 14h-17h','vendredi'=>'8h-13h']],
            ['dr.bernard@santeclaire.fr', 'Pierre', 'Bernard', '11122233344', 'Dermatologie', '5 place de la République, 69001 Lyon', '04 72 11 22 33', '45.00',
                ['lundi'=>'9h-17h','mardi'=>'9h-17h','mercredi'=>'9h-12h','vendredi'=>'9h-17h']],
            ['dr.leclerc@santeclaire.fr', 'Catherine', 'Leclerc', '55566677788', 'Pédiatrie', '12 rue Pasteur, 33000 Bordeaux', '05 56 78 90 12', '35.00',
                ['lundi'=>'8h30-12h, 14h-18h','mardi'=>'8h30-12h, 14h-18h','jeudi'=>'8h30-12h, 14h-18h']],
            ['dr.moreau@santeclaire.fr', 'Antoine', 'Moreau', '99988877766', 'Neurologie', '45 boulevard Gambetta, 13001 Marseille', '04 91 22 33 44', '60.00',
                ['mardi'=>'9h-13h, 14h-18h','mercredi'=>'9h-13h','jeudi'=>'9h-13h, 14h-18h','vendredi'=>'9h-13h']],
        ];

        $medecins = [];
        foreach ($medecinData as $md) {
            $m = new Medecin();
            $m->setEmail($md[0]); $m->setFirstName($md[1]); $m->setLastName($md[2]);
            $m->setPassword($this->passwordHasher->hashPassword($m, 'medecin123'));
            $m->setNumeroRPPS($md[3]); $m->setSpecialite($md[4]); $m->setAdresseCabinet($md[5]);
            $m->setTelephoneCabinet($md[6]); $m->setTarifConsultation($md[7]); $m->setHoraires($md[8]);
            $m->setEstValide(true);
            $manager->persist($m);
            $medecins[] = $m;
        }

        // ============ PATIENTS (7) ============
        $patientData = [
            ['marie.durand@email.fr', 'Marie', 'Durand', '296047512345678', '1996-04-15', '42 rue des Lilas, 75020 Paris', '06 12 34 56 78', 'A+', 'Pénicilline, Arachides', 'Asthme léger depuis l\'enfance. Suivi pneumologique annuel.'],
            ['jean.petit@email.fr', 'Jean', 'Petit', '185036712345678', '1985-03-22', '10 avenue de la Liberté, 69003 Lyon', '06 98 76 54 32', 'O-', null, 'Diabète type 2 diagnostiqué en 2020. HbA1c contrôlée à 6.8%.'],
            ['claire.moreau@email.fr', 'Claire', 'Moreau', '275127812345678', '1975-12-08', '88 boulevard Haussmann, 75008 Paris', '06 55 44 33 22', 'B+', 'Sulfamides', 'Hypertension artérielle traitée depuis 2018. Cholestérol limite.'],
            ['lucas.roux@email.fr', 'Lucas', 'Roux', '100089912345678', '2000-08-19', '3 rue du Commerce, 31000 Toulouse', '06 77 88 99 00', 'AB+', null, 'Aucun antécédent notable. Vaccins à jour.'],
            ['sophie.lambert@email.fr', 'Sophie', 'Lambert', '290015612345678', '1990-01-30', '25 allée des Tilleuls, 44000 Nantes', '06 33 22 11 00', 'A-', 'Ibuprofène', 'Migraine chronique depuis 2019. IRM cérébrale normale (2024).'],
            ['paul.garcia@email.fr', 'Paul', 'Garcia', '165051234567890', '1965-05-12', '7 impasse des Oliviers, 13008 Marseille', '06 44 55 66 77', 'O+', 'Codéine', 'Arthrose genou droit. Prothèse hanche gauche (2023). Insuffisance rénale légère.'],
            ['emma.thomas@email.fr', 'Emma', 'Thomas', '203119812345678', '2003-11-02', '18 rue Voltaire, 33000 Bordeaux', '06 11 22 33 44', 'B-', null, 'Dermatite atopique depuis l\'enfance. Suivi dermatologique semestriel.'],
        ];

        $patients = [];
        foreach ($patientData as $pd) {
            $p = new Patient();
            $p->setEmail($pd[0]); $p->setFirstName($pd[1]); $p->setLastName($pd[2]);
            $p->setPassword($this->passwordHasher->hashPassword($p, 'patient123'));
            $p->setNumeroSecuriteSociale($pd[3]); $p->setDateNaissance(new \DateTime($pd[4]));
            $p->setAdresse($pd[5]); $p->setTelephone($pd[6]); $p->setGroupeSanguin($pd[7]);
            $p->setAllergies($pd[8]); $p->setAntecedents($pd[9]);
            $manager->persist($p);
            $patients[] = $p;
        }

        // ============ DOSSIERS ============
        foreach ($patients as $patient) {
            $d = new Dossier();
            $d->setNom('Dossier médical - ' . $patient->getLastName());
            $d->setDescription('Dossier médical complet de ' . $patient->getFirstName() . ' ' . $patient->getLastName());
            $d->setPatient($patient);
            $manager->persist($d);
        }

        // ============ MEDICAMENTS (12) ============
        $medData = [
            ['Doliprane', 'Paracétamol', '500mg', FormatMedicament::COMPRIME, 'N02BE01', false, 'Insuffisance hépatique sévère'],
            ['Doliprane', 'Paracétamol', '1000mg', FormatMedicament::COMPRIME, 'N02BE01', false, 'Insuffisance hépatique sévère'],
            ['Amoxicilline', 'Amoxicilline', '1g', FormatMedicament::COMPRIME, 'J01CA04', true, 'Allergie aux pénicillines'],
            ['Ventoline', 'Salbutamol', '100µg/dose', FormatMedicament::SPRAY, 'R03AC02', false, 'Hypersensibilité au salbutamol'],
            ['Kardégic', 'Acide acétylsalicylique', '75mg', FormatMedicament::COMPRIME, 'B01AC06', false, 'Ulcère gastrique, hémophilie'],
            ['Metformine', 'Metformine', '850mg', FormatMedicament::COMPRIME, 'A10BA02', true, 'Insuffisance rénale sévère'],
            ['Lévothyrox', 'Lévothyroxine', '75µg', FormatMedicament::COMPRIME, 'H03AA01', false, 'Hyperthyroïdie non traitée'],
            ['Tahor', 'Atorvastatine', '20mg', FormatMedicament::COMPRIME, 'C10AA05', false, 'Insuffisance hépatique active'],
            ['Spasfon', 'Phloroglucinol', '80mg', FormatMedicament::COMPRIME, 'A03AX12', false, 'Aucune contre-indication majeure'],
            ['Augmentin', 'Amoxicilline + Acide clavulanique', '1g/125mg', FormatMedicament::COMPRIME, 'J01CR02', false, 'Allergie aux pénicillines, insuffisance hépatique'],
            ['Toplexil', 'Oxomémazine', '0.33mg/ml', FormatMedicament::SIROP, 'R06AD08', false, 'Glaucome, troubles prostatiques'],
            ['Voltarène', 'Diclofénac', '75mg', FormatMedicament::INJECTION, 'M01AB05', false, 'Ulcère gastro-duodénal, insuffisance cardiaque sévère'],
        ];

        $medicaments = [];
        foreach ($medData as $md) {
            $m = new Medicament();
            $m->setNomCommercial($md[0]); $m->setNomMolecule($md[1]); $m->setDosage($md[2]);
            $m->setForme($md[3]); $m->setCodeATC($md[4]); $m->setEstGenerique($md[5]);
            $m->setContreIndications($md[6]);
            $manager->persist($m);
            $medicaments[] = $m;
        }

        // ============ CONSULTATIONS (15+) ============
        // Chaque médecin voit plusieurs patients, avec historique
        $consultations = [];

        // Dr Dupont (généraliste) — voit Marie, Claire, Lucas, Emma
        foreach ([[$patients[0], '-2 weeks', 30], [$patients[0], '-5 days', 20], [$patients[2], '-1 week', 45],
                  [$patients[3], '-3 days', 15], [$patients[6], '-10 days', 30], [$patients[0], 'now', null]] as $c) {
            $cs = new ConsultationSession();
            $cs->setPatient($c[0]); $cs->setMedecin($medecins[0]);
            $cs->setDateDebut(new \DateTimeImmutable($c[1]));
            if ($c[2]) $cs->setDateFin(new \DateTimeImmutable($c[1] . ' +' . $c[2] . ' minutes'));
            $cs->setEstActive($c[2] === null);
            $manager->persist($cs); $consultations[] = $cs;
        }

        // Dr Martin (cardiologue) — voit Jean, Claire, Paul
        foreach ([[$patients[1], '-3 weeks', 45], [$patients[1], '-4 days', 30], [$patients[2], '-2 weeks', 40],
                  [$patients[5], '-1 week', 60], [$patients[5], '-2 days', 45]] as $c) {
            $cs = new ConsultationSession();
            $cs->setPatient($c[0]); $cs->setMedecin($medecins[1]);
            $cs->setDateDebut(new \DateTimeImmutable($c[1]));
            $cs->setDateFin(new \DateTimeImmutable($c[1] . ' +' . $c[2] . ' minutes'));
            $cs->setEstActive(false);
            $manager->persist($cs); $consultations[] = $cs;
        }

        // Dr Bernard (dermatologue) — voit Emma, Sophie
        foreach ([[$patients[6], '-2 weeks', 20], [$patients[4], '-5 days', 25], [$patients[4], '-1 day', 30]] as $c) {
            $cs = new ConsultationSession();
            $cs->setPatient($c[0]); $cs->setMedecin($medecins[2]);
            $cs->setDateDebut(new \DateTimeImmutable($c[1]));
            $cs->setDateFin(new \DateTimeImmutable($c[1] . ' +' . $c[2] . ' minutes'));
            $cs->setEstActive(false);
            $manager->persist($cs);
        }

        // Dr Leclerc (pédiatrie) — voit Lucas
        $cs = new ConsultationSession();
        $cs->setPatient($patients[3]); $cs->setMedecin($medecins[3]);
        $cs->setDateDebut(new \DateTimeImmutable('-6 days'));
        $cs->setDateFin(new \DateTimeImmutable('-6 days +25 minutes'));
        $cs->setEstActive(false);
        $manager->persist($cs);

        // Dr Moreau (neurologie) — voit Sophie, Paul
        foreach ([[$patients[4], '-8 days', 50], [$patients[5], '-3 days', 40]] as $c) {
            $cs = new ConsultationSession();
            $cs->setPatient($c[0]); $cs->setMedecin($medecins[4]);
            $cs->setDateDebut(new \DateTimeImmutable($c[1]));
            $cs->setDateFin(new \DateTimeImmutable($c[1] . ' +' . $c[2] . ' minutes'));
            $cs->setEstActive(false);
            $manager->persist($cs);
        }

        // ============ ORDONNANCES (8) ============
        $ordonnances = [
            [$patients[0], $medecins[0], 'ORD-2026-0001', '+3 months', 'Prendre les médicaments pendant les repas. Revenir si fièvre persistante.',
                [[$medicaments[0], 2, '1 comprimé matin et soir', '7 jours', 'En cas de douleur ou fièvre'],
                 [$medicaments[3], 1, '2 bouffées en cas de crise d\'asthme', '6 mois', 'Ne pas dépasser 8 bouffées/jour']]],
            [$patients[1], $medecins[1], 'ORD-2026-0002', '+6 months', 'Traitement continu. Contrôle HbA1c dans 3 mois. Régime pauvre en sucres.',
                [[$medicaments[5], 3, '1 comprimé 3 fois par jour', '3 mois', 'Pendant les repas'],
                 [$medicaments[4], 1, '1 comprimé le matin', '3 mois', 'Prévention cardiovasculaire'],
                 [$medicaments[7], 1, '1 comprimé le soir', '3 mois', 'Contrôle cholestérol']]],
            [$patients[2], $medecins[0], 'ORD-2026-0003', '+1 month', 'Surveillance tension artérielle hebdomadaire. Éviter les aliments trop salés.',
                [[$medicaments[1], 2, '1 comprimé matin et soir', '10 jours', 'À prendre avec un grand verre d\'eau'],
                 [$medicaments[8], 2, '1 comprimé si douleur abdominale', '10 jours', 'Maximum 6 comprimés par jour']]],
            [$patients[0], $medecins[1], 'ORD-2026-0004', '+3 months', 'Bilan cardiologique de contrôle dans 3 mois.',
                [[$medicaments[4], 1, '1 comprimé le matin à jeun', '3 mois', 'Ne pas associer avec ibuprofène']]],
            [$patients[5], $medecins[1], 'ORD-2026-0005', '+6 months', 'Suivi post-prothèse. Kinésithérapie 2x/semaine.',
                [[$medicaments[0], 3, '1 comprimé toutes les 6h si douleur', '1 mois', 'Ne pas dépasser 4g/jour'],
                 [$medicaments[11], 1, '1 injection si douleur intense', '5 jours', 'Sous surveillance médicale']]],
            [$patients[4], $medecins[4], 'ORD-2026-0006', '+2 months', 'Traitement de fond migraine. Tenir un journal des crises.',
                [[$medicaments[1], 2, '1 comprimé au début de la crise', 'Si besoin', 'Maximum 2 prises par 24h']]],
            [$patients[6], $medecins[2], 'ORD-2026-0007', '+1 month', 'Application cutanée uniquement. Éviter exposition solaire.',
                [[$medicaments[8], 1, '1 comprimé si démangeaisons', '2 semaines', 'En cas de poussée']]],
            [$patients[3], $medecins[3], 'ORD-2026-0008', '+1 month', 'Vaccin rappel. Carnet de santé mis à jour.',
                [[$medicaments[0], 1, '1 comprimé si fièvre post-vaccin', '3 jours', 'Uniquement si fièvre > 38.5°C']]],
        ];

        foreach ($ordonnances as $oData) {
            $o = new Ordonnance();
            $o->setPatient($oData[0]); $o->setMedecin($oData[1]); $o->setNumero($oData[2]);
            $o->setDateExpiration(new \DateTime($oData[3])); $o->setInstructions($oData[4]);
            $manager->persist($o);
            foreach ($oData[5] as $lData) {
                $l = new LigneOrdonnance();
                $l->setOrdonnance($o); $l->setMedicament($lData[0]); $l->setQuantite($lData[1]);
                $l->setPosologie($lData[2]); $l->setDuree($lData[3]); $l->setInstructions($lData[4]);
                $manager->persist($l);
            }
        }

        // ============ DOCUMENTS MEDICAUX (15+) ============
        $docs = [
            // Marie Durand
            [$patients[0], $medecins[0], 'analyse_sang_marie.pdf', 'Analyse sanguine complète', TypeDocument::ANALYSE, 'application/pdf', 125000, true,
                'Bilan sanguin normal. Glycémie à jeun : 0.95 g/L. Cholestérol total : 1.80 g/L. Hémoglobine : 13.2 g/dL. Plaquettes : 245 000/mm³.'],
            [$patients[0], $medecins[1], 'ecg_marie.pdf', 'ECG de repos - Marie Durand', TypeDocument::ANALYSE, 'application/pdf', 89000, true,
                'ECG sinusal normal. Fréquence cardiaque : 72 bpm. Pas de trouble du rythme. Axe normal.'],
            [$patients[0], $medecins[0], 'radio_thorax_marie.pdf', 'Radiographie thoracique', TypeDocument::RADIOGRAPHIE, 'application/pdf', 2100000, true,
                'Radiographie thoracique face et profil sans anomalie. Poumons clairs. Pas de cardiomégalie.'],
            [$patients[0], $medecins[0], 'compte_rendu_consultation_marie.pdf', 'Compte-rendu consultation 12/03', TypeDocument::COMPTE_RENDU, 'application/pdf', 45000, false,
                'Patiente vue pour renouvellement traitement asthme. État stable. Peak flow normal. Renouvellement Ventoline.'],

            // Jean Petit
            [$patients[1], $medecins[1], 'bilan_cardio_jean.pdf', 'Bilan cardiologique complet', TypeDocument::ANALYSE, 'application/pdf', 340000, true,
                'Épreuve d\'effort normale. Échographie cardiaque : FEVG 62%. Pas de valvulopathie. Bon contrôle tensionnel sous traitement.'],
            [$patients[1], $medecins[1], 'radio_thorax_jean.pdf', 'Radiographie thoracique', TypeDocument::RADIOGRAPHIE, 'application/pdf', 2500000, true,
                'Radiographie thoracique sans anomalie. Silhouette cardiaque normale. Index cardio-thoracique < 0.5.'],
            [$patients[1], $medecins[0], 'analyse_hba1c_jean.pdf', 'HbA1c et bilan glycémique', TypeDocument::ANALYSE, 'application/pdf', 67000, true,
                'HbA1c : 6.8% (objectif < 7%). Glycémie à jeun : 1.12 g/L. Créatinine : 9 mg/L. DFG > 90 mL/min.'],

            // Claire Moreau
            [$patients[2], $medecins[0], 'bilan_tension_claire.pdf', 'Suivi tensionnel 7 jours', TypeDocument::ANALYSE, 'application/pdf', 78000, true,
                'Moyenne tensionnelle : 138/85 mmHg. Quelques pics à 155/95 en soirée. Adapter traitement recommandé.'],
            [$patients[2], $medecins[1], 'echo_cardiaque_claire.pdf', 'Échographie cardiaque', TypeDocument::ANALYSE, 'application/pdf', 450000, true,
                'FEVG conservée à 58%. Hypertrophie ventriculaire gauche légère. Pas de dilatation. Valves normales.'],

            // Sophie Lambert
            [$patients[4], $medecins[4], 'irm_cerebrale_sophie.pdf', 'IRM cérébrale', TypeDocument::RADIOGRAPHIE, 'application/pdf', 5200000, true,
                'IRM cérébrale sans anomalie parenchymateuse. Pas de lésion focale. Espaces liquidiens normaux. Conclusion : examen normal.'],
            [$patients[4], $medecins[2], 'bilan_dermato_sophie.pdf', 'Bilan dermatologique', TypeDocument::COMPTE_RENDU, 'application/pdf', 55000, true,
                'Dermatite atopique : poussées contrôlées sous émollient. Pas de surinfection. Continuer hydratation quotidienne.'],

            // Paul Garcia
            [$patients[5], $medecins[1], 'bilan_preop_paul.pdf', 'Bilan pré-opératoire prothèse', TypeDocument::ANALYSE, 'application/pdf', 230000, true,
                'Bilan pré-opératoire satisfaisant. Créatinine : 12 mg/L (surveillance). NFS normale. Coagulation normale. Feu vert chirurgie.'],
            [$patients[5], $medecins[4], 'irm_genou_paul.pdf', 'IRM genou droit', TypeDocument::RADIOGRAPHIE, 'application/pdf', 4800000, true,
                'Gonarthrose avancée du compartiment interne. Pincement fémoro-tibial interne complet. Ménisque interne dégénératif.'],
            [$patients[5], $medecins[0], 'certificat_medical_paul.pdf', 'Certificat médical sport adapté', TypeDocument::CERTIFICAT, 'application/pdf', 32000, true,
                'Certificat de non contre-indication à la pratique de la natation et marche nordique. Apte sous réserve suivi régulier.'],

            // Emma Thomas
            [$patients[6], $medecins[2], 'bilan_allergologique_emma.pdf', 'Bilan allergologique', TypeDocument::ANALYSE, 'application/pdf', 156000, true,
                'Prick-tests positifs : acariens, pollens graminées. IgE totales : 180 UI/mL. Pas de sensibilisation alimentaire détectée.'],
            [$patients[6], $medecins[3], 'carnet_vaccinal_emma.pdf', 'Mise à jour carnet vaccinal', TypeDocument::CERTIFICAT, 'application/pdf', 28000, true,
                'Vaccins à jour : DTPCoq, ROR, Hépatite B, HPV. Rappel DTPCoq effectué ce jour.'],

            // Lucas Roux
            [$patients[3], $medecins[3], 'bilan_sante_lucas.pdf', 'Bilan de santé annuel', TypeDocument::ANALYSE, 'application/pdf', 95000, true,
                'Bilan de santé normal pour l\'âge. IMC : 22.4. Tension : 118/72. Aucune anomalie détectée. Prochain bilan dans 1 an.'],
        ];

        foreach ($docs as $dData) {
            $doc = new DocumentMedical();
            $doc->setPatient($dData[0]); $doc->setCreateurMedecin($dData[1]);
            $doc->setNomFichier($dData[2]); $doc->setNomOriginal($dData[3]);
            $doc->setType($dData[4]); $doc->setMimeType($dData[5]); $doc->setTaille($dData[6]);
            $doc->setEstConfidentiel(false); $doc->setEstPartage($dData[7]);
            $doc->setResumeIA($dData[8]);
            $manager->persist($doc);
        }

        $manager->flush();
    }
}
