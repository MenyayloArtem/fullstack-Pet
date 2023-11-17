<?php

namespace App\Repository;

use App\Entity\TopicMessage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TopicMessage>
 *
 * @method TopicMessage|null find($id, $lockMode = null, $lockVersion = null)
 * @method TopicMessage|null findOneBy(array $criteria, array $orderBy = null)
 * @method TopicMessage[]    findAll()
 * @method TopicMessage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TopicMessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TopicMessage::class);
    }

//    /**
//     * @return TopicMessage[] Returns an array of TopicMessage objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?TopicMessage
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
