<?php

namespace App\Repository;

use App\Entity\Chat;
use App\Entity\ChatMember;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use mysql_xdevapi\Exception;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @extends ServiceEntityRepository<ChatMember>
 *
 * @method ChatMember|null find($id, $lockMode = null, $lockVersion = null)
 * @method ChatMember|null findOneBy(array $criteria, array $orderBy = null)
 * @method ChatMember[]    findAll()
 * @method ChatMember[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChatMemberRepository extends ServiceEntityRepository
{

    private Security $security;
    public function __construct(ManagerRegistry $registry, Security $security)
    {
        parent::__construct($registry, ChatMember::class);
        $this->security = $security;
    }

    public function getAll(Chat $chat) {
        $em = $this->getEntityManager();
        $chatId = $chat->getId();

        $res = $em->getRepository(ChatMember::class)->createQueryBuilder("cm")
            ->select("u.id, u.email")
            ->from("App\\Entity\\User", "u")
            ->innerJoin("cm.chat", "c")
            ->where("c.id = :id and cm.member = u")
            ->setParameter("id", $chatId)
            ->getQuery()
            ->getResult();

        return $res;
    }

    public function checkMembership (Chat $chat): bool {
        $members = $this->getAll($chat);
        $user = $this->security->getUser();

        if (!$user) throw new \Symfony\Component\Config\Definition\Exception\Exception("Unauthenticated");

        foreach ($members as $member) {
            if ($member["email"] == $user->getUserIdentifier()) return true;
        }

        return false;
    }

//    /**
//     * @return ChatMember[] Returns an array of ChatMember objects
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

//    public function findOneBySomeField($value): ?ChatMember
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
