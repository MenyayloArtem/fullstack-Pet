<?php

namespace App\Repository;

use App\Entity\AbstractMessage;
use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Entity\Media;
use App\Service\RequestService;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Driver\PDO\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface;

/**
 * @extends ServiceEntityRepository<AbstractMessage>
 *
 * @method AbstractMessage|null find($id, $lockMode = null, $lockVersion = null)
 * @method AbstractMessage|null findOneBy(array $criteria, array $orderBy = null)
 * @method AbstractMessage[]    findAll()
 * @method AbstractMessage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AbstractMessageRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry,
                                private readonly Security $security,
    private readonly RequestService $requestService,
    private readonly EntityManagerInterface $entityManager
    )
    {
        parent::__construct($registry, AbstractMessage::class);
    }
    private readonly AbstractMessage $messageClass;

    public function setMessageClass (AbstractMessage $message) {
        $this->messageClass = $message;

        return $this;
    }

    public function isSender(AbstractMessage $message): bool {
        $user = $this->security->getToken()->getUser();
        return $message->getSender()->getUserIdentifier() === $user->getUserIdentifier();
    }

    /**
     * @throws Exception
     */
    public function initMessage (AbstractMessage $message) {
        $user = $this->security->getUser();
        $body = $this->requestService->getPostBody();

        $text = $body["text"] ?? "";
        $media_ids = $body["media_ids"] ?? [];
        $reply_id = $body["reply_id"] ?? null;

        if ($text || ($media_ids && count($media_ids))) {

            $message->setSender($user);
            $message->setContent($text);

            if (!empty($media_ids)) {
                $medias = $this->entityManager->getRepository(Media::class)->findBy(["id" => $media_ids]);

                if (count($medias) < count($media_ids)) {
                    throw new \Exception("No media");
                }

                foreach ($medias as $media) {
                    $media->setPublic(true);
                }
            }

            $message->setMedias($media_ids);

            if ($reply_id) {
                $replyMessage = $this->entityManager->getRepository($message::class)->find($reply_id);

                if (!$replyMessage) throw new NotFoundHttpException("Reply message not found");

                $message->setReplyMessage($replyMessage);
            }

            return ([
                "id" => $message->getId(),
                "sender" => $message->getSender(),
                "content" => $message->getContent(),
                "reply_message" => $message->getReplyMessage(),
                "medias" => $medias
            ]);
        } else {
            throw new Exception("Text or medias not provided");
        }
    }

    public function updateMessage (AbstractMessage $message) {
        $body = $this->requestService->getPostBody();

        $now = new \DateTime();
        $timeDiff = $now->getTimestamp() - $message->getDateCreated()->getTimestamp();

        if ($timeDiff / 3600 >= 1) throw new \Exception("Cannot edit after hour");
        if (!$message) throw new EntityNotFoundException("Message not found");
        if (!$this->isSender($message)) throw new AccessDeniedException("Access denied");

        $payload = $body["payload"];

        $text = $payload["text"] ?? "";
        $medias = $payload["medias"] ?? [];


        if ($text) $message->setContent($text);
        if(!empty($medias)) $message->setMedias($medias);

        return $message;

    }

//    /**
//     * @return AbstractMessage[] Returns an array of AbstractMessage objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AbstractMessage
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
