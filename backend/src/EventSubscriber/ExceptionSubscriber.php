<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => 'onKernelException'];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $request = $event->getRequest();
        
        // Ne pas intercepter les routes admin (EasyAdmin doit afficher ses propres erreurs HTML)
        if (str_starts_with($request->getPathInfo(), '/admin')) {
            return;
        }
        
        // Seulement pour les routes API, retourner du JSON
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }
        
        $exception = $event->getThrowable();
        $status = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500;

        $response = new JsonResponse([
            'success' => false,
            'data'    => null,
            'message' => $exception->getMessage(),
            'errors'  => [],
            'meta'    => []
        ], $status);

        $event->setResponse($response);
    }
}
