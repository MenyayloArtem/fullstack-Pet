<?php

namespace App\Service;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;

class CheckRole
{
    function __construct(
        private readonly Security $security,
    ) {

    }

    public function isAdmin() {
        return $this->security->isGranted("ROLE_ADMIN");
    }

}