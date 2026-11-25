<?php

require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if (!in_array($metodo, ['GET', 'POST', 'PUT', 'DELETE'], true)) {
    header('Allow: GET, POST, PUT, DELETE');
    responder(405, ['error' => 'Método no permitido.']);
}

try {
    $id = null;

    if (isset($_GET['id'])) {
        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1]
        ]);

        if ($id === false) {
            responder(400, ['error' => 'El id debe ser un entero positivo.']);
        }
    }

    if (in_array($metodo, ['PUT', 'DELETE'], true) && $id === null) {
        responder(400, ['error' => 'Falta el id de la foto.']);
    }

    $pdo = conectar();

    if ($metodo === 'GET') {
        if ($id !== null) {
            responder(200, buscarFoto($pdo, $id));
        }

        $consulta = $pdo->query(
            'SELECT id, titulo, categoria, imagen, descripcion FROM fotos ORDER BY id'
        );
        responder(200, $consulta->fetchAll());
    }

    if ($metodo === 'DELETE') {
        $consulta = $pdo->prepare('DELETE FROM fotos WHERE id = ?');
        $consulta->execute([$id]);

        if ($consulta->rowCount() === 0) {
            responder(404, ['error' => 'No se encontró una foto con ese id.']);
        }

        http_response_code(204);
        exit;
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

    if (
        !preg_match('/\A[a-z0-9_-]+\.(?:avif|webp|jpe?g|jfif|png)\z/i', $imagen)
        || !is_file(__DIR__ . '/../assets/img/' . $imagen)
    ) {
        responder(422, ['error' => 'Elige una imagen disponible en la cafetería.']);
    }

    if ($metodo === 'POST') {
        $consulta = $pdo->prepare(
            'INSERT INTO fotos (titulo, categoria, imagen, descripcion) VALUES (?, ?, ?, ?)'
        );
        $consulta->execute([$titulo, $categoria, $imagen, $descripcion]);

        responder(201, buscarFoto($pdo, (int) $pdo->lastInsertId()));
    }

    if ($metodo === 'PUT') {
        $consulta = $pdo->prepare(
            'UPDATE fotos SET titulo = ?, categoria = ?, imagen = ?, descripcion = ? WHERE id = ?'
        );
        $consulta->execute([$titulo, $categoria, $imagen, $descripcion, $id]);

        responder(200, buscarFoto($pdo, $id));
    }

} catch (Throwable $error) {
    error_log($error->getMessage());
    responder(500, ['error' => 'No se pudo leer o guardar la galería. Inténtalo de nuevo.']);
}