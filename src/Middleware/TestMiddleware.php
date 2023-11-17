<?php

namespace App\Middleware;

use Exception;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

//#[AsEventListener(event: RequestEvent::class, method: 'onRequest', priority: 1)]
class TestMiddleware
{

    private TokenStorageInterface $tokenStorage;

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @throws Exception
     */
    public function onRequest(RequestEvent $requestEvent): void
    {
        $request = $requestEvent->getRequest();
        $requestUri = $request->getRequestUri();
        $user = $this->tokenStorage->getToken()?->getUser();
        // TODO: Implement wrap() method.
        if (!$user && $requestUri != "/login") {
            throw new Exception("Unauthenticated");
        }
    }
}