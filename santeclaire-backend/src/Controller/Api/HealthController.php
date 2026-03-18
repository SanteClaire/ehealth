<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controller pour vérifier l'état de santé de l'API
 */
#[Route('/api')]
class HealthController extends AbstractController
{
    /**
     * Endpoint de vérification de l'état de l'API
     * Retourne le statut, le timestamp et des informations système
     */
    #[Route('/health', name: 'api_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        return $this->json([
            'status' => 'ok',
            'timestamp' => (new \DateTime())->format('c'),
            'app' => 'SantéClaire API',
            'version' => '1.0.0',
            'environment' => $this->getParameter('kernel.environment'),
            'php_version' => PHP_VERSION,
        ]);
    }

    /**
     * Endpoint de test simple
     */
    #[Route('/ping', name: 'api_ping', methods: ['GET'])]
    public function ping(): JsonResponse
    {
        return $this->json([
            'message' => 'pong',
            'time' => time(),
        ]);
    }
}
