<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

abstract class AbstractApiController extends AbstractController
{
    /**
     * Formatage standard de la réponse API
     */
    protected function apiResponse(
        bool $success,
        mixed $data = null,
        string $message = '',
        array $errors = [],
        array $meta = [],
        int $status = 200
    ): JsonResponse {
        return $this->json([
            'success' => $success,
            'data'    => $data,
            'message' => $message,
            'errors'  => $errors,
            'meta'    => $meta
        ], $status);
    }
}
