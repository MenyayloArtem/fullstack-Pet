<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Entity\Media;
use App\Repository\AbstractMessageRepository;
use App\Repository\ChatMemberRepository;
use App\Repository\ChatMessageRepository;
use App\Repository\UserRepository;
use App\Service\ChatService;
use App\Service\RequestService;
use App\Shared\Routes;
use Cassandra\Exception\UnauthorizedException;
use Doctrine\DBAL\Driver\PDO\Exception;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use http\Env\Response;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class ChatsController extends AbstractController
{

    // Create chat
    #[Route(Routes::chat, name: 'app_chats', methods: ["POST"])]
    public function index(ChatService $chatService): JsonResponse {
        return $this->json($chatService->createChat());
    }

    #[Route(Routes::chat, name: "chat_edit", methods: ["PATCH"])]
    public function edit (ChatService $chatService) {
        return $this->json($chatService->editChat());
    }

    #[Route(Routes::chatMessagesGet, name: "get_message", methods: ["POST"])]
    public function getMessages(ChatService $chatService): JsonResponse
    {
        return $this->json($chatService->getMessages());
    }

    #[Route(Routes::searchChatMessages, name: "search_messages", methods: ["POST"])]
    public function searchMessages(ChatService $chatService): JsonResponse
    {
        return $this->json($chatService->searchMessages());
    }

    #[Route(Routes::chatMessage, name: "add_message", methods: ["POST"])]
    public function sendMessage (ChatService $chatService) : JsonResponse {
        return $this->json($chatService->sendMessage());
    }

    /**
     * @throws \Exception
     */
    #[Route(Routes::chatMessage, name: "edit_message", methods: ["PATCH"])]
    public function editMessage(ChatService $chatService) : JsonResponse {
        return $this->json($chatService->editMessage());
    }

    #[Route(Routes::chatMembership, methods: ["GET"])]
    public function checkMembership (ChatService $chatService) : JsonResponse {
        return $this->json($chatService->checkMembership());
    }
}
