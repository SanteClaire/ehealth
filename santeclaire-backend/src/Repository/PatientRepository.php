<?php

namespace App\Repository;

use App\Entity\Patient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Patient>
 */
class PatientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Patient::class);
    }

    /**
     * Trouve un patient par son numéro de sécurité sociale
     */
    public function findByNumeroSS(string $numeroSS): ?Patient
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.numeroSecuriteSociale = :numeroSS')
            ->setParameter('numeroSS', $numeroSS)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Recherche de patients par nom
     */
    public function searchByName(string $query): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.firstName LIKE :query OR p.lastName LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->andWhere('p.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('p.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve tous les patients actifs
     */
    public function findAllActive(): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('p.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les patients par groupe sanguin
     */
    public function findByGroupeSanguin(string $groupeSanguin): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.groupeSanguin = :groupe')
            ->setParameter('groupe', $groupeSanguin)
            ->andWhere('p.isActive = :active')
            ->setParameter('active', true)
            ->getQuery()
            ->getResult();
    }
}
