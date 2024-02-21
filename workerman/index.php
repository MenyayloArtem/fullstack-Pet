<?php


use Workerman\Worker;

require_once __DIR__ . '/vendor/autoload.php';

// Create a Websocket server
$ws_worker = new Worker('websocket://localhost:3002');

// Emitted when new connection come

$ws_worker->onWorkerStart = function ($worker) {
    $worker->onConnect = function ($connection) {
        echo "New connection\n";
    };

// Emitted when data received
    $worker->onMessage = function ($connection, $data)use($worker) {
        // Send hello $data
        $connections = $worker->connections;

//        echo count($connections);
        foreach ($connections as $c) {
            if ($c != $connection) {
                $c->send($data);
            }
        }

    };

// Emitted when connection closed
    $worker->onClose = function ($connection) {
        echo "Connection closed\n";
    };
};



// Run worker
Worker::runAll();