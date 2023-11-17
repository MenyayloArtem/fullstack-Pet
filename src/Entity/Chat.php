<?php

namespace App\Entity;

use App\Repository\ChatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Validator\Constraints\NotBlank;

#[ORM\Entity(repositoryClass: ChatRepository::class)]
class Chat
{


    private $entityManager;
    public function __construct(
        EntityManagerInterface $entityManager,
        private readonly ChatRepository $chatRepository
    )
    {
        $this->members_count = 1;
        $this->chatMembers = new ArrayCollection();
        $this->entityManager = $entityManager;
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
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

    #[ORM\ManyToMany(targetEntity: ChatMember::class, mappedBy: 'chat')]
    private Collection $chatMembers;

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
        return $this->chatRepository->getMembers($this->getId());
    }

    public function addMember(User $member): ChatMember
    {
        $chatMember = new ChatMember();
        $chatMember->setMember($member);
        $chatMember->setChat($this);

        return $chatMember;
    }

    public function removeChatMember(ChatMember $chatMember): static
    {
        if ($this->chatMembers->removeElement($chatMember)) {
            $chatMember->removeChat($this);
        }

        return $this;
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
}
