<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Entity\ChatMember;
use App\Entity\User;
use App\Repository\ChatMemberRepository;
use App\Repository\ChatRepository;
use App\Repository\UserRepository;
use App\Service\ChatsManager;
use App\Service\RequestService;
use App\Shared\Routes;
use Doctrine\DBAL\Driver\PDO\Exception;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Validator\ValidatorInterface;


class ChatsMembersController extends AbstractController
{
    /**
     * @throws \Exception
     */
    #[Route(Routes::chatMembers, name: 'app_chats_members', methods: ["POST"])]
    public function addMember(ChatsManager $chatsManager): JsonResponse {
        return $this->json($chatsManager->addMember());
    }

    #[Route(Routes::chatMembers, name: "get_members", methods: ["GET"])]
    public function getAll(ChatsManager $chatsManager
    ) : JsonResponse {
        return $this->json($chatsManager->getMembers());
    }

    #[Route(Routes::chatMembers, name: "delete_members", methods: ["DELETE"])]
    public function deleteMember(
        ChatsManager $chatsManager
    ) : JsonResponse {
        return $this->json($chatsManager->deleteMember());
    }

    /**
     * @throws Exception
     */
    #[Route(Routes::leaveChat, name: "leave_chat", methods: ["DELETE"])]
    public function leaveChat(
        ChatsManager $chatsManager
    ) : JsonResponse {
        return $this->json($chatsManager->deleteMember(true));
    }
}
