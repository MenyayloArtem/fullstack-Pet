<?php

namespace App\Security;

use App\Repository\UserRepository;
use App\Service\RequestService;
use Doctrine\Common\Lexer\Token;
use Symfony\Bundle\SecurityBundle\DependencyInjection\Security\Factory\AccessTokenFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\AbstractToken;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class CustomToken extends AbstractToken {
    public function __construct(UserInterface $user,array $roles = [])
    {
        parent::__construct($roles);
        $this->setUser($user);
    }
}


class CustomAuth extends AbstractAuthenticator
{


    public function __construct(
        private readonly RequestService $requestService,
        private readonly UserRepository $userRepository
    )
    {
    }

    public function supports (Request $request): ?bool
    {
        return (bool)$request->headers->has("X-AUTH-TOKEN");
    }

    public function authenticate(Request $request): Passport
    {
        // TODO: Implement authenticate() method.
        $token = $request->headers->get("X-AUTH-TOKEN");

        if (null == $token) {
            throw new CustomUserMessageAuthenticationException("No token");
        }

        $username = $this->requestService->getPostBody()["username"];
        $credentials = $this->requestService->getPostBody()["password"];

        return new Passport(new UserBadge($username, function (string $userIdentifier) {
            return $this->userRepository->findOneBy(["username" => $userIdentifier]);
        }), $credentials);
    }

    public function createToken(Passport $passport, string $firewallName): TokenInterface
    {
        return new CustomToken($passport->getUser());
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // TODO: Implement onAuthenticationSuccess() method.
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // TODO: Implement onAuthenticationFailure() method.
        $data = [
            // you may want to customize or obfuscate the message first
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        ];
        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }
}