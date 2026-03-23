<?php

namespace App\Controller\Api;

use App\Entity\Patient;
use App\Entity\DocumentMedical;
use App\Entity\Ordonnance;
use App\Entity\Dossier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class PatientDataController extends AbstractApiController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    #[Route('/patient/documents', name: 'api_patient_documents', methods: ['GET'])]
    public function patientDocuments(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Patient) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $documents = $this->em->getRepository(DocumentMedical::class)
            ->findBy(['patient' => $user], ['id' => 'DESC']);

        $data = array_map(fn($d) => [
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
                'specialite' => $d->getCreateurMedecin()->getSpecialite(),
            ] : null,
        ], $documents);

        return $this->apiResponse(true, $data, 'Patient documents');
    }

    #[Route('/patient/ordonnances', name: 'api_patient_ordonnances', methods: ['GET'])]
    public function patientOrdonnances(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Patient) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $ordonnances = $this->em->getRepository(Ordonnance::class)
            ->findBy(['patient' => $user], ['dateEmission' => 'DESC']);

        $data = array_map(fn($o) => [
            'id' => $o->getId(),
            'numero' => $o->getNumero(),
            'dateEmission' => $o->getDateEmission()?->format('Y-m-d'),
            'dateExpiration' => $o->getDateExpiration()?->format('Y-m-d'),
            'instructions' => $o->getInstructions(),
            'medecin' => [
                'id' => $o->getMedecin()->getId(),
                'firstName' => $o->getMedecin()->getFirstName(),
                'lastName' => $o->getMedecin()->getLastName(),
                'specialite' => $o->getMedecin()->getSpecialite(),
            ],
            'lignes' => array_map(fn($l) => [
                'id' => $l->getId(),
                'medicament' => $l->getMedicament()->getNomCommercial(),
                'molecule' => $l->getMedicament()->getNomMolecule(),
                'dosage' => $l->getMedicament()->getDosage(),
                'quantite' => $l->getQuantite(),
                'posologie' => $l->getPosologie(),
                'duree' => $l->getDuree(),
                'instructions' => $l->getInstructions(),
            ], $o->getLignes()->toArray()),
        ], $ordonnances);

        return $this->apiResponse(true, $data, 'Patient ordonnances');
    }

    #[Route('/patient/dossier', name: 'api_patient_dossier', methods: ['GET'])]
    public function patientDossier(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Patient) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $dossier = $this->em->getRepository(Dossier::class)
            ->findOneBy(['patient' => $user]);

        if (!$dossier) {
            return $this->apiResponse(true, null, 'No dossier found');
        }

        $data = [
            'id' => $dossier->getId(),
            'nom' => $dossier->getNom(),
            'description' => $dossier->getDescription(),
        ];

        return $this->apiResponse(true, $data, 'Patient dossier');
    }
}
