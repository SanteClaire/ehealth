<?php

namespace App\Controller\Api;

use App\Entity\Patient;
use App\Entity\Medecin;
use App\Entity\ConsultationSession;
use App\Entity\DocumentMedical;
use App\Entity\Ordonnance;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class ConsultationController extends AbstractApiController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    /**
     * Get consultations for the logged-in patient
     */
    #[Route('/patient/consultations', name: 'api_patient_consultations', methods: ['GET'])]
    public function patientConsultations(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof Patient) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $consultations = $this->em->getRepository(ConsultationSession::class)
            ->findBy(['patient' => $user], ['dateDebut' => 'DESC']);

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'dateDebut' => $c->getDateDebut()?->format('Y-m-d H:i:s'),
            'dateFin' => $c->getDateFin()?->format('Y-m-d H:i:s'),
            'estActive' => $c->isEstActive(),
            'medecin' => [
                'id' => $c->getMedecin()->getId(),
                'firstName' => $c->getMedecin()->getFirstName(),
                'lastName' => $c->getMedecin()->getLastName(),
                'specialite' => $c->getMedecin()->getSpecialite(),
            ],
        ], $consultations);

        return $this->apiResponse(true, $data, 'Patient consultations');
    }

    /**
     * Get consultations for the logged-in doctor
     */
    #[Route('/medecin/consultations', name: 'api_medecin_consultations', methods: ['GET'])]
    public function medecinConsultations(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $consultations = $this->em->getRepository(ConsultationSession::class)
            ->findBy(['medecin' => $user], ['dateDebut' => 'DESC']);

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'dateDebut' => $c->getDateDebut()?->format('Y-m-d H:i:s'),
            'dateFin' => $c->getDateFin()?->format('Y-m-d H:i:s'),
            'estActive' => $c->isEstActive(),
            'patient' => [
                'id' => $c->getPatient()->getId(),
                'firstName' => $c->getPatient()->getFirstName(),
                'lastName' => $c->getPatient()->getLastName(),
            ],
        ], $consultations);

        return $this->apiResponse(true, $data, 'Doctor consultations');
    }

    /**
     * Get stats for the logged-in patient
     */
    #[Route('/patient/stats', name: 'api_patient_stats', methods: ['GET'])]
    public function patientStats(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof Patient) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        // Count consultations (RDV à venir)
        $qb = $this->em->createQueryBuilder();
        $rdvCount = $qb->select('COUNT(c.id)')
            ->from(ConsultationSession::class, 'c')
            ->where('c.patient = :patient')
            ->andWhere('c.dateDebut > :now')
            ->setParameter('patient', $user)
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getSingleScalarResult();

        $ordonnancesCount = $this->em->createQueryBuilder()
            ->select('COUNT(o.id)')
            ->from(Ordonnance::class, 'o')
            ->where('o.patient = :patient')
            ->setParameter('patient', $user)
            ->getQuery()
            ->getSingleScalarResult();

        $documentsCount = $this->em->createQueryBuilder()
            ->select('COUNT(d.id)')
            ->from(DocumentMedical::class, 'd')
            ->where('d.patient = :patient')
            ->setParameter('patient', $user)
            ->getQuery()
            ->getSingleScalarResult();

        $data = [
            'rdvCount' => (int)$rdvCount,
            'ordonnancesCount' => (int)$ordonnancesCount,
            'documentsCount' => (int)$documentsCount,
            'messagesCount' => 0,
        ];

        return $this->apiResponse(true, $data, 'Patient stats');
    }

    /**
     * Get stats for the logged-in doctor
     */
    #[Route('/medecin/stats', name: 'api_medecin_stats', methods: ['GET'])]
    public function medecinStats(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        // Count today's consultations
        $today = new \DateTime('today');
        $tomorrow = new \DateTime('tomorrow');
        
        $qb = $this->em->createQueryBuilder();
        $todayCount = $qb->select('COUNT(c.id)')
            ->from(ConsultationSession::class, 'c')
            ->where('c.medecin = :medecin')
            ->andWhere('c.dateDebut >= :today')
            ->andWhere('c.dateDebut < :tomorrow')
            ->setParameter('medecin', $user)
            ->setParameter('today', $today)
            ->setParameter('tomorrow', $tomorrow)
            ->getQuery()
            ->getSingleScalarResult();

        $sharedDocuments = $this->em->createQueryBuilder()
            ->select('COUNT(d.id)')
            ->from(DocumentMedical::class, 'd')
            ->where('d.createurMedecin = :medecin')
            ->andWhere('d.estPartage = true')
            ->setParameter('medecin', $user)
            ->getQuery()
            ->getSingleScalarResult();

        $totalPatients = $this->em->createQueryBuilder()
            ->select('COUNT(DISTINCT c2.patient)')
            ->from(ConsultationSession::class, 'c2')
            ->where('c2.medecin = :medecin')
            ->setParameter('medecin', $user)
            ->getQuery()
            ->getSingleScalarResult();

        $data = [
            'consultationsToday' => (int)$todayCount,
            'totalPatients' => (int)$totalPatients,
            'sharedDocuments' => (int)$sharedDocuments,
            'pendingReports' => 0,
        ];

        return $this->apiResponse(true, $data, 'Doctor stats');
    }

    /**
     * Get today's appointments for the logged-in doctor
     */
    #[Route('/medecin/appointments/today', name: 'api_medecin_appointments_today', methods: ['GET'])]
    public function medecinTodayAppointments(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof Medecin) {
            return $this->apiResponse(false, null, 'Access denied', [], [], 403);
        }

        $today = new \DateTime('today');
        $tomorrow = new \DateTime('tomorrow');

        $consultations = $this->em->createQueryBuilder()
            ->select('c')
            ->from(ConsultationSession::class, 'c')
            ->where('c.medecin = :medecin')
            ->andWhere('c.dateDebut >= :today')
            ->andWhere('c.dateDebut < :tomorrow')
            ->setParameter('medecin', $user)
            ->setParameter('today', $today)
            ->setParameter('tomorrow', $tomorrow)
            ->orderBy('c.dateDebut', 'ASC')
            ->getQuery()
            ->getResult();

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'time' => $c->getDateDebut()?->format('H:i'),
            'patient' => [
                'id' => $c->getPatient()->getId(),
                'firstName' => $c->getPatient()->getFirstName(),
                'lastName' => $c->getPatient()->getLastName(),
                'initials' => strtoupper(substr($c->getPatient()->getFirstName(), 0, 1) . substr($c->getPatient()->getLastName(), 0, 1)),
            ],
            'estActive' => $c->isEstActive(),
        ], $consultations);

        return $this->apiResponse(true, $data, 'Today appointments');
    }
}
