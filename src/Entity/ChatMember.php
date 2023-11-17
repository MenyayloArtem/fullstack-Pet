<?php

namespace App\Entity;

use App\Repository\ChatMemberRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: ChatMemberRepository::class)]
#[UniqueEntity(fields: ["chat", "member"], message: "dfdf")]
class ChatMember
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Chat::class, inversedBy: 'chatMembers')]
    #[ORM\JoinColumn(nullable: false)]
    private Chat $chat;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private User $member;

    public function getMember (): User
    {
        return $this->member;
    }

    public function getChat(): Chat
    {
        return $this->chat;
    }

    public function setMember(User $member): static
    {
        $this->member = $member;
        return $this;
    }

    public function setChat(Chat $chat): Chat
    {
        $this->chat = $chat;
        return $chat;
    }
}
