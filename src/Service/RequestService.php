<?php

namespace App\Service;

use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

enum MyErrors: string {
    case Unauthorized = "Unauthorized";
}
class RequestService
{
    public function __construct(
        private RequestStack $request,
        private readonly SerializerInterface $serializer
    )
    {

    }

    public function getPostBody() {
        return json_decode($this->request->getCurrentRequest()->getContent(), true);
    }


    public function serializeEntity (mixed $entity) {
        return json_decode($this->serializer->serialize($entity, "json"));
    }
}