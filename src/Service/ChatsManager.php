<?php

namespace App\Service;

use App\Entity\Chat;
use App\Entity\ChatMember;
use App\Entity\ChatMessage;
use App\Entity\User;
use App\Repository\ChatMemberRepository;
use App\Repository\ChatMessageRepository;
use App\Repository\ChatRepository;
use Doctrine\DBAL\Driver\PDO\Exception;
use Doctrine\ORM\EntityManagerInterface;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ChatsManager
{
 public function __construct(
     private readonly ValidatorInterface $validator,
     private readonly EntityManagerInterface $entityManager,
     private readonly ChatRepository $chatRepository,
     private readonly ChatMemberRepository $memberRepository,
     private readonly ChatMessageRepository $messageRepository,
     private readonly RequestService $requestService,
     private readonly RequestStack $request,
     private readonly Security $security
 )
 {}

    private ?Chat $chat;
    public function addMember(): array
    {

//         if ($this->chat == null) {
//             throw new \Exception("Chat is null");
//         }

        $chatMember = new ChatMember();
        $body = $this->requestService->getPostBody();

        $chat_id = $body["chat_id"];
        $member_id = $body["member_id"] ?? null;

        $chat = $this->entityManager->getRepository(Chat::class)->find($chat_id);
        $user = $this->entityManager->getRepository(User::class)->find($member_id);

        if (!$user) {
            return [
                "chat" => "no"
            ];
        }


        $members = $this->memberRepository->getAllMembers($chat);

        foreach ($members as $member) {
            if ($member["id"] == $user->getId()) {
                return [
                    "chat" => "no"
                ];
            }
        }

        $chatMember->setChat($chat);
        $chatMember->setMember($user);
        $chat->incrementMembersCount();
        $this->entityManager->persist($chatMember);
        $this->entityManager->flush();

        return [
            "chat" => "ok"
        ];
    }
    
    public function getMembers()
    {
        $chat_id = $this->request->getCurrentRequest()->query->get("chatId");

        $chat = $this->entityManager->getRepository(Chat::class)->find((int)$chat_id);

        if ($chat) {
            $members = $this->memberRepository->getAllMembers($chat);

            return [
                "members" => $members
            ];
        } else {
            throw new Exception("Chat no exists");
        }
    }
    
    public function deleteMember(bool $canLeave = false) : array
    {
        $body = $this->requestService->getPostBody();
        $chat_id = $body["chat_id"];
        $member_id = $body["member_id"] ?? null;

        if (!$chat_id && (!$member_id && !$canLeave)) {
            throw new \Exception("No chat or member id provided");
        }

        $chat = $this->entityManager->getRepository(Chat::class)->find($chat_id);

        if (!$chat) {
            throw new Exception("Chat with id $chat_id no exists");
        }

        if ($canLeave) {
            $member = $this->security->getUser();
        } else {
            $member = $this->entityManager->getRepository(User::class)->find($member_id);
        }

        if (!$chat->getOwner()->getUserIdentifier() == $this->security->getUser()->getUserIdentifier()) {
            throw new AccessDeniedException();
        }

        if (!$member) {
            throw new \Exception("User with id $member_id not exists");
        }


        if ($member->getUserIdentifier() == $this->security->getUser()->getUserIdentifier() && !$canLeave) {
            throw new \Exception("Cannot kick yourself");
        }

        $chatMember = $this->entityManager
            ->getRepository(ChatMember::class)
            ->findOneBy([
                "chat" => $chat_id,
                "member" => $member
            ]);

        if ($chatMember) {
            $membersCount = count($this->memberRepository->getAllMembers($chat));
            if ($canLeave && $membersCount === 1) {
                $messages = $this->entityManager->getRepository(ChatMessage::class)->findBy(["chat" => $chat]);

                foreach ($messages as $message) {
                    $this->entityManager->remove($message);
                }

                $this->entityManager->remove($chat);
                $this->entityManager->remove($chatMember);
                $this->entityManager->flush();
            } else {
                $this->entityManager->remove($chatMember);
                $chat->decrementMembersCount();
                $this->entityManager->flush();
            }
            return [
                "message" => "Member ".$member->getUserIdentifier()." was kicked"
            ];
        } else {
            throw new Exception("Chat ".$chat->getTitle()." has no ".$member->getUserIdentifier()." member");
        }
    }

    public function getAllMembers () {

        $qb = $this->chatRepository->getMembers($this->chat->getId());
        return $qb;
    }

    public function setChat(Chat $chat) : static {
         $this->chat = $chat;

         return $this;
    }

}