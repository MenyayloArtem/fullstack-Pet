<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class SignUpService
{
    public function __construct(
        private readonly EntityManagerInterface      $entityManager,
        private readonly UserPasswordHasherInterface $hasher,
        private readonly SerializerInterface $serializer,
        private readonly UserRepository $userRepository
    ){
    }

    public function signUp(array $body) {
        $user = new User();

        $emailExists = $this->checkEmail($body["email"]);

        if ($emailExists) {
            return "Email is already exists. Please, try another email";
        }
        $user->setEmail($body["email"]);
        $plainPassword = $body["password"];
        $hash = $this->hasher->hashPassword($user, $plainPassword);
        $user->setPassword($hash);
        $user->setRoles(["USER_ROLE"]);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return json_decode($this->serializer->serialize($user, 'json'));
    }

    private function checkEmail(string $email) : bool {
        return ((bool)($this->userRepository->findOneBy(["email" => $email])));
    }
}