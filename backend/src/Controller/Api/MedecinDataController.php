<?php

namespace App\Controller\Api;

use App\Entity\Medecin;
use App\Entity\Patient;
use App\Entity\ConsultationSession;
use App\Entity\DocumentMedical;
use App\Entity\Ordonnance;
use App\Entity\Dossier;
use App\Entity\LigneOrdonnance;
use App\Entity\Medicament;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class MedecinDataController extends AbstractApiController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    #[Route('/medecin/patients', name: 'api_medecin_patients', methods: ['GET'])]
    public function medecinPatients(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        // Get unique patients from consultations
        $consultations = $this->em->getRepository(ConsultationSession::class)
            ->findBy(['medecin' => $user]);

        $patientsMap = [];
        foreach ($consultations as $c) {
            $patient = $c->getPatient();
            $pid = $patient->getId();
            if (!isset($patientsMap[$pid])) {
                $patientsMap[$pid] = [
                    'id' => $pid,
                    'firstName' => $patient->getFirstName(),
                    'lastName' => $patient->getLastName(),
                    'email' => $patient->getEmail(),
                    'telephone' => $patient->getTelephone(),
                    'dateNaissance' => $patient->getDateNaissance()?->format('Y-m-d'),
                    'groupeSanguin' => $patient->getGroupeSanguin(),
                    'allergies' => $patient->getAllergies(),
                    'antecedents' => $patient->getAntecedents(),
                    'lastConsultation' => $c->getDateDebut()?->format('Y-m-d H:i:s'),
                    'consultationCount' => 0,
                ];
            }
            $patientsMap[$pid]['consultationCount']++;
            // Keep most recent consultation date
            $currentDate = $c->getDateDebut()?->format('Y-m-d H:i:s');
            if ($currentDate > $patientsMap[$pid]['lastConsultation']) {
                $patientsMap[$pid]['lastConsultation'] = $currentDate;
            }
        }

        return $this->apiResponse(true, array_values($patientsMap), 'Doctor patients');
    }

    #[Route('/medecin/ordonnances', name: 'api_medecin_ordonnances', methods: ['GET'])]
    public function medecinOrdonnances(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $ordonnances = $this->em->getRepository(Ordonnance::class)
            ->findBy(['medecin' => $user], ['dateEmission' => 'DESC']);

        $data = array_map(fn($o) => [
            'id' => $o->getId(),
            'numero' => $o->getNumero(),
            'dateEmission' => $o->getDateEmission()?->format('Y-m-d'),
            'dateExpiration' => $o->getDateExpiration()?->format('Y-m-d'),
            'instructions' => $o->getInstructions(),
            'patient' => [
                'id' => $o->getPatient()->getId(),
                'firstName' => $o->getPatient()->getFirstName(),
                'lastName' => $o->getPatient()->getLastName(),
            ],
        ], $ordonnances);

        return $this->apiResponse(true, $data, 'Doctor ordonnances');
    }

    #[Route('/medecin/documents', name: 'api_medecin_documents', methods: ['GET'])]
    public function medecinDocuments(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $documents = $this->em->getRepository(DocumentMedical::class)
            ->findBy(['createurMedecin' => $user], ['id' => 'DESC']);

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'nomFichier' => $d->getNomFichier(),
            'nomOriginal' => $d->getNomOriginal(),
            'type' => $d->getType()->value,
            'mimeType' => $d->getMimeType(),
            'taille' => $d->getTaille(),
            'estPartage' => $d->isEstPartage(),
            'resumeIA' => $d->getResumeIA(),
            'patient' => [
                'id' => $d->getPatient()->getId(),
                'firstName' => $d->getPatient()->getFirstName(),
                'lastName' => $d->getPatient()->getLastName(),
            ],
        ], $documents);

        return $this->apiResponse(true, $data, 'Doctor documents');
    }

    #[Route('/medecin/patients/search', name: 'api_medecin_patients_search', methods: ['GET'])]
    public function searchPatients(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $query = $request->query->get('q', '');

        $qb = $this->em->createQueryBuilder()
            ->select('p')
            ->from(Patient::class, 'p')
            ->orderBy('p.lastName', 'ASC')
            ->setMaxResults(20);

        if ($query) {
            $qb->where('LOWER(p.firstName) LIKE :q OR LOWER(p.lastName) LIKE :q OR LOWER(p.email) LIKE :q')
               ->setParameter('q', '%' . strtolower($query) . '%');
        }

        $patients = $qb->getQuery()->getResult();

        $data = array_map(fn($p) => [
            'id' => $p->getId(),
            'firstName' => $p->getFirstName(),
            'lastName' => $p->getLastName(),
            'email' => $p->getEmail(),
            'telephone' => $p->getTelephone(),
            'dateNaissance' => $p->getDateNaissance()?->format('Y-m-d'),
        ], $patients);

        return $this->apiResponse(true, $data, 'Search results');
    }

    #[Route('/medecin/ordonnance', name: 'api_medecin_ordonnance_create', methods: ['POST'])]
    public function createOrdonnance(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['patientId'], $data['dateExpiration'])) {
            return $this->apiResponse(false, null, 'patientId et dateExpiration requis', [], [], 400);
        }

        $patient = $this->em->getRepository(Patient::class)->find($data['patientId']);
        if (!$patient) {
            return $this->apiResponse(false, null, 'Patient non trouvé', [], [], 404);
        }

        $numero = 'ORD-' . date('Y') . '-' . str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);

        $ordonnance = new Ordonnance();
        $ordonnance->setNumero($numero);
        $ordonnance->setDateExpiration(new \DateTime($data['dateExpiration']));
        $ordonnance->setInstructions($data['instructions'] ?? null);
        $ordonnance->setPatient($patient);
        $ordonnance->setMedecin($user);

        $this->em->persist($ordonnance);

        // Add lignes if provided
        if (!empty($data['lignes']) && is_array($data['lignes'])) {
            foreach ($data['lignes'] as $ligneData) {
                $medicament = null;
                if (!empty($ligneData['medicamentId'])) {
                    $medicament = $this->em->getRepository(Medicament::class)->find($ligneData['medicamentId']);
                }
                if (!$medicament) continue;

                $ligne = new LigneOrdonnance();
                $ligne->setOrdonnance($ordonnance);
                $ligne->setMedicament($medicament);
                $ligne->setQuantite($ligneData['quantite'] ?? 1);
                $ligne->setPosologie($ligneData['posologie'] ?? '');
                $ligne->setDuree($ligneData['duree'] ?? null);
                $ligne->setInstructions($ligneData['instructions'] ?? null);
                $this->em->persist($ligne);
            }
        }

        $this->em->flush();

        return $this->apiResponse(true, [
            'id' => $ordonnance->getId(),
            'numero' => $ordonnance->getNumero(),
        ], 'Ordonnance créée', [], [], 201);
    }

    #[Route('/medecin/patient/{id}', name: 'api_medecin_patient_detail', methods: ['GET'])]
    public function medecinPatientDetail(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $patient = $this->em->getRepository(Patient::class)->find($id);
        if (!$patient) {
            return $this->apiResponse(false, null, 'Patient not found', [], [], 404);
        }

        // Verify doctor has access (has consultations with this patient)
        $hasAccess = $this->em->getRepository(ConsultationSession::class)
            ->findOneBy(['medecin' => $user, 'patient' => $patient]);
        if (!$hasAccess) {
            return $this->apiResponse(false, null, 'Access denied to this patient', [], [], 403);
        }

        $consultations = $this->em->getRepository(ConsultationSession::class)
            ->findBy(['medecin' => $user, 'patient' => $patient], ['dateDebut' => 'DESC']);

        $documents = $this->em->getRepository(DocumentMedical::class)
            ->findBy(['patient' => $patient], ['id' => 'DESC']);

        $ordonnances = $this->em->getRepository(Ordonnance::class)
            ->findBy(['patient' => $patient], ['dateEmission' => 'DESC']);

        $dossier = $this->em->getRepository(Dossier::class)
            ->findOneBy(['patient' => $patient]);

        $data = [
            'id' => $patient->getId(),
            'firstName' => $patient->getFirstName(),
            'lastName' => $patient->getLastName(),
            'email' => $patient->getEmail(),
            'telephone' => $patient->getTelephone(),
            'dateNaissance' => $patient->getDateNaissance()?->format('Y-m-d'),
            'adresse' => $patient->getAdresse(),
            'groupeSanguin' => $patient->getGroupeSanguin(),
            'allergies' => $patient->getAllergies(),
            'antecedents' => $patient->getAntecedents(),
            'numeroSecuriteSociale' => $patient->getNumeroSecuriteSociale(),
            'dossier' => $dossier ? [
                'id' => $dossier->getId(),
                'nom' => $dossier->getNom(),
                'description' => $dossier->getDescription(),
            ] : null,
            'consultations' => array_map(fn($c) => [
                'id' => $c->getId(),
                'dateDebut' => $c->getDateDebut()?->format('Y-m-d H:i:s'),
                'dateFin' => $c->getDateFin()?->format('Y-m-d H:i:s'),
                'estActive' => $c->isEstActive(),
            ], $consultations),
            'documents' => array_map(fn($d) => [
                'id' => $d->getId(),
                'nomFichier' => $d->getNomFichier(),
                'nomOriginal' => $d->getNomOriginal(),
                'type' => $d->getType()->value,
                'mimeType' => $d->getMimeType(),
                'taille' => $d->getTaille(),
                'estConfidentiel' => $d->isEstConfidentiel(),
                'estPartage' => $d->isEstPartage(),
                'resumeIA' => $d->getResumeIA(),
                'createurMedecin' => $d->getCreateurMedecin() ? [
                    'id' => $d->getCreateurMedecin()->getId(),
                    'firstName' => $d->getCreateurMedecin()->getFirstName(),
                    'lastName' => $d->getCreateurMedecin()->getLastName(),
                ] : null,
            ], $documents),
            'ordonnances' => array_map(fn($o) => [
                'id' => $o->getId(),
                'numero' => $o->getNumero(),
                'dateEmission' => $o->getDateEmission()?->format('Y-m-d'),
                'dateExpiration' => $o->getDateExpiration()?->format('Y-m-d'),
                'instructions' => $o->getInstructions(),
                'lignes' => array_map(fn($l) => [
                    'id' => $l->getId(),
                    'medicament' => $l->getMedicament()->getNomCommercial(),
                    'molecule' => $l->getMedicament()->getNomMolecule(),
                    'dosage' => $l->getMedicament()->getDosage(),
                    'quantite' => $l->getQuantite(),
                    'posologie' => $l->getPosologie(),
                    'duree' => $l->getDuree(),
                ], $o->getLignes()->toArray()),
            ], $ordonnances),
        ];

        return $this->apiResponse(true, $data, 'Patient detail');
    }
}
