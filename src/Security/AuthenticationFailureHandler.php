<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use \Symfony\Component\HttpFoundation\JsonResponse;

class AuthenticationFailureHandler implements AuthenticationFailureHandlerInterface
{
public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
{
$data = [
'message' => 'Пользователь не авторизован',
];

return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
}
}
