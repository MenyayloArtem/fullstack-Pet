<?php

namespace App\Controller;

use App\Entity\Section;
use App\Service\CheckRole;
use App\Service\RequestService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SectionController extends AbstractController
{
    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    #[Route('/api/section', name: 'app_section', methods: ["POST"])]
    public function index(
        RequestService $requestService,
        CheckRole $checkRole,
        ValidatorInterface $validator,
        EntityManagerInterface $entityManager

    ): JsonResponse
    {
        $isAdmin = $checkRole->isAdmin();
        $body = $requestService->getPostBody();

        if (!$isAdmin) {
            return $this->json([
                'message' => "Access denied"
            ]);
        }

        $section = new Section();

        $title = $body["title"] ?? null;
        $section->setTitle($title);
        $errors = $validator->validate($section);

        if (count($errors) == 0) {
            $entityManager->persist($section);
            $entityManager->flush();

            return $this->json([
                'message' => "Section $title created",
                'path' => 'src/Controller/SectionController.php',
            ]);
        } else {
            return $this->json([
                "error" => (string) $errors
            ]);
        }
    }

    #[Route("/api/sections", name: "get_all_sections", methods: ["GET"])]
    public function getSections(
        EntityManagerInterface $entityManager
    ) : JsonResponse {
        $sections = $entityManager->getRepository(Section::class)->findAll();
        return $this->json($sections);
    }
}
