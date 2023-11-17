<?php

namespace App\Controller;

use App\Entity\Media;
use Doctrine\DBAL\Driver\PDO\Exception;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\File;

class MediaController extends AbstractController
{
    #[Route('/upload', name: 'app_media')]
    public function upload(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        Request $request
    ): JsonResponse
    {
        $file = $request->files->get("file");
        $user = $this->getUser();
        if (!$file) throw new \Exception("No file provided");
        if (!$user) throw new Exception();

        $mime = new MimeTypes();

        $fileExtension = $file->getClientOriginalExtension();
        $finalFilename = uniqid().".".$fileExtension;


        $media = new Media();
        $media->setPath($finalFilename);
        $media->setType($mime->getMimeTypes($file->guessExtension())[0]);
        $media->setSender($user);
        $file->move("/home/myubuntu/Box/PhpTest/test/upload", $finalFilename);


        $entityManager->persist($media);
        $entityManager->flush();

        return $this->json([
            'media' => $media,
        ]);
    }
}
