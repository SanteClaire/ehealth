<?php

namespace App\Controller\Api;

use App\Entity\Patient;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class SecurityController extends AbstractApiController
{
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $role = $data['role'] ?? 'patient';

        if (!$data || !isset($data['email'], $data['password'])) {
            return $this->apiResponse(false, null, 'Données invalides', [], [], 400);
        }

        if ($entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']])) {
            return $this->apiResponse(false, null, 'Cet email est déjà utilisé', [], [], 422);
        }

        try {
            if ($role === 'medecin') {
                $user = new \App\Entity\Medecin();
                $user->setNumeroRPPS($data['rpps'] ?? '00000000000');
                $user->setSpecialite($data['specialite'] ?? 'Généraliste');
                $user->setAdresseCabinet($data['adresse'] ?? 'Non renseignée');
            } else {
                $user = new \App\Entity\Patient();
                $user->setNumeroSecuriteSociale($data['nss'] ?? substr(str_shuffle('123456789012345'), 0, 15));
                
                // Utilisation de DateTime pour la compatibilité Doctrine DateType
                try {
                    $birthDateString = $data['birthDate'] ?? 'today';
                    $birthDateImmutable = new \DateTimeImmutable($birthDateString);
                    // Conversion forcée en DateTime classique
                    $birthDate = \DateTime::createFromImmutable($birthDateImmutable);
                    $user->setDateNaissance($birthDate);
                } catch (\Exception $e) {
                    $user->setDateNaissance(new \DateTime());
                }
                
                $user->setAdresse($data['adresse'] ?? 'Non renseignée');
                $user->setTelephone($data['telephone'] ?? 'Non renseigné');
            }

            $user->setEmail($data['email']);
            $user->setFirstName($data['firstName'] ?? '');
            $user->setLastName($data['lastName'] ?? '');
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));

            $entityManager->persist($user);
            $entityManager->flush();

            return $this->apiResponse(true, [
                'email' => $user->getEmail(), 
                'role' => $role
            ], 'Inscription réussie', [], [], 201);
        } catch (\Exception $e) {
            // Log de l'erreur pour débuggage
            return $this->apiResponse(false, null, 'Erreur lors de l\'enregistrement : ' . $e->getMessage(), [], [], 500);
        }
    }

    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if (!$user) {
            return $this->apiResponse(false, null, 'Not authenticated', [], [], 401);
        }

        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
        ];

        // Ajouter les champs spécifiques Medecin
        if ($user instanceof \App\Entity\Medecin) {
            $data['numeroRPPS'] = $user->getNumeroRPPS();
            $data['specialite'] = $user->getSpecialite();
            $data['adresseCabinet'] = $user->getAdresseCabinet();
            $data['telephoneCabinet'] = $user->getTelephoneCabinet();
            $data['horaires'] = $user->getHoraires();
            $data['tarifConsultation'] = $user->getTarifConsultation();
            $data['estValide'] = $user->isEstValide();
        }

        // Ajouter les champs spécifiques Patient
        if ($user instanceof \App\Entity\Patient) {
            $data['numeroSecuriteSociale'] = $user->getNumeroSecuriteSociale();
            $data['dateNaissance'] = $user->getDateNaissance()?->format('Y-m-d');
            $data['adresse'] = $user->getAdresse();
            $data['telephone'] = $user->getTelephone();
            $data['groupeSanguin'] = $user->getGroupeSanguin();
            $data['allergies'] = $user->getAllergies();
            $data['antecedents'] = $user->getAntecedents();
        }

        return $this->apiResponse(true, $data, 'Current user profile');
    }
}
