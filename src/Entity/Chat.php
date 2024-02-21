<?php

namespace App\Entity;

use App\Repository\ChatRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\NotBlank;

#[ORM\Entity(repositoryClass: ChatRepository::class)]
class Chat
{

    public function __construct(
        private readonly int $entityManager
    )
    {
        $this->members_count = 1;
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["public", "message"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Media $icon = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[NotBlank]
    private User $owner;

    #[ORM\Column]
    #[NotBlank]
    private int $members_count;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }


    public function setTitle(string $title): static
    {
        $this->title = $title;

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

    public function getIcon(): ?Media
    {
        return $this->icon;
    }

    public function setIcon(?Media $icon): static
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return array
     */
    public function getMembers(): array
    {
        return [];
    }

    public function addMember(User $member): ChatMember
    {
        $chatMember = new ChatMember();
        $chatMember->setMember($member);
        $chatMember->setChat($this);

        return $chatMember;
    }

    public function setOwner (User $owner): void
    {
        $this->owner = $owner;
    }

    public function getOwner(): User
    {
        return $this->owner;
    }

    public function getMembersCount(): int
    {
        return $this->members_count;
    }

    public function incrementMembersCount(): int
    {
        return $this->members_count+=1;
    }

    public function decrementMembersCount(): int
    {
        if ($this->members_count - 1 > 0) {
            return $this->members_count-=1;
        } else {
            return $this->members_count;
        }
    }
}
