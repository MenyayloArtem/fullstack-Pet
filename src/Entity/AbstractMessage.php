<?php

namespace App\Entity;

use App\Repository\AbstractMessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\SerializerInterface;


abstract class AbstractMessage
{

    public function __construct(

    )
    {
        $this->date_created = new \DateTime();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    protected ?int $id = null;
    #[ORM\Column(length: 2047)]
    protected ?string $content = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    protected ?\DateTimeInterface $date_created = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    protected ?User $sender = null;

    #[ORM\Column(nullable: true)]
    protected ?array $medias = [];

    #[Groups("message")]
    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups("message")]
    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    #[Groups("message")]
    public function getDateCreated(): ?\DateTimeInterface
    {
        return $this->date_created;
    }

    public function setDateCreated(\DateTimeInterface $date_created): static
    {
        $this->date_created = $date_created;

        return $this;
    }

    #[Groups("message")]
    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): static
    {
        $this->sender = $sender;

        return $this;
    }

    #[Groups("message")]
    public function getMedias(): ?array
    {
        return $this->medias;
    }

    public function setMedias(?array $medias): static
    {
        $this->medias = $medias;

        return $this;
    }
}
