<?php

namespace App\Repository;

use App\Entity\DocumentMedical;
use App\Entity\Patient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DocumentMedical>
 */
class DocumentMedicalRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DocumentMedical::class);
    }

    /**
     * Trouve tous les documents d'un patient
     */
    public function findByPatient(Patient $patient): array
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.patient = :patient')
            ->setParameter('patient', $patient)
            ->orderBy('d.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les documents d'un patient par type
     */
    public function findByPatientAndType(Patient $patient, string $type): array
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.patient = :patient')
            ->setParameter('patient', $patient)
            ->andWhere('d.type = :type')
            ->setParameter('type', $type)
            ->orderBy('d.dateDocument', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche de documents par nom ou description
     */
    public function searchByPatient(Patient $patient, string $query): array
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.patient = :patient')
            ->setParameter('patient', $patient)
            ->andWhere('d.nomOriginal LIKE :query OR d.description LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('d.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les documents récents d'un patient
     */
    public function findRecentByPatient(Patient $patient, int $limit = 10): array
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.patient = :patient')
            ->setParameter('patient', $patient)
            ->orderBy('d.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Calcule la taille totale des documents d'un patient
     */
    public function getTotalSizeByPatient(Patient $patient): int
    {
        $result = $this->createQueryBuilder('d')
            ->select('SUM(d.taille) as total')
            ->andWhere('d.patient = :patient')
            ->setParameter('patient', $patient)
            ->getQuery()
            ->getSingleScalarResult();

        return (int) $result;
    }

    /**
     * Compte les documents par type pour un patient
     */
    public function countByTypeForPatient(Patient $patient): array
    {
        return $this->createQueryBuilder('d')
            ->select('d.type, COUNT(d.id) as count')
            ->andWhere('d.patient = :patient')
            ->setParameter('patient', $patient)
            ->groupBy('d.type')
            ->getQuery()
            ->getResult();
    }
}
