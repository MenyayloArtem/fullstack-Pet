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
    #[Route('/api/chat/{chatId}/members', name: 'app_chats_members', methods: ["POST"])]
    public function addMember(
        ChatsManager $chatsManager,
        RequestService $requestService,
        EntityManagerInterface $entityManager,
        Request $request
    ): JsonResponse
    {

        $body = $requestService->getPostBody();

        $chat_id = $request->attributes->get("chatId");
        $member_id = $body["member_id"] ?? null;

        $chat = $entityManager->getRepository(Chat::class)->find($chat_id);
        $user = $entityManager->getRepository(User::class)->find($member_id);

        $chatsManager->setChat($chat)->addMember($user);
        $entityManager->flush();

        return $this->json([
            "chat" => "ok"
        ]);
    }

    #[Route("/api/chat/{chatId}/members", name: "get_members", methods: ["GET"])]
    public function getAll(
        EntityManagerInterface $entityManager,
        ChatsManager $chatsManager,
        Request $request,
        ChatMemberRepository $memberRepository
    ) : JsonResponse {

        $chat_id = $request->attributes->get("chatId");

        $chat = $entityManager->getRepository(Chat::class)->find($chat_id);

        if ($chat) {
            $members = $memberRepository->getAll($chat);

            return $this->json([
                "members" => $members
            ]);
        } else {
            throw new Exception("Chat no exists");
        }
    }

    #[Route("/api/chat/{chatId}/members")]
    public function deleteMember(
        RequestService $requestService,
        EntityManagerInterface $entityManager,
        Request $request
    ) : JsonResponse {
        $body = $requestService->getPostBody();
        $chat_id = $request->attributes->get("chatId");
        $member_id = $body["member_id"];

        if (!$chat_id && $member_id) {
            throw new \Exception("No chat or member id provided");
        }

        $chat = $entityManager->getRepository(Chat::class)->find($chat_id);

        if (!$chat) {
            throw new Exception("Chat with id $chat_id no exists");
        }

        $member = $entityManager->getRepository(User::class)->find($member_id);

        if (!$chat->getOwner()->getUserIdentifier() == $this->getUser()->getUserIdentifier()) {
            throw new AccessDeniedException();
        }

        if (!$member) {
            throw new \Exception("User with id $member_id not exists");
        }


        if ($member->getUserIdentifier() == $this->getUser()->getUserIdentifier()) {
            throw new \Exception("Cannot kick yourself");
        }

        $chatMember = $entityManager
            ->getRepository(ChatMember::class)
            ->findOneBy([
                "chat" => $chat_id,
                "member" => $member
            ]);

        if ($chatMember) {
            $entityManager->remove($chatMember);
            $entityManager->flush();
            return $this->json([
                "message" => "Member ".$member->getUserIdentifier()." was kicked"
            ]);
        } else {
            throw new Exception("Chat ".$chat->getTitle()." has no ".$member->getUserIdentifier()." member");
        }
    }
}
