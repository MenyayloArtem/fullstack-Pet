<?php

namespace App\Entity;

use App\Repository\TopicRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\MaxDepth;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TopicRepository::class)]
#[UniqueEntity(fields : "title", message: "Такая тема уже есть")]
class Topic
{
    public function __construct()
    {
        $this->topicMessages = new ArrayCollection();
        $this->cliped = false;
        $this->date_created = new \DateTime();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    private string $title;

    #[ORM\ManyToOne(inversedBy: 'topics')]
    #[ORM\JoinColumn(name: "section_id", referencedColumnName: "id", nullable: false)]
    private ?Section $section = null;

    #[ORM\OneToMany(mappedBy: 'topic', targetEntity: TopicMessage::class)]
    private Collection $topicMessages;

    #[ORM\Column]
    private bool $cliped;
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private \DateTimeInterface $date_created;


    #[ORM\ManyToOne(inversedBy: "user")]
    #[ORM\JoinColumn(name: "author_id", referencedColumnName: "id", nullable: false)]
    private User $author;

    #[ORM\OneToOne]
    #[ORM\JoinColumn(name: "last_message_id", referencedColumnName: "id", nullable: true)]
    private ?TopicMessage $last_message = null;

    public function setLastMessage (TopicMessage $message): static
    {
        $this->last_message = $message;
        return $this;
    }

    public function getLastMessage (): ?TopicMessage
    {
        return $this->last_message;
    }
    public function getCliped(): bool
    {
        return $this->cliped;
    }

    public function getDateCreated(): \DateTime|\DateTimeInterface
    {
        return $this->date_created;
    }

    public function getAuthor(): User
    {
        return $this->author;
    }

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

    public function getSection(): ?Section
    {
        return $this->section;
    }

    public function setSection(?Section $section): static
    {
        $this->section = $section;

        return $this;
    }

    public function setAuthor(User $user): static
    {
        $this->author = $user;

        return $this;
    }

    public function setCliped(bool $cliped): static
    {
        $this->cliped = $cliped;

        return $this;
    }

    /**
     * @return Collection<int, TopicMessage>
     */
    public function getTopicMessages(): Collection
    {
        return $this->topicMessages;
    }

    public function addTopicMessage(TopicMessage $topicMessage): static
    {
        if (!$this->topicMessages->contains($topicMessage)) {
            $this->topicMessages->add($topicMessage);
            $topicMessage->setTopic($this);
        }

        return $this;
    }

    public function removeTopicMessage(TopicMessage $topicMessage): static
    {
        if ($this->topicMessages->removeElement($topicMessage)) {
            // set the owning side to null (unless already changed)
            if ($topicMessage->getTopic() === $this) {
                $topicMessage->setTopic(null);
            }
        }

        return $this;
    }
}
