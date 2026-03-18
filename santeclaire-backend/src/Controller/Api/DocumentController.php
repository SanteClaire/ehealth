<?php

namespace App\Controller\Api;

use App\Entity\DocumentMedical;
use App\Entity\Patient;
use App\Repository\DocumentMedicalRepository;
use App\Service\ChiffrementService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controller pour la gestion des documents médicaux
 */
#[Route('/api/documents')]
class DocumentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private DocumentMedicalRepository $documentRepository
    ) {}

    /**
     * Liste tous les documents de l'utilisateur connecté
     */
    #[Route('', name: 'api_documents_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Patient) {
            return $this->json(['error' => 'Accès réservé aux patients'], Response::HTTP_FORBIDDEN);
        }

        $type = $request->query->get('type');
        $search = $request->query->get('search');

        if ($search) {
            $documents = $this->documentRepository->searchByPatient($user, $search);
        } elseif ($type) {
            $documents = $this->documentRepository->findByPatientAndType($user, $type);
        } else {
            $documents = $this->documentRepository->findByPatient($user);
        }

        $data = array_map(fn($doc) => $this->serializeDocument($doc), $documents);

        return $this->json([
            'documents' => $data,
            'total' => count($data),
        ]);
    }

    /**
     * Récupère un document spécifique
     */
    #[Route('/{id}', name: 'api_documents_get', methods: ['GET'])]
    public function get(int $id): JsonResponse
    {
        $user = $this->getUser();
        $document = $this->documentRepository->find($id);

        if (!$document) {
            return $this->json(['error' => 'Document non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que l'utilisateur a accès au document
        if ($user instanceof Patient && $document->getPatient()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès non autorisé'], Response::HTTP_FORBIDDEN);
        }

        return $this->json($this->serializeDocument($document));
    }

    /**
     * Upload un nouveau document
     */
    #[Route('', name: 'api_documents_upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Patient) {
            return $this->json(['error' => 'Accès réservé aux patients'], Response::HTTP_FORBIDDEN);
        }

        // TODO: Implémenter l'upload de fichier avec chiffrement
        // Voir US-2.x pour l'implémentation complète

        return $this->json([
            'message' => 'Endpoint upload - À implémenter dans Sprint 2',
        ], Response::HTTP_NOT_IMPLEMENTED);
    }

    /**
     * Supprime un document
     */
    #[Route('/{id}', name: 'api_documents_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        $document = $this->documentRepository->find($id);

        if (!$document) {
            return $this->json(['error' => 'Document non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que l'utilisateur est propriétaire du document
        if ($user instanceof Patient && $document->getPatient()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès non autorisé'], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($document);
        $this->entityManager->flush();

        return $this->json(['message' => 'Document supprimé avec succès']);
    }

    /**
     * Récupère les statistiques des documents
     */
    #[Route('/stats', name: 'api_documents_stats', methods: ['GET'], priority: 10)]
    public function stats(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Patient) {
            return $this->json(['error' => 'Accès réservé aux patients'], Response::HTTP_FORBIDDEN);
        }

        $totalSize = $this->documentRepository->getTotalSizeByPatient($user);
        $countByType = $this->documentRepository->countByTypeForPatient($user);
        $recentDocuments = $this->documentRepository->findRecentByPatient($user, 5);

        return $this->json([
            'totalSize' => $totalSize,
            'totalSizeFormatted' => $this->formatSize($totalSize),
            'countByType' => $countByType,
            'recentDocuments' => array_map(fn($doc) => $this->serializeDocument($doc), $recentDocuments),
        ]);
    }

    /**
     * Sérialise un document pour la réponse JSON
     */
    private function serializeDocument(DocumentMedical $document): array
    {
        return [
            'id' => $document->getId(),
            'nomFichier' => $document->getNomFichier(),
            'nomOriginal' => $document->getNomOriginal(),
            'type' => $document->getType(),
            'typeLabel' => DocumentMedical::getTypesDisponibles()[$document->getType()] ?? $document->getType(),
            'mimeType' => $document->getMimeType(),
            'taille' => $document->getTaille(),
            'tailleFormatee' => $document->getTailleFormatee(),
            'description' => $document->getDescription(),
            'dateDocument' => $document->getDateDocument()?->format('Y-m-d'),
            'estConfidentiel' => $document->isEstConfidentiel(),
            'resumeIA' => $document->getResumeIA(),
            'createdAt' => $document->getCreatedAt()?->format('c'),
            'updatedAt' => $document->getUpdatedAt()?->format('c'),
        ];
    }

    /**
     * Formate une taille en bytes en format lisible
     */
    private function formatSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
