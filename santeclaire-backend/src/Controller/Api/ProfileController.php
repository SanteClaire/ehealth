<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Patient;
use App\Entity\Medecin;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Controller pour la gestion des profils utilisateurs
 */
#[Route('/api/profile')]
class ProfileController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    /**
     * Récupère le profil de l'utilisateur connecté
     */
    #[Route('', name: 'api_profile_get', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = $this->serializeUser($user);

        return $this->json($data);
    }

    /**
     * Met à jour le profil de l'utilisateur connecté
     */
    #[Route('', name: 'api_profile_update', methods: ['PUT', 'PATCH'])]
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        // Mise à jour des champs communs
        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }

        // Mise à jour des champs spécifiques Patient
        if ($user instanceof Patient) {
            if (isset($data['telephone'])) {
                $user->setTelephone($data['telephone']);
            }
            if (isset($data['adresse'])) {
                $user->setAdresse($data['adresse']);
            }
            if (isset($data['dateNaissance'])) {
                $user->setDateNaissance(new \DateTime($data['dateNaissance']));
            }
            if (isset($data['groupeSanguin'])) {
                $user->setGroupeSanguin($data['groupeSanguin']);
            }
            if (isset($data['allergies'])) {
                $user->setAllergies($data['allergies']);
            }
        }

        // Mise à jour des champs spécifiques Médecin
        if ($user instanceof Medecin) {
            if (isset($data['specialite'])) {
                $user->setSpecialite($data['specialite']);
            }
            if (isset($data['adresseCabinet'])) {
                $user->setAdresseCabinet($data['adresseCabinet']);
            }
            if (isset($data['telephoneCabinet'])) {
                $user->setTelephoneCabinet($data['telephoneCabinet']);
            }
            if (isset($data['horaires'])) {
                $user->setHoraires($data['horaires']);
            }
            if (isset($data['accepteNouveauxPatients'])) {
                $user->setAccepteNouveauxPatients($data['accepteNouveauxPatients']);
            }
            if (isset($data['tarifConsultation'])) {
                $user->setTarifConsultation($data['tarifConsultation']);
            }
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $this->serializeUser($user)
        ]);
    }

    /**
     * Sérialise un utilisateur selon son type
     */
    private function serializeUser(User $user): array
    {
        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'fullName' => $user->getFullName(),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()?->format('c'),
        ];

        if ($user instanceof Patient) {
            $data['type'] = 'patient';
            $data['telephone'] = $user->getTelephone();
            $data['adresse'] = $user->getAdresse();
            $data['dateNaissance'] = $user->getDateNaissance()?->format('Y-m-d');
            $data['age'] = $user->getAge();
            $data['groupeSanguin'] = $user->getGroupeSanguin();
            $data['allergies'] = $user->getAllergies();
            $data['antecedents'] = $user->getAntecedents();
        }

        if ($user instanceof Medecin) {
            $data['type'] = 'medecin';
            $data['numeroRPPS'] = $user->getNumeroRPPS();
            $data['specialite'] = $user->getSpecialite();
            $data['adresseCabinet'] = $user->getAdresseCabinet();
            $data['telephoneCabinet'] = $user->getTelephoneCabinet();
            $data['horaires'] = $user->getHoraires();
            $data['accepteNouveauxPatients'] = $user->isAccepteNouveauxPatients();
            $data['tarifConsultation'] = $user->getTarifConsultation();
            $data['titreComplet'] = $user->getTitreComplet();
        }

        return $data;
    }
}
