<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\CheckRole;
use App\Service\RequestService;
use App\Shared\Routes;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

class LoginController extends AbstractController
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    #[Route(path: Routes::login, name: 'app_login', methods: ["POST"])]
    public function index(CheckRole $checkRole,
    RequestService $requestService,
    EntityManagerInterface $entityManager,
    UserPasswordHasherInterface $hasher
    ): JsonResponse
    {

        return $this->json([
            "user" => $this->getUser(),
            "isAdmin" => $this->isGranted("ROLE_ADMIN")
        ]);
    }

    #[Route(path: Routes::logout, name: 'app_logout', methods: ["POST"])]
    public function logout(Security $security
    ): JsonResponse
    {

        $security->logout(false);
        return $this->json([
            "message" => "Ok"
        ]);
    }
}
