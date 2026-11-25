<?php

function responder(int $estado, $datos): void
{
    http_response_code($estado);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function buscarFoto(PDO $pdo, int $id): array
{
    $consulta = $pdo->prepare(
        'SELECT id, titulo, categoria, imagen, descripcion FROM fotos WHERE id = ?'
    );
    $consulta->execute([$id]);
    $foto = $consulta->fetch();

    if ($foto === false) {
        responder(404, ['error' => 'No se encontró una foto con ese id.']);
    }

    return $foto;
}