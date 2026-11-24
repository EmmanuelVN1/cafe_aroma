<?php

require __DIR__ . '/helpers.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo !== 'GET' && $metodo !== 'POST') {
    header('Allow: GET, POST');
    responder(405, ['error' => 'Usa GET para consultar o POST para agregar una foto.']);
}

try {
    $iniciales = require __DIR__ . '/data/fotos_iniciales.php';

    if ($metodo === 'GET') {
        $fotos = datosGaleria($iniciales);

        if (!isset($_GET['id'])) {
            responder(200, $fotos);
        }

        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

        foreach ($fotos as $foto) {
            if ($foto['id'] === $id) {
                responder(200, $foto);
            }
        }

        responder(404, ['error' => 'No se encontró una foto con ese id.']);
    }

    $datos = json_decode(file_get_contents('php://input'));

    if (!is_object($datos)) {
        responder(422, ['error' => 'Envía un objeto JSON con título, categoría, imagen y descripción.']);
    }

    $titulo = is_string($datos->titulo ?? null) ? trim($datos->titulo) : '';
    $categoria = $datos->categoria ?? null;
    $imagen = is_string($datos->imagen ?? null) ? trim($datos->imagen) : '';
    $descripcion = is_string($datos->descripcion ?? null) ? trim($datos->descripcion) : '';

    if (!preg_match('/\A.{2,60}\z/us', $titulo)) {
        responder(422, ['error' => 'El título debe tener entre 2 y 60 caracteres.']);
    }

    if (!preg_match('/\A.{5,160}\z/us', $descripcion)) {
        responder(422, ['error' => 'La descripción debe tener entre 5 y 160 caracteres.']);
    }

    if (!in_array($categoria, ['Bebidas', 'Repostería', 'Ambiente'], true)) {
        responder(422, ['error' => 'Elige una de las tres categorías de la galería.']);
    }

    if (!preg_match('/\A[a-z0-9_-]+\.(?:avif|webp|jpe?g|jfif|png)\z/i', $imagen)
        || !is_file(__DIR__ . '/../assets/img/' . $imagen)) {
        responder(422, ['error' => 'Elige una imagen disponible en la cafetería.']);
    }

    $creada = datosGaleria($iniciales, [
        'titulo' => $titulo,
        'categoria' => $categoria,
        'imagen' => $imagen,
        'descripcion' => $descripcion
    ]);

    responder(201, $creada);
} catch (Throwable $error) {
    error_log($error->getMessage());
    responder(500, ['error' => 'No se pudo leer o guardar la galería. Inténtalo de nuevo.']);
}