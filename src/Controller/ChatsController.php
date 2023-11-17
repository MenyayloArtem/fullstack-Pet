<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Entity\Media;
use App\Repository\AbstractMessageRepository;
use App\Repository\ChatMemberRepository;
use App\Repository\UserRepository;
use App\Service\RequestService;
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
    #[Route('/api/chat', name: 'app_chats', methods: ["POST"])]
    public function index(
        RequestService $requestService,
        Security $security,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        extract($requestService->getPostBody());
        // title, ?description, ?media_id
        $chat = new Chat();
        $chat->setTitle($title);
        $chat->setDescription($description);
        $user = $security->getToken()?->getUser();

        if ($user) {
            if ($media_id) {
                $media = $entityManager->getRepository(Media::class)->find($media_id);

                if ($media) {
                    $chat->setIcon($media);
                }
            }

            $chat->setOwner($user);

            $entityManager->persist($chat);
            $entityManager->flush();
        } else {
            return $this->json([
               "message" => "Unauthorized"
            ]);
        }

        return $this->json([
            'message' => $chat,
            'path' => 'src/Controller/ChatsController.php',
        ]);
    }

    // Edit chat
    #[Route("/api/chat/{chatId}", name: "chat_edit", methods: ["PATCH"])]
    public function edit (
        RequestService $requestService,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        Request $request
    ) {
        $body = $requestService->getPostBody();

        $payload = $body["payload"];

        $title = $payload["title"] ?? null;
        $description = $payload["description"] ?? null;

        $currentUser = $this->getUser();

        $chat = $entityManager->getRepository(Chat::class)->find($request->attributes->get("chatId"));

        if (!($chat && $currentUser->getUserIdentifier() == $chat->getOwner()->getUserIdentifier())) throw new AccessDeniedHttpException("Access denied");

            $chat->setTitle($title);

            if ($description) $chat->setDescription($description);

            if (isset($newChatBody["icon_id"])) {
                $icon = $entityManager->getRepository(Media::class)->find($newChatBody["icon_id"]);

                if ($icon) {
                    $chat->setIcon($icon);
                } else {
                    throw new \Exception("Icon not found");
                }
            }

            $entityManager->flush();

            return $this->json($chat);
    }

    #[Route("/api/chat/{chatId}/message", name: "add_message", methods: ["POST"])]
    public function sendMessage (
        RequestService $requestService,
        EntityManagerInterface $entityManager,
        Request $request,
        AbstractMessageRepository $messageRepository
    ) : JsonResponse {
        $chat = $entityManager->getRepository(Chat::class)->find($request->attributes->get("chatId"));

        if (!$chat) throw new Exception("No chat");

        $message = new ChatMessage();
        $messageRepository->initMessage($message);
        $message->setChat($chat);

        $entityManager->persist($message);
        $entityManager->flush();

        return $this->json([
            "id" => $message->getId(),
            "sender" => $message->getSender(),
            "content" => $message->getContent(),
            "reply_message" => $message->getReplyMessage()
        ]);
    }

    #[Route("/api/chat/{chatId}/message", name: "edit_message", methods: ["PATCH"])]
    public function editMessage(
        RequestService $requestService,
        EntityManagerInterface $entityManager,
        AbstractMessageRepository $messageRepository,
        Request $request
    ) : JsonResponse {

        $body = $requestService->getPostBody();
        $messageId = $body["message_id"];

        if (!$messageId) throw new \Exception("No message id provided");

        $message = $entityManager->getRepository(ChatMessage::class)->find($messageId);
        if ($message->getChat()->getId() !== $request->attributes->get("chatId")) throw new AccessDeniedException();

        $messageRepository->updateMessage($message);

        $entityManager->flush();
        return $this->json($message);
    }

    #[Route("/api/chat/{chatId}/membership", methods: ["GET"])]
    public function checkMembership (
        ChatMemberRepository $memberRepository,
        RequestService $requestService,
        Request $request,
        EntityManagerInterface $entityManager
    ) : JsonResponse {
        $chatId = $request->attributes->get("chatId");
        $chat = $entityManager->getRepository(Chat::class)->find($chatId);

        return $this->json($memberRepository->checkMembership($chat));
    }
}
