<?php

namespace App\Repository;

use App\Entity\Medecin;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Medecin>
 */
class MedecinRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Medecin::class);
    }

    /**
     * Trouve un médecin par son numéro RPPS
     */
    public function findByNumeroRPPS(string $numeroRPPS): ?Medecin
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.numeroRPPS = :numeroRPPS')
            ->setParameter('numeroRPPS', $numeroRPPS)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Recherche de médecins par spécialité
     */
    public function findBySpecialite(string $specialite): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.specialite = :specialite')
            ->setParameter('specialite', $specialite)
            ->andWhere('m.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('m.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve tous les médecins qui acceptent de nouveaux patients
     */
    public function findAcceptingNewPatients(): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.accepteNouveauxPatients = :accepts')
            ->setParameter('accepts', true)
            ->andWhere('m.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('m.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche de médecins par nom ou spécialité
     */
    public function search(string $query): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.firstName LIKE :query OR m.lastName LIKE :query OR m.specialite LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->andWhere('m.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('m.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Liste toutes les spécialités disponibles
     */
    public function findAllSpecialites(): array
    {
        $result = $this->createQueryBuilder('m')
            ->select('DISTINCT m.specialite')
            ->andWhere('m.specialite IS NOT NULL')
            ->andWhere('m.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('m.specialite', 'ASC')
            ->getQuery()
            ->getResult();

        return array_column($result, 'specialite');
    }
}
