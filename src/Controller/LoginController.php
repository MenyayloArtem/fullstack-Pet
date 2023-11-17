<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\CheckRole;
use App\Service\RequestService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
    #[Route('/login', name: 'app_login', methods: ["POST"])]
    public function index(CheckRole $checkRole,
    RequestService $requestService,
    EntityManagerInterface $entityManager,
    UserPasswordHasherInterface $hasher
    ): JsonResponse|Passport
    {

        $body = $requestService->getPostBody();
        $username = $body["username"];
        $password = $body["password"];

        $user = $entityManager->getRepository(User::class)->findOneBy(["username" => $username]);

        if (!$user) throw new \Exception("sdds");

//        $hashedPassword = $user->getPassword();

        $compared = $hasher->isPasswordValid($user, $password);

        if ($compared) {
            return new Passport(
                new UserBadge($user->getUserIdentifier()),
                new PasswordCredentials($password)
            );
        }
         else {
            return $this->json([
                "error" => "error"
            ]);
        }

    }
}
