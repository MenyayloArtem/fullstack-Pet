<?php

namespace App\Controller;

use App\Entity\Media;
use App\Shared\Routes;
use Doctrine\DBAL\Driver\PDO\Exception;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\File;

class MediaController extends AbstractController
{
    #[Route('/upload', name: 'app_media', methods: ["POST"])]
    public function upload(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        Request $request
    ): JsonResponse
    {
        $file = $request->files->get("file");
        $uploadDir = Routes::uploadDir;

        $mime = new MimeTypes();
        $mimeType = $mime->getMimeTypes($file->guessExtension())[0];

        $fileType = explode("/",$mimeType)[0];
        $props = [];
        switch ($fileType) {
            case "image" : {
                $info = getimagesize($file);
                list($width, $height) = $info;

                $props = [
                    "width" => $width,
                    "height" => $height
                ];
                $uploadDir.="/image";
                break;
            }

            case "audio" : {
                $uploadDir.="/audio";
                break;
            }
        }

        $user = $this->getUser();
        if (!$file) throw new \Exception("No file provided");
        if (!$user) throw new Exception();

        $fileExtension = $file->getClientOriginalExtension();
        $finalFilename = uniqid().".".$fileExtension;


        $media = new Media();
        $media->setPath($finalFilename);
        $media->setType($mimeType);
        $media->setSender($user);
        $media->setProps($props);
        $file->move($uploadDir, $finalFilename);


        $entityManager->persist($media);
        $entityManager->flush();

        return $this->json([
            'media' => $media,
        ]);
    }

    #[Route("/media/{mediaId}", name: "get_media", methods: ["GET"])]
    function getMedia(
        Request $request,
        EntityManagerInterface $entityManager
    ) : BinaryFileResponse
    {
        $uploadDir = Routes::uploadDir;
        $mediaId = (int)$request->attributes->get("mediaId");
        $media = $entityManager->getRepository(Media::class)->find($mediaId);
        $type = $media->getType();
        $type = explode("/",$type)[0];
        $response = new BinaryFileResponse($uploadDir.'/'.$type."/".$media->getPath());
        return $response;
    }
}
