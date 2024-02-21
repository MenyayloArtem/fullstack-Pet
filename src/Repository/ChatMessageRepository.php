<?php

namespace App\Repository;

use App\Entity\Chat;
use App\Entity\ChatMember;
use App\Entity\ChatMessage;
use App\Entity\Media;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @extends ServiceEntityRepository<ChatMessage>
 *
 * @method ChatMessage|null find($id, $lockMode = null, $lockVersion = null)
 * @method ChatMessage|null findOneBy(array $criteria, array $orderBy = null)
 * @method ChatMessage[]    findAll()
 * @method ChatMessage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChatMessageRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $entityManager;
    public function __construct(ManagerRegistry $registry, Security $security,
    private readonly SerializerInterface $serializer
    )
    {
        parent::__construct($registry, ChatMessage::class);
        $this->security = $security;
    }

    public function getMessages (int $chatId, ?int $page): array
    {
        $messagesPerPage = 15;
        $em = $this->getEntityManager();
        $chat = $em->getRepository(Chat::class)->find($chatId);

        if ($page) {
            $res = $em->getRepository(ChatMessage::class)->findBy(
                ["chat" => $chat],
                ["date_created" => "DESC"],
                $messagesPerPage,
                $messagesPerPage * ($page - 1) + ($page === 1 ? 0 : 1)
            );
        } else {
            $res = $em->getRepository(ChatMessage::class)->findBy(
                ["chat" => $chat]
            );
        }


        foreach ($res as $message) {
            $media_ids = $message->getMedias();

            if ($media_ids) {
                $medias = $em->getRepository(Media::class)->findBy(["id" => $media_ids]);
                $message->setMedias($medias);
            }
        }

        $mapMessage = function (ChatMessage $message) {
            return json_decode($this->serializer->serialize($message,"json",["groups" => "message"]));
        };
        return array_map($mapMessage, array_reverse($res));
//        return array_reverse($res);
    }

//    /**
//     * @return ChatMessage[] Returns an array of ChatMessage objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ChatMessage
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
