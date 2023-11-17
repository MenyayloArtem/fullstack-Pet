<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\SignUpService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use JMS\Serializer\SerializerInterface;

class SighUpController extends AbstractController
{
    /**
     * @throws ORMException
     */
    #[Route('/signup', name: 'app_home', methods: ["POST"])]
    public function index(
        SignUpService $signUp,
        Request $request
    ): JsonResponse

    {
        $body = json_decode($request->getContent(), true);
        $res = $signUp->signUp($body);

        return $this->json([
            'message' => ($res),
            'path' => 'src/Controller/SighUpController.php',
        ]);
    }
}
