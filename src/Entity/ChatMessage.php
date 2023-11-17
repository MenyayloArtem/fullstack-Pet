<?php

namespace App\Entity;

use App\Repository\ChatMessageRepository;
use App\Trait\MessageWithReply;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChatMessageRepository::class)]
#[ORM\Table(name: "chat_message")]
class ChatMessage extends AbstractMessage
{
    use MessageWithReply;
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Chat $chat = null;

    public function getChat(): ?Chat
    {
        return $this->chat;
    }

    public function setChat(?Chat $chat): static
    {
        $this->chat = $chat;

        return $this;
    }
}
