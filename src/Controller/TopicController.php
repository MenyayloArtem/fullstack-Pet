<?php

namespace App\Controller;

use App\Entity\Section;
use App\Entity\Topic;
use App\Entity\TopicMessage;
use App\Repository\AbstractMessageRepository;
use App\Service\RequestService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TopicController extends AbstractController
{
    #[Route('/api/newTopic', name: 'app_topic', methods: ["POST"])]
    public function createTopic(
        EntityManagerInterface $entityManager,
        RequestService $requestService,
        ValidatorInterface $validator
    ): JsonResponse
    {
        $body = $requestService->getPostBody();
        $title = $body["title"];
        $section_id = $body["section_id"];

        $topic = new Topic();
        $topic->setTitle($title);
        $topic->setAuthor($this->getUser());

        $section = $entityManager->getRepository(Section::class)->find($section_id);
        $topic->setSection($section);

        $errors = $validator->validate($topic);

        if (!count($errors)) {
            $entityManager->persist($topic);
            $entityManager->flush();

            return $this->json([
                'message' => "Created ".$topic->getTitle(),
                'path' => 'src/Controller/TopicController.php',
            ]);
        } else {
            return $this->json([
                "message" => ($errors)
            ]);
        }
    }

    #[Route("/api/topic/{topicId}/message", name: "add_topic_message", methods: ["POST"])]
    public function addMessage(
        AbstractMessageRepository $messageRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ) : JsonResponse {
        $topicId = $request->attributes->get("topicId");
        $topic = $entityManager->getRepository(Topic::class)->find($topicId);

        if (!$topic) throw new EntityNotFoundException("Not found");

        $message = new TopicMessage();
        $message->setTopic($topic);

        $messageRepository->initMessage($message);

        $topic->setLastMessage($message);
        $entityManager->persist($message);
        $entityManager->flush();
        return $this->json($message->getSender());
    }

    #[Route("/api/topic/{topicId}/message", name: "edit_topic_message", methods: ["PATCH"])]
    public function editMessage (
        EntityManagerInterface $entityManager,
        RequestService $requestService,
        AbstractMessageRepository $messageRepository,
        Request $request
    ) : JsonResponse {


        $message = $entityManager->getRepository(TopicMessage::class)->find($requestService->getPostBody()["message_id"]);
        if (!$message) throw new EntityNotFoundException();

        if ($message->getTopic()->getId() !== (int)$request->attributes->get("topicId")) throw new AccessDeniedException("Access Denied");

        $messageRepository->updateMessage($message);
        $entityManager->flush();

        return $this->json($message->getContent());
    }
}
