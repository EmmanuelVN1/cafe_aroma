<?php

function conectar(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $archivo = __DIR__ . '/config.php';
    if (!is_file($archivo)) {
        throw new RuntimeException('Falta api/config.php.');
    }

    $c = require $archivo;
    $dsn = "mysql:host={$c['host']};port={$c['puerto']};dbname={$c['base']};charset=utf8mb4";

    $pdo = new PDO($dsn, $c['usuario'], $c['clave'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    return $pdo;
}