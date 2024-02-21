<?php

namespace App\Trait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait MessageWithReply
{
    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups("message")]
    private ?self $reply_message = null;


    public function getReplyMessage(): self|null {
        return $this->reply_message;
    }

    public function setReplyMessage(self $ReplyMessage): static {
        $this->reply_message = $ReplyMessage;

        return $this;
    }
}