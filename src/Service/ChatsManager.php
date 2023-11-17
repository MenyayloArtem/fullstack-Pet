<?php

namespace App\Service;

use App\Entity\Chat;
use App\Entity\ChatMember;
use App\Entity\User;
use App\Repository\ChatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ChatsManager
{
 public function __construct(
     private readonly ValidatorInterface $validator,
     private readonly EntityManagerInterface $entityManager,
     private readonly ChatRepository $chatRepository
 )
 {}

    private ?Chat $chat;
    public function addMember(User $member): static|array {

//         if ($this->chat == null) {
//             throw new \Exception("Chat is null");
//         }

         $c = new ChatMember();

         $c->setChat($this->chat);
         $c->setMember($member);

         $errors = $this->validator->validate($c);

         if (count($errors)) {
             return ([
                 "message" => $errors
             ]);
         }

         $this->entityManager->persist($c);
         $this->entityManager->flush();

         return $this;
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