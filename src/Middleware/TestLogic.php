<?php

namespace App\Middleware;

use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\Driver\Exception;
use Doctrine\DBAL\Driver\Middleware\AbstractDriverMiddleware;

class TestLogic extends AbstractDriverMiddleware
{
    /**
     * @throws Exception
     */
    public function test (array $params) : Connection {

        if (!$params["user"]) {
            throw new \Exception("no user");
        }

        return parent::connect($params);
    }
}