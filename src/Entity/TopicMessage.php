<?php

namespace App\Entity;

use App\Repository\TopicMessageRepository;
use App\Trait\MessageWithReply;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TopicMessageRepository::class)]
class TopicMessage extends AbstractMessage
{
    use MessageWithReply;
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Topic $topic = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTopic(): ?Topic
    {
        return $this->topic;
    }

    public function setTopic(?Topic $topic): static
    {
        $this->topic = $topic;

        return $this;
    }
}
