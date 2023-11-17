<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\RequestService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class UserController extends AbstractController
{
    #[Route('/api/user/chats', name: 'app_user')]
    public function index(
        UserRepository $userRepository
    ): JsonResponse
    {
        return $this->json([
            'message' => $userRepository->getCurrentUserChats(),
            'path' => 'src/Controller/UserController.php',
        ]);
    }


    #[Route("/api/user/{userId}", name: "user_get", methods: ["GET"])]
    public function getUserById (
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($request->attributes->get("userId"));

        if (!$user) throw new EntityNotFoundException();

        return $this->json([
            "user" => $user
        ]);
    }

    #[Route("/api/user/{userId}", name: "edit_user", methods: ["PATCH"])]
    public function editUser(
        Request $request,
        RequestService $requestService,
        EntityManagerInterface $entityManager
    ) : JsonResponse {
        $user = $entityManager->getRepository(User::class)->find($request->attributes->get("userId"));

        if (!$user) throw new EntityNotFoundException();
        if ($user->getUserIdentifier() != $this->getUser()->getUserIdentifier()) throw new AccessDeniedException();

        $body = $requestService->getPostBody();

        $username = $body["username"] ?? "";
        $email = $body["email"] ?? "";

        if ($username) $user->setUsername($username);
        if ($email) $user->setEmail($email);

        $entityManager->flush();

        return $this->json($user);

    }
}
