<?php

namespace App\Entity;

use App\Repository\MediaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\NotBlank;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
class Media
{
    public function __construct()
    {
        $this->public = false;
        $this->props = [];
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["public", "message"])]
    private ?int $id = null;

    #[Groups(["public", "message"])]
    #[ORM\Column(length: 31)]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 511)]
    private ?string $path = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[NotBlank]
    private User $sender;

    #[ORM\Column(type: "json")]
    #[Groups(["public", "message"])]
    private $props = [];

    public function getSender(): User
    {
        return $this->sender;
    }

    public function setSender(User $sender): static
    {
        $this->sender = $sender;

        return $this;
    }

    #[ORM\Column(nullable: false)]
    private bool $public;

    public function isPublic(): bool
    {
        return $this->public;
    }

    public function setPublic(bool $public): void
    {
        $this->public = $public;
    }

    public function setProps(mixed $props)
    {
       $this->props = $props;
    }

    public function getProps(): array
    {
        return $this->props;
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }
}
