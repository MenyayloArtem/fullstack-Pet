<?php

namespace App\Service;

use App\Entity\Chat;
use App\Entity\ChatMember;
use App\Entity\ChatMessage;
use App\Entity\Media;
use App\Repository\AbstractMessageRepository;
use App\Repository\ChatMemberRepository;
use App\Repository\ChatMessageRepository;
use Doctrine\DBAL\Driver\PDO\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Serializer\SerializerInterface;

class ChatService
{
    public function __construct(
        private readonly RequestService $requestService,
        private readonly EntityManagerInterface $entityManager,
        private readonly RequestStack $request,
        private readonly AbstractMessageRepository $messageRepository,
        private readonly ChatMessageRepository $chatMessageRepository,
        private readonly ChatMemberRepository $memberRepository,
        private readonly Security $security
    )
    {
    }

    public function createChat (): array
    {
        $body = $this->requestService->getPostBody()["chat"];
        $title = $body["title"];
        $description = $body["description"];
        $media_id = $body["media_id"] ?? null;
        // title, ?description, ?media_id
        $chat = new Chat(1);
        $chat->setTitle($title);
        $chat->setDescription($description);
        $user = $this->security->getToken()?->getUser();

        if ($media_id) {
            $media = $this->entityManager->getRepository(Media::class)->find($media_id);

            if ($media) {
                $chat->setIcon($media);
            }
        }

        $chat->setOwner($user);

        $cm = new ChatMember();
        $cm->setMember($user);
        $cm->setChat($chat);

        $this->entityManager->persist($chat);
        $this->entityManager->persist($cm);
        $this->entityManager->flush();

        return [
            'message' => $chat,
            'path' => 'src/Controller/ChatsController.php',
        ];
    }

    public function editChat () {
        $body = $this->requestService->getPostBody();

        $chat_id = $body["chat_id"];
        $payload = $body["chat"];

        $title = $payload["title"] ?? null;
        $description = $payload["description"] ?? null;
        $media_id = $payload["media_id"] ?? null;
        $currentUser = $this->security->getUser();

//        $chat = 1;
        $chat = $this->entityManager->getRepository(Chat::class)->find($chat_id);

        if (!($chat && $currentUser->getUserIdentifier() == $chat->getOwner()->getUserIdentifier())) throw new AccessDeniedHttpException("Access denied");

        $chat->setTitle($title);

        if ($description) $chat->setDescription($description);

        if ($media_id) {
            $icon = $this->entityManager->getRepository(Media::class)->find($media_id);

            if ($icon) {
                $chat->setIcon($icon);
            } else {
                throw new \Exception("Icon not found");
            }
        } else {
            $chat->setIcon(null);
        }

        $this->entityManager->flush();
        return $chat;
    }

    public function getMessages()
    {
        $body = $this->requestService->getPostBody();
        $chat_id = $body["chat_id"];
        $page = $body["page"];
        return $this->chatMessageRepository->getMessages($chat_id, $page);
    }

    public function sendMessage (): array
    {
        $chat = $this->entityManager->getRepository(Chat::class)
            ->find($this->requestService->getPostBody()["chat_id"]);

        if (!$chat) throw new Exception("No chat");

        $message = new ChatMessage();
        $this->messageRepository->initMessage($message);
        $message->setChat($chat);

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        $medias = $this->entityManager->getRepository(Media::class)->findBy(["id" => $message->getMedias()]);

        return [
            "id" => $message->getId(),
            "sender" => $message->getSender(),
            "content" => $message->getContent(),
            "dateCreated" => $message->getDateCreated(),
            "reply_message" => $message->getReplyMessage(),
            "medias" => $medias
        ];
    }

    public function editMessage () {
        $body = $this->requestService->getPostBody();
        $messageId = $body["message_id"];
        $currentUser = $this->security->getUser();


        if (!$messageId) throw new \Exception("No message id provided");

        $message = $this->entityManager->getRepository(ChatMessage::class)->find($messageId);
        if ($message->getSender()->getUserIdentifier() !== $currentUser->getUserIdentifier()) throw new AccessDeniedException("saddasd");

        $this->messageRepository->updateMessage($message);
        $this->entityManager->flush();
        $medias = $this->entityManager->getRepository(Media::class)->findBy(["id" => $message->getMedias()]);
        $message->setMedias($medias);
        return $message;
    }

    public function searchMessages ()
    {
        $body = $this->requestService->getPostBody();
        $chat_id = $body["chat_id"];
        $text = $body["text"];
        $currentUser = $this->security->getUser();

        return $this->entityManager
            ->getRepository(ChatMessage::class)
            ->createQueryBuilder('m')
            ->where('m.content LIKE :searchText')
            ->andWhere('m.chat = :chatId')
            ->setParameters([
                'searchText' => '%' . $text . '%',
                'chatId' => $chat_id,
            ])
            ->getQuery()
            ->getResult();
    }

    public function checkMembership (): bool
    {
        $chatId = $this->request->getCurrentRequest()->query->get("chatId");
        $chat = $this->entityManager->getRepository(Chat::class)->find($chatId);

        return $this->memberRepository->checkMembership($chat);
    }
}